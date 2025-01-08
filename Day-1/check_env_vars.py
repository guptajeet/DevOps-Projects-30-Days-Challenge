from dotenv import load_dotenv

import os

load_dotenv()


print(os.getenv('AWS_ACCESS_KEY_ID'))
print(os.getenv('AWS_SECRET_ACCESS_KEY'))
print(os.getenv('OPENWEATHER_API_KEY'))
print(os.getenv('AWS_BUCKET_NAME'))
print(os.getenv('AWS_REGION'))