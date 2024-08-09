// const searchFormEl = document.querySelector('#search-form');




// async function handleSearchFormSubmit(event) {
//     event.preventDefault();
  
//     const cityName = document.querySelector('#city').value;
  
//     if (!cityName) {
//       console.error('You need a search input value!');
//       return;
//     }
  
//     const formatInputVal = 'json'; // Example, adjust if needed
  
//     try {
//       // First API Call: Get latitude and longitude for the city
//       const geocodeResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=33c7d1e011e80a99eca4a0c1b6b8ec08`);
    
//       const geocodeData = await geocodeResponse.json();
  
//       if (!geocodeData || geocodeData.length === 0) {
//         console.error('No data returned from geocode API.');
//         return;
//       }
//       console.log(geocodeData)

//       const { lat, lon } = geocodeData[0];
  
//       // Second API Call: Use latitude and longitude to get weather data
//       const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=33c7d1e011e80a99eca4a0c1b6b8ec08&units=imperial`);
//       const weatherData = await weatherResponse.json();
  
//       // Process and use weatherData as needed
//       console.log('Weather Data:', weatherData);
  
//     } catch (error) {
//       console.error('Error making API calls:', error);
//     }
//   }






// function handleSearchFormSubmit(event) {
//   event.preventDefault();

//   const cityName = document.querySelector('#city').value;

//   if (!cityName) {
//     console.error('You need a search input value!');
//     return;
//   }

//   const queryString = `./search-results.html?q=${cityName}`;

//   location.assign(queryString);
// }

// searchFormEl.addEventListener('submit', handleSearchFormSubmit);


// // Function to fetch city data and then make a new API call
// async function getWeatherData() {
//     // First API URL
//     const cityApiUrl = 'https://example.com/api/city'; // Replace with your actual API URL
  
//     try {
//       // Fetch data from the first API
//       const response = await fetch(cityApiUrl);
//       const data = await response.json();
  
//       // Extract lat and lon from the API response
//       const { lat, lon } = data[0]; // Assuming the response is an array with the first element containing the data
  
//       // Define the OpenWeatherMap API URL
//       const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=YOUR_API_KEY`; // Replace YOUR_API_KEY with your actual API key
  
//       // Fetch weather data from OpenWeatherMap
//       const weatherResponse = await fetch(weatherApiUrl);
//       const weatherData = await weatherResponse.json();
  
//       // Process and use the weather data as needed
//       console.log(weatherData);
  
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }
  
//   // Call the function to execute
//   getWeatherData();







// document.addEventListener("DOMContentLoaded", function() {
//     // Example of API call
//     fetch('https://api.openweathermap.org/data/2.5/weather?q={city}&appid=33c7d1e011e80a99eca4a0c1b6b8ec08&units=imperial')
//       .then(response => response.json())
//       .then(data => {
//         // Assuming 'data' contains an array of items
//         const boxes = document.querySelectorAll('.card-body');
//         boxes.forEach((box, index) => {
//           if (data[index]) {
//             box.innerHTML = `
//               <h5 class="card-title">Box ${index + 1}</h5>
//               <p class="card-text">${data[index].info}</p>
//             `;
//           }
//         });
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#city-form');
  form.addEventListener('submit', handleSearchFormSubmit);
});

async function handleSearchFormSubmit(event) {
  event.preventDefault();

  const cityName = document.querySelector('#city').value;

  if (!cityName) {
    console.error('You need a search input value!');
    return;
  }

  const apiKey = '33c7d1e011e80a99eca4a0c1b6b8ec08'; // Replace with your API key
  const units = 'imperial'; // Use 'metric' for Celsius

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
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}&units=${units}`);
    const weatherData = await weatherResponse.json();

    // Third API Call: Get current weather data
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt=5&appid=${apiKey}&units=${units}`);
    const currentWeatherData = await currentWeatherResponse.json();

    // Process and use the data to create HTML elements
    createWeatherElements(currentWeatherData, weatherData);

  } catch (error) {
    console.error('Error making API calls:', error);
  }
}

// Function to create and display HTML elements
function createWeatherElements(currentWeatherData, weatherData) {
  const mainContent = document.querySelector('#main-content'); // Assuming you have a container with this ID

  // Clear previous content
  mainContent.innerHTML = '';

  // Create elements for current weather
  const currentWeatherDiv = document.createElement('div');
  currentWeatherDiv.classList.add('current-weather');
  currentWeatherDiv.innerHTML = `
    <h2>Current Weather in ${currentWeatherData.name}</h2>
    <p>Temperature: ${currentWeatherData.main.temp}°F</p>
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
      <p>Temperature: ${day.temp.day}°F</p>
      <p>Weather: ${day.weather[0].description}</p>
    `;
    forecastDiv.appendChild(forecastItem);
  });

  mainContent.appendChild(forecastDiv);
}
