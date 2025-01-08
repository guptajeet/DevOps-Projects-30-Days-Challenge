import os
import aiohttp
import asyncio
import boto3
import json
import matplotlib.pyplot as plt
from datetime import datetime
from dotenv import load_dotenv
import argparse

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
            raise EnvironmentError("Missing required environment variables: Check .env file.")

    def create_bucket_if_not_exists(self):
        """Create S3 bucket if it doesn't exist."""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            print(f"Bucket '{self.bucket_name}' already exists.")
        except self.s3_client.exceptions.NoSuchBucket:
            print(f"Bucket '{self.bucket_name}' does not exist. Creating it...")
            if self.region == 'us-east-1':
                self.s3_client.create_bucket(Bucket=self.bucket_name)
            else:
                self.s3_client.create_bucket(
                    Bucket=self.bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': self.region}
                )
            print(f"Successfully created bucket '{self.bucket_name}'.")
        except Exception as e:
            print(f"Error checking/creating bucket: {e}")
            raise

    async def fetch_weather(self, session, city):
        """Fetch weather data from OpenWeather API."""
        base_url = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": city,
            "appid": self.api_key,
            "units": "imperial"
        }

        try:
            async with session.get(base_url, params=params) as response:
                response.raise_for_status()
                return await response.json()
        except aiohttp.ClientError as e:
            print(f"Error fetching weather data for {city}: {e}")
            return None

    async def fetch_weather_for_cities(self, cities):
        """Fetch weather data concurrently for multiple cities."""
        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_weather(session, city) for city in cities]
            return await asyncio.gather(*tasks)

    def save_to_s3(self, weather_data, city):
        """Save weather data to S3 bucket."""
        if not weather_data:
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
            print(f"Successfully saved data for {city} to S3 as {file_name}.")

            # Added: Update index.json for listing historical data
            index_file = "weather-data/index.json"
            try:
                # Fetch existing index
                index_data = self.s3_client.get_object(Bucket=self.bucket_name, Key=index_file)['Body'].read().decode()
                index = json.loads(index_data)
            except self.s3_client.exceptions.NoSuchKey:
                index = []

            index.append({"city": city, "file_name": file_name, "timestamp": timestamp})

            # Save updated index
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=index_file,
                Body=json.dumps(index),
                ContentType='application/json'
            )

            return True
        except Exception as e:
            print(f"Error saving to S3: {e}")
            return False

    def visualize_weather(self, cities, data):
        """Visualize weather data using a bar chart."""
        temps = [d['main']['temp'] for d in data if d]  # Extract temperatures

        plt.figure(figsize=(10, 6))
        plt.bar(cities, temps, color='skyblue')
        plt.xlabel("Cities")
        plt.ylabel("Temperature (°F)")
        plt.title("Temperature Trends Across Cities")
        plt.show()
        
    def upload_static_files(self):
    """Upload static website files to the root of the S3 bucket."""
    static_files = {
        'app.js': 'application/javascript',
        'index.html': 'text/html',
        'style.css': 'text/css'
    }

    for file_name, content_type in static_files.items():
        file_path = os.path.join('static_website', file_name)
        if not os.path.exists(file_path):
            print(f"File {file_name} not found in the static_website directory.")
            continue

        try:
            with open(file_path, 'rb') as file:
                self.s3_client.put_object(
                    Bucket=self.bucket_name,
                    Key=file_name,
                    Body=file,
                    ContentType=content_type
                )
                print(f"Successfully uploaded {file_name} to S3.")
        except Exception as e:
            print(f"Error uploading {file_name} to S3: {e}")    
    

def main():
    user_input = input("Enter city names (separated by space or else click 'ENTER' for default cities): ")
    user_cities = user_input.split()
    default_cities = ["Philadelphia", "Seattle", "New York", "Delhi", "Tokyo"]
    cities = user_cities if user_cities else default_cities

    dashboard = WeatherDashboard()

    # Create bucket if needed
    dashboard.create_bucket_if_not_exists()

    # Fetch weather data asynchronously
    print("Fetching weather data...")
    weather_data_list = asyncio.run(dashboard.fetch_weather_for_cities(cities))

    for city, weather_data in zip(cities, weather_data_list):
        if weather_data:
            temp = weather_data['main']['temp']
            feels_like = weather_data['main']['feels_like']
            humidity = weather_data['main']['humidity']
            description = weather_data['weather'][0]['description']

            print(f"\nCity: {city}")
            print(f"Temperature: {temp}°F")
            print(f"Feels like: {feels_like}°F")
            print(f"Humidity: {humidity}%")
            print(f"Conditions: {description}")

            # Save to S3
            dashboard.save_to_s3(weather_data, city)
        else:
            print(f"Failed to fetch weather data for {city}.")

    # Visualize weather data
    dashboard.visualize_weather(cities, weather_data_list)
    
    # Upload static website files to the root of the S3 bucket
    dashboard.upload_static_files()

if __name__ == "__main__":
    main()