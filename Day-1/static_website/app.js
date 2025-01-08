document.getElementById("search-form").addEventListener("submit", async (event) => {
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