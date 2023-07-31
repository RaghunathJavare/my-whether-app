"use strict";

const weatherContaienr = document.querySelector(".app");
const userInput = document.querySelector(".city-name");
const btn = document.querySelector(".btn");

class getData {
  constructor(date, time) {
    this.data = date;
    this.time = time;
    this.#getDateAndTime();
  }

  #helper(local, option) {
    return new Intl.DateTimeFormat(local, option).format(new Date());
  }

  #getDateAndTime() {
    const local = navigator.language;
    const option1 = {
      month: "long",
      weekday: "long",
      day: "2-digit",
    };

    const option2 = {
      hour: "2-digit",
      minute: "numeric",
    };

    this.date = this.#helper(local, option1);
    this.time = this.#helper(local, option2);
  }
}

class app {
  #whetherApiKey = "4df63278af2b102b563c9d0d9924e2e5";
  #cityState;
  #cityName;

  constructor() {
    this.#getCurrentCoords();
    btn.addEventListener("click", this.#getCityCoords.bind(this));
    // this.#getCityCoords()
  }

  #ajaxCall(url) {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error("country not found!");
      return res.json();
    });
  }

  // Get user current coords of user
  #getCurrentCoords() {
    new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then((data) => {
      const { latitude: lat, longitude: lon } = data.coords;
      this.#getPosition(lat, lon);
    });
  }

  // get weather data

  #getPosition(lat, lon) {
    this.#ajaxCall(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
        this.#whetherApiKey
      }&units=metric`
    ).then((data) => {
      this.#renderWeather(data);
    });
  }

  // get current coords of city
  #getCityCoords(e) {
    e.preventDefault();
    this.#cityName = userInput.value;
    if (!this.#cityName) {
      alert("please enter your city name");
      throw new Error("No data found");
    }
    this.#ajaxCall(
      ` http://api.openweathermap.org/geo/1.0/direct?q=${
        this.#cityName
      },&limit=1&appid=${this.#whetherApiKey}`
    )
      .then((data) => {
        const { lat, lon } = data[0];
        this.#getPosition(lat, lon);
        weatherContaienr.innerHTML = userInput.value = "";
      })
      .catch((err) => {
        throw new Error(`country not found ${err.massage}`);
      });
  }
  //  render currnet weather data to UI

  #renderWeather(data) {
    if (!data) return;
    let timeDate = new getData();
    const { feels_like: feel, temp, temp_max: max, temp_min: min } = data.main;
    const html = `
  
    <div class="container-fluid weather-container">
    <h1 class="city-name text__sizer">${data.name},  
    <h4 class="current-date text__sizer">${timeDate.date}</h4>
    <h4 class="current-time text__sizer">${timeDate.time}</h4>
</div>

<!-- current weather  -->

<div class="weather">
    <i class="fa-solid fa-cloud-sun current-whether"></i>
    <span class="current-weather">${temp.toFixed(0)}C°</span>
</div>

<div class="container-fluid weather-content">
<div class="row">
    <div class="col-lg-3 col-6 content-box"><i class="fa-solid fa-cloud"></i>
    <span>${feel.toFixed(1)}</span>
        <h5>feels-like</h5>
    </div>
    <div class="col-lg-3 col-6 content-box">
    <span>${data.wind.speed.toFixed(1)}</span>
    <span class="material-symbols-outlined">
air
</span>
        <h5>wind-speed</h5>
    </div>
    <div class="col-lg-3 col-6 content-box">
    <span>${max.toFixed(1)}</span>
    <span class="material-symbols-outlined">
thermometer_gain
</span>
        <h5>max-temp</h5>
    </div>
    <div class="col-lg-3 col-6 content-box">
    <span>${min.toFixed(1)}</span>

    <span class="material-symbols-outlined">
thermometer_loss
</span>
    
        <h5>min-temp</h5>
    </div>
</div>

</div>`;

    weatherContaienr.insertAdjacentHTML("afterbegin", html);
  }
}

const App = new app();
