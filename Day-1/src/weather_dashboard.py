import os
import aiohttp
import asyncio
import boto3
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class WeatherDashboard:
    def __init__(self):
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.bucket_name = os.getenv('AWS_BUCKET_NAME')
        self.region = os.getenv('AWS_REGION', 'us-east-1')  # Default region
        self.s3_client = boto3.client('s3', region_name=self.region)

        # Validate critical environment variables
        if not self.api_key or not self.bucket_name:
            print("⚠️ Missing required environment variables in the .env file.")
            print("Please add the following variables to your .env file:")
            print("  - OPENWEATHER_API_KEY=<your_openweather_api_key>")
            print("  - AWS_BUCKET_NAME=<your_s3_bucket_name>")
            print("  - AWS_REGION=<your_aws_region> (optional, defaults to 'us-east-1')")
            raise EnvironmentError("Environment variables not properly set up.")

    def create_bucket_if_not_exists(self):
        """Create S3 bucket if it doesn't exist."""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            print(f"✅ Bucket '{self.bucket_name}' already exists.")
        except self.s3_client.exceptions.NoSuchBucket:
            print(f"⚙️ Bucket '{self.bucket_name}' does not exist. Creating it...")
            try:
                if self.region == 'us-east-1':
                    self.s3_client.create_bucket(Bucket=self.bucket_name)
                else:
                    self.s3_client.create_bucket(
                        Bucket=self.bucket_name,
                        CreateBucketConfiguration={'LocationConstraint': self.region}
                    )
                print(f"✅ Successfully created bucket '{self.bucket_name}'.")
            except Exception as e:
                print(f"❌ Error creating bucket: {e}")
                raise
        except Exception as e:
            print(f"❌ Error checking bucket: {e}")
            raise

    async def fetch_weather(self, session, city):
        """Fetch weather data from OpenWeather API."""
        base_url = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": city.strip(),
            "appid": self.api_key,
            "units": "imperial"
        }

        try:
            async with session.get(base_url, params=params) as response:
                response.raise_for_status()
                return await response.json()
        except aiohttp.ClientError as e:
            print(f"❌ Error fetching weather data for {city}: {e}")
            return None

    async def fetch_weather_for_cities(self, cities):
        """Fetch weather data concurrently for multiple cities."""
        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_weather(session, city) for city in cities]
            return await asyncio.gather(*tasks)

    def save_to_s3(self, weather_data, city):
        """Save weather data to S3 bucket."""
        if not weather_data:
            print(f"❌ No data to save for {city}.")
            return False

        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        file_name = f"weather-data/{city}-{timestamp}.json"

        try:
            weather_data['timestamp'] = timestamp
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_name,
                Body=json.dumps(weather_data),
                ContentType='application/json'
            )
            print(f"✅ Successfully saved data for {city} to S3 as '{file_name}'.")
            return True
        except Exception as e:
            print(f"❌ Error saving data for {city} to S3: {e}")
            return False

def main():
    print("🌤️ Welcome to the Weather Dashboard!")
    print("You can check the current weather for multiple cities and save the data to an AWS S3 bucket.\n")

    # Prompt the user for cities
    user_input = input("Enter city names separated by commas (or press ENTER for default cities): ")
    user_cities = [city.strip() for city in user_input.split(",") if city.strip()]
    default_cities = ["New York", "Delhi", "Tokyo"]
    cities = user_cities if user_cities else default_cities

    print(f"\n📍 Selected cities: {', '.join(cities)}")

    # Initialize dashboard
    try:
        dashboard = WeatherDashboard()
    except EnvironmentError as e:
        print(e)
        return

    # Create bucket if needed
    dashboard.create_bucket_if_not_exists()

    # Fetch weather data asynchronously
    print("\n⏳ Fetching weather data...")
    weather_data_list = asyncio.run(dashboard.fetch_weather_for_cities(cities))

    # Display and save weather data
    for city, weather_data in zip(cities, weather_data_list):
        if weather_data:
            print(f"\n🌆 City: {city}")
            print(f"   🌡️ Temperature: {weather_data['main']['temp']}°F")
            print(f"   🌀 Feels like: {weather_data['main']['feels_like']}°F")
            print(f"   💧 Humidity: {weather_data['main']['humidity']}%")
            print(f"   🌤️ Conditions: {weather_data['weather'][0]['description']}")
            dashboard.save_to_s3(weather_data, city)
        else:
            print(f"❌ Failed to fetch weather data for {city}.")

    print("\n🌟 Thank you for using the Weather Dashboard!")

if __name__ == "__main__":
    main()
