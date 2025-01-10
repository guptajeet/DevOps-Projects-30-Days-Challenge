# DevOps-Projects-30-Days-Challenge
# 🌦️ Weather Dashboard

## 📚 Table of Contents
- [About the Project](#about-the-project)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Code Explanation](#code-explanation)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## 🌟 About the Project

Welcome to the Weather Dashboard project! This is an interactive Python application that allows users to fetch and display current weather data for multiple cities. The project utilizes the OpenWeather API to retrieve weather information and stores the data in an AWS S3 bucket for future reference.

As a DevOps learner, this project showcases the integration of various technologies and services, including:
- Python programming
- API integration (OpenWeather)
- AWS services (S3, IAM)
- Environment variable management
- Asynchronous programming

Whether you're a weather enthusiast or a budding DevOps engineer, this project provides valuable insights into creating a functional, cloud-integrated application.

## 🏗️ Project Structure

The project is organized as follows:

```
└── ./
    ├── src
    │   ├── __init__.py
    │   └── weather_dashboard.py
    ├── check_env_vars.py
    └── requirements.txt
```

- `src/weather_dashboard.py`: The main script containing the WeatherDashboard class and application logic.
- `check_env_vars.py`: A utility script to validate environment variables.
- `requirements.txt`: A list of Python dependencies required for the project.

## ✨ Features

- Fetch real-time weather data for multiple cities
- Concurrent API requests for improved performance
- Data storage in AWS S3 for historical tracking
- User-friendly command-line interface
- Customizable city selection
- Comprehensive error handling and logging

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- Python 3.7 or higher
- An OpenWeather API key (sign up at [OpenWeather](https://openweathermap.org/api))
- AWS account with S3 access
- AWS CLI configured with appropriate permissions
- - GitHub account with SSH authentication set up (see [SSH Keys vs PATs Guide](https://guptajeet.hashnode.dev/github-authentication-ssh-keys-vs-pats-choosing-the-right-secure-option) and [SSH Keys Setup Guide](https://guptajeet.hashnode.dev/say-goodbye-to-passwords-secure-your-github-with-ssh-keys))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/guptajeet/DevOps-Projects-30-Days-Challenge/tree/main/Day-1
   cd weather-dashboard
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your environment variables:
   Create a `.env` file in the project root and add the following:
   ```
   OPENWEATHER_API_KEY=your_openweather_api_key
   AWS_BUCKET_NAME=your_s3_bucket_name
   AWS_REGION=your_aws_region
   ```

## 🖥️ Usage

To run the Weather Dashboard:

1. Navigate to the project directory:
   ```bash
   cd src
   ```

2. Run the main script:
   ```bash
   python weather_dashboard.py
   ```

3. Follow the prompts to enter city names or use the default cities.

## 🧠 Code Explanation

### weather_dashboard.py

This is the heart of the application. Let's break down its key components:

1. `WeatherDashboard` class:
   - Initializes the API key and AWS S3 client.
   - Validates environment variables.
   - Manages S3 bucket creation.

2. `fetch_weather` method:
   - Asynchronously fetches weather data from the OpenWeather API.

3. `fetch_weather_for_cities` method:
   - Concurrently fetches weather data for multiple cities.

4. `save_to_s3` method:
   - Saves the weather data to an S3 bucket with a timestamp.

5. `main` function:
   - Handles user input for city selection.
   - Orchestrates the weather data fetching and saving process.
   - Displays the weather information to the user.

### check_env_vars.py

This utility script ensures that all necessary environment variables are properly set. It's crucial for maintaining the security and functionality of the application.

## 🚀 Future Enhancements

1. Implement a graphical user interface (GUI) for a more interactive experience.
2. Add historical data analysis and visualization capabilities.
3. Integrate with additional weather APIs for more comprehensive data.
4. Implement user authentication for personalized experiences.
5. Create a web application version with real-time updates.
6. Add support for geolocation to automatically detect the user's city.
7. Implement weather alerts and notifications.

## 🚨 Common Issues and Solutions

During the development of this project, several challenges were encountered. Here are some common issues and their solutions:

1. **AWS Credentials Configuration**
   - Issue: AWS credentials not being recognized
   - Solution: Ensure AWS CLI is properly configured with `aws configure` and credentials are stored in `~/.aws/credentials`

2. **S3 Bucket Permission Issues**
   - Issue: Access denied when creating or accessing S3 bucket
   - Solution: Verify IAM user has appropriate S3 permissions (AmazonS3FullAccess or custom policy)

3. **Environment Variables Not Loading**
   - Issue: Application unable to access environment variables
   - Solution: Verify .env file is in the correct location and properly formatted

4. **GitHub SSH Authentication**
   - Issue: Unable to push code to repository
   - Solution: Follow the SSH key setup guide in the prerequisites section

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgements

- [OpenWeather](https://openweathermap.org/) for providing the weather data API
- [Amazon Web Services](https://aws.amazon.com/) for the S3 storage solution
- [Python aiohttp](https://docs.aiohttp.org/) for asynchronous HTTP requests
- [Python-dotenv](https://github.com/theskumar/python-dotenv) for environment variable management

## 📞 Contact

Ajeet Gupta - [Linkedin](https://www.linkedin.com/in/ajeet-g-456333194/)

Project Link: [https://github.com/guptajeet/DevOps-Projects-30-Days-Challenge/tree/main/Day-1](Weather-Application)

---

Thank you for checking out the Weather App project!