/*document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = document.getElementById("city-input").value;
    if (!city) return;

    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather/${city}`);
        const data = await response.json();
        updateSearchResults(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
});

function updateSearchResults(data) {
    const ctx = document.getElementById("search-chart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [data.city],
            datasets: [{
                label: "Temperature",
                data: [data.main.temp],
                backgroundColor: "skyblue",
            }],
        },
    });
}
*/
///////////////////////////////////////////////////
/*
document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = document.getElementById("city-input").value;
    if (!city) return;

    try {
        // Use your actual API Gateway endpoint URL
        const response = await fetch('https://svmdjm2kzj.execute-api.us-east-1.amazonaws.com/weather', {
            method: "POST", // POST method for Lambda function
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ city: city }) // Send city name as JSON
        });

        const data = await response.json();

        if (response.ok) {
            updateSearchResults(data); // Pass data to display function
        } else {
            console.error("Error fetching weather data:", data);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
});

function updateSearchResults(data) {
    const ctx = document.getElementById("search-chart").getContext("2d");

    // Update chart with Lambda response data
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [data.city], // City name
            datasets: [{
                label: "Temperature (°C)", // Update label
                data: [data.temperature], // Temperature from Lambda response
                backgroundColor: "skyblue",
            }],
        },
    });
}

*/
/////////////////////////////////////////////////////
/*
document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = document.getElementById("city-input").value;
    if (!city) return;

    try {
        // Use your actual API Gateway endpoint URL
        const response = await fetch('https://svmdjm2kzj.execute-api.us-east-1.amazonaws.com/weather', {
            method: "POST", // POST method for Lambda function
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ city: city }) // Send city name as JSON
        });

        const data = await response.json();

        if (response.ok) {
            updateSearchResults(data); // Pass data to display function
        } else {
            console.error("Error fetching weather data:", data);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
});

function updateSearchResults(data) {
    const ctx = document.getElementById("search-chart").getContext("2d");

    // Update chart with Lambda response data
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [data.city], // City name
            datasets: [{
                label: "Temperature (°C)", // Update label
                data: [data.temperature], // Temperature from Lambda response
                backgroundColor: "skyblue",
            }],
        },
    });
}

// Function to fetch and display historical data from S3 (index.json)
async function fetchHistoricalData() {
    try {
        const response = await fetch('https://weatherdashboard-bucket-123456789.s3.amazonaws.com/weather-data/index.json'); // Replace with actual S3 URL
        const data = await response.json();

        if (response.ok) {
            displayHistoricalData(data); // Pass data to display function
        } else {
            console.error("Error fetching historical data:", data);
        }
    } catch (error) {
        console.error("Error fetching historical data:", error);
    }
}

function displayHistoricalData(data) {
    const tableBody = document.getElementById("historical-table");
    tableBody.innerHTML = ""; // Clear existing table content

    // Loop through the historical data and add it to the table
    data.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.city}</td>
            <td>${entry.date}</td>
            <td>${entry.temperature}°F</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fetch and display historical data when the page loads
fetchHistoricalData();

*/
/*
document.getElementById("search-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    const city = document.getElementById("city-input").value;
    if (!city) return; // If no city entered, don't proceed

    try {
        // Fetch weather data for the city from API Gateway
        const response = await fetch('https://yourapi.execute-api.us-east-1.amazonaws.com/weather', {
            method: "POST", // POST method for Lambda function
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ city: city }) // Send city name as JSON
        });

        const data = await response.json();

        if (response.ok) {
            // Update chart with the fetched weather data
            updateSearchResults({
                city: data.city,
                temperature: data.temperature
            });
        } else {
            console.error("Error fetching weather data:", data);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
});

function updateSearchResults(data) {
    const ctx = document.getElementById("search-chart").getContext("2d");

    // Destroy any existing chart on the canvas to prevent errors
    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    // Create a new chart instance with the fetched data
    window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [data.city], // City name as label
            datasets: [{
                label: "Temperature (°C)",
                data: [data.temperature], // Temperature from the search result
                backgroundColor: "skyblue",
            }],
        },
    });
}

// Function to fetch and display historical data
async function fetchHistoricalData() {
    try {
        const response = await fetch('https://yourbucket.s3.amazonaws.com/weather-data/index.json');
        const data = await response.json();

        if (response.ok) {
            // Loop through each entry in the index.json file and fetch the corresponding city weather data
            for (const entry of data) {
                const weatherResponse = await fetch(`https://yourbucket.s3.amazonaws.com/${entry.file_name}`);
                const weatherData = await weatherResponse.json();

                if (weatherResponse.ok) {
                    const temperature = weatherData.main.temp || "N/A";  // Using `main.temp` for temperature
                    const temperatureInFahrenheit = (temperature * 9/5) + 32; // Convert to °F

                    // Display the historical data in the table
                    displayHistoricalData({
                        city: entry.city,
                        date: entry.timestamp,
                        temperature: temperatureInFahrenheit.toFixed(2) // Show in Fahrenheit with two decimal places
                    });
                } else {
                    console.error("Error fetching weather data for", entry.city, weatherData);
                }
            }
        } else {
            console.error("Error fetching historical data index:", data);
        }
    } catch (error) {
        console.error("Error fetching historical data:", error);
    }
}

// Function to display historical data in the table
function displayHistoricalData(entry) {
    const tableBody = document.getElementById("historical-table");
    const row = document.createElement("tr");

    const city = entry.city || "N/A";
    const date = entry.date || "N/A";
    const temperature = entry.temperature !== undefined ? entry.temperature + "°F" : "N/A";

    row.innerHTML = `
        <td>${city}</td>
        <td>${date}</td>
        <td>${temperature}</td>
    `;
    tableBody.appendChild(row);
}

// Fetch historical data when the page loads
fetchHistoricalData();
\*
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    const historicalTable = document.getElementById('historical-table');
    let searchChart;
    let historicalChart;

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            try {
                const weatherData = await fetchWeatherData(city);
                displayCurrentWeather(weatherData);
                updateSearchChart(weatherData);
                await fetchAndDisplayHistoricalData();
            } catch (error) {
                console.error('Error:', error);
                displayError('Failed to fetch weather data. Please try again.');
            }
        }
    });

    async function fetchWeatherData(city) {
        try {
            const response = await fetch('https://y8ehuk3u3l.execute-api.us-east-1.amazonaws.com/weather', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city: city })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    function displayCurrentWeather(data) {
        weatherInfo.innerHTML = `
            <div class="weather-card">
                <h3>${data.city}</h3>
                <p><i class="fas fa-thermometer-half"></i> ${data.temperature.toFixed(1)}°C</p>
                <p><i class="fas fa-tint"></i> ${data.humidity}%</p>
                <p><i class="fas fa-cloud"></i> ${data.conditions}</p>
                <p><i class="fas fa-wind"></i> ${data.wind_speed} m/s</p>
            </div>
        `;
    }

    function updateSearchChart(data) {
        const ctx = document.getElementById('search-chart').getContext('2d');

        if (searchChart) {
            searchChart.destroy();
        }

        searchChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)'],
                datasets: [{
                    label: data.city,
                    data: [data.temperature, data.humidity, data.wind_speed],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    async function fetchAndDisplayHistoricalData() {
        try {
            const response = await fetch('https://weatherdashboard-bucket-123456789.s3.amazonaws.com/weather-data/index.json', {
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const historicalData = [];

            historicalTable.innerHTML = '';

            for (const entry of data.slice(-5)) { // Display only the last 5 entries
                try {
                    const weatherResponse = await fetch(`https://weatherdashboard-bucket-123456789.s3.amazonaws.com/${entry.file_name}`, {
                        mode: 'cors'
                    });

                    if (!weatherResponse.ok) {
                        throw new Error(`HTTP error! status: ${weatherResponse.status}`);
                    }

                    const weatherData = await weatherResponse.json();

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${weatherData.name}</td>
                        <td>${formatTimestamp(entry.timestamp)}</td>
                        <td>${weatherData.main.temp.toFixed(2)}°C</td>
                    `;
                    historicalTable.appendChild(row);

                    historicalData.push({
                        city: weatherData.name,
                        timestamp: formatTimestamp(entry.timestamp),
                        temperature: weatherData.main.temp
                    });
                } catch (error) {
                    console.error(`Error fetching data for ${entry.city}:`, error);
                }
            }

            updateHistoricalChart(historicalData);
        } catch (error) {
            console.error('Error fetching historical data:', error);
            displayError('Failed to fetch historical data. Please try again later.');
        }
    }

    function updateHistoricalChart(data) {
        const ctx = document.getElementById('historical-chart').getContext('2d');

        if (historicalChart) {
            historicalChart.destroy();
        }

        historicalChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(entry => entry.timestamp),
                datasets: data.map(entry => ({
                    label: entry.city,
                    data: [entry.temperature],
                    borderColor: getRandomColor(),
                    fill: false
                }))
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        labels: data.map(entry => entry.timestamp)
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2) + '°C';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function formatTimestamp(timestamp) {
        const year = timestamp.slice(0, 4);
        const month = timestamp.slice(4, 6);
        const day = timestamp.slice(6, 8);
        const hour = timestamp.slice(9, 11);
        const minute = timestamp.slice(11, 13);
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function displayError(message) {
        weatherInfo.innerHTML = `<p class="error">${message}</p>`;
    }

    // Fetch historical data on page load
    fetchAndDisplayHistoricalData();
});

