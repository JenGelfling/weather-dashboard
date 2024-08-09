const searchFormEl = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  const searchInputVal = document.querySelector('#search-input').value;
  const formatInputVal = document.querySelector('#format-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  const queryString = `./search-results.html?q=${searchInputVal}&format=${formatInputVal}`;

  location.assign(queryString);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);



document.addEventListener("DOMContentLoaded", function() {
    // Example of API call
    fetch('http://api.openweathermap.org/geo/1.0/direct?q={city name}&appid=33c7d1e011e80a99eca4a0c1b6b8ec08')
      .then(response => response.json())
      .then(data => {
        // Assuming 'data' contains an array of items
        const boxes = document.querySelectorAll('.card-body');
        boxes.forEach((box, index) => {
          if (data[index]) {
            box.innerHTML = `
              <h5 class="card-title">Box ${index + 1}</h5>
              <p class="card-text">${data[index].info}</p>
            `;
          }
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });