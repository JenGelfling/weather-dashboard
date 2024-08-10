

const historyList = document.getElementById('historyList');
const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#city-form');
  form.addEventListener('submit', handleSearchFormSubmit);
  renderSearchHistory();
});

function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
      searchHistory.push(city);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      renderSearchHistory();
  }
}

// Function to render search history
function renderSearchHistory() {
  historyList.innerHTML = '';
  searchHistory.forEach((city) => {
      const cityLi = document.createElement('li');
      cityLi.classList.add('list-group-item');
      cityLi.textContent = city;
      cityLi.addEventListener('click', () => handleSearchFormSubmit(null, city));
      historyList.appendChild(cityLi);
  });
}


async function handleSearchFormSubmit(event, cityName) {
  if (event) event.preventDefault();

  cityName = cityName || document.querySelector('#city').value;

  if (!cityName) {
    console.error('You need a search input value!');
    return;
  }

  const apiKey = '33c7d1e011e80a99eca4a0c1b6b8ec08';
  const units = 'imperial';

  try {
    // First API Call: Get latitude and longitude for the city
    const geocodeResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData || geocodeData.length === 0) {
      console.error('No data returned from geocode API.');
      return;
    }

    const { lat, lon } = geocodeData[0];

    // Second API Call: Use latitude and longitude to get weather forecast data
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}&units=${units}`);
    const weatherData = await weatherResponse.json();

    // Third API Call: Get current weather data
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}&units=${units}`);
    const currentWeatherData = await currentWeatherResponse.json();

    // Process and use the data to create HTML elements
    createWeatherElements(currentWeatherData, weatherData);

  } catch (error) {
    console.error('Error making API calls:', error);
  } finally {
    updateSearchHistory(cityName);
  }
}



// Function to create and display HTML elements
function createWeatherElements(currentWeatherData, weatherData) {
  const mainContent = document.querySelector('#main-content');

  // Clear previous content
  mainContent.innerHTML = '';

  // Create elements for current weather
  const currentWeatherDiv = document.createElement('div');
  const weatherIconUrl = `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`;
  const weatherIcon = document.createElement('img');
  weatherIcon.src = weatherIconUrl;

  currentWeatherDiv.classList.add('current-weather');
  currentWeatherDiv.innerHTML = `
    <h2>Current Weather in ${currentWeatherData.name} <img src=${weatherIcon.src}></img></h2>
    <p>Temp: ${currentWeatherData.main.temp}°F</p>
    <p>Wind: ${currentWeatherData.wind.speed}mph</p>
    <p>Weather: ${currentWeatherData.weather[0].description}</p>
    <p>Humidity: ${currentWeatherData.main.humidity}%</p>
  `;
 
  mainContent.appendChild(currentWeatherDiv);

  // Create elements for forecast data
  const forecastDiv = document.createElement('div');
  forecastDiv.classList.add('weather-forecast');
  forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';
  
  weatherData.list.forEach(day => {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
      <p>Temp: ${day.temp.day}°F</p>
      <p>Weather: ${day.weather[0].description}</p>
    `;
    forecastDiv.appendChild(forecastItem);
  });

  mainContent.appendChild(forecastDiv);
}

// renderSearchHistory();
