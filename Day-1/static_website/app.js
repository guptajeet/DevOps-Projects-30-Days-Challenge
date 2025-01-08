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
