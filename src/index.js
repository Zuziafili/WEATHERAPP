// DISPLAY THE DAY AND THE HOUR
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let datetime = document.querySelector("#actualDate");
let gettingHour = now.getHours();
let gettingMinutes = now.getMinutes();
let gettingDay = days[now.getDay()];
gettingMinutes = checkTime(gettingMinutes);
datetime.innerHTML = `${gettingDay} ${gettingHour}:${gettingMinutes}`;

function checkTime(gettingMinutes) {
  if (gettingMinutes < 10) {
    gettingMinutes = "0" + gettingMinutes;
  }
  return gettingMinutes;
}

function formatHours(timestemp) {
  let date = new Date(timestemp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

//SWITCH TEMPERATURE - CELSIUS/ FAHRENHEIT
function swithToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
function switchToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}
let celsiusTemperature = null;

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", swithToCelsius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", switchToFahrenheit);

//SWITCH THE NAME OF THE CITY

function displayWeatherCondition(response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let description = document.querySelector("#weather-description");
  description.innerHTML = response.data.weather[0].main;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  celsiusTemperature = response.data.main.temp;
}

function displayForecast(response) {
  console.log(response);
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;

  for (let index = 0; index < 6; index++) {
    let forecast = response.data.list[index];
    forecastElement.innerHTML += `
    <div class="col-sm-2">
      <div class="cards">
        <div class="card-body">
            <h5 class="card-title"> ${formatHours(forecast.dt * 1000)}</h5>
            <img src="http://openweathermap.org/img/wn/${
      forecast.weather[0].icon
      }@2x.png" class="icon" id="icon">
            <p class="card-text"> ${Math.round(forecast.main.temp_max)}°C
            </br>
            / ${Math.round(forecast.main.temp_min)}°C
            </p>
            <p class="bottom-cardtext">
                ${forecast.weather[0].description}
            </p>
        </div>
    </div>
  </div>`;
  }
}

function searchCity(city) {
  let apiKey = "64b0395f40c65e6eeb2201c7e7c24827";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "64b0395f40c65e6eeb2201c7e7c24827";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Warsaw");
