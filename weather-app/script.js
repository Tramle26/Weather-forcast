// Store latest weather data for AI
window.currentWeather = null;

async function fetchWeather() {
  let searchInput = document.getElementById('search').value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "513bba0e94ff83decd3c81cf0a7652ff";

  // 🧩 Empty input check
  if (searchInput == "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  // 🧭 Step a. Get coordinates
  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);

    if (!response.ok) {
      console.log("Bad response!", response.status);
      return;
    }

    const data = await response.json();
    if (data.length == 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return;
    } else {
      return data[0]; // { lon, lat, name, country }
    }
  }

  // ☀️ Step b. Get weather info
  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lon ? lat : 0}&lon=${lat ? lon : 0}&appid=${apiKey}`;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);

    if (!response.ok) {
      console.log("Bad response!", response.status);
      return;
    }

    const data = await response.json();

    // ✅ Save weather data globally for AI
    window.currentWeather = data;

    // Display results
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" 
           alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }

  // 🧩 Clear search bar
  document.getElementById("search").value = "";

  // 🌍 Run steps
  const geocodeData = await getLonAndLat();
  if (!geocodeData) return; // Stop if invalid city
  getWeatherData(geocodeData.lon, geocodeData.lat);
}
