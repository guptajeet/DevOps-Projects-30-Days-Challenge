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
        const response = await fetch('https://yourapi.execute-api.us-east-1.amazonaws.com/weather', {
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
        const response = await fetch('https://yourapi.execute-api.us-east-1.amazonaws.com/weather', {
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
        const response = await fetch('https://yourbucket.s3.amazonaws.com/weather-data/index.json'); // Replace with actual S3 URL
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
        const response = await fetch('https://ypurbucket.s3.amazonaws.com/weather-data/index.json');
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









