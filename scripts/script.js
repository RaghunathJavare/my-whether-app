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

class App {
  #whetherApiKey = "4df63278af2b102b563c9d0d9924e2e5";
  #city;

  constructor() {
    this.#getCurrentCoords();
    btn.addEventListener("click", this.#getCityCoords.bind(this));
  }

  // Request for AJAX call
  async #ajaxCall(url) {
    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error("country not found!");

      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  // Get user current coords of user
  async #getCurrentCoords() {
    // Get current user position by location
    const data = await new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude: lat, longitude: lon } = data.coords;
    this.#getPosition(lat, lon);
  }

  // get weather data

  async #getPosition(lat, lon) {
    const data = await this.#ajaxCall(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
        this.#whetherApiKey
      }&units=metric`
    );
    this.#renderWeather(data);
  }
  //  render currnet weather data to UI

  #renderWeather(data) {
    if (!data) redturn;
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

  async #getCityCoords(e) {
    try {
      e.preventDefault();
      this.#city = userInput.value;

      if (!this.#city) {
        alert("please enter your city name");
        throw new Error("No country found");
      }

      const data = await this.#ajaxCall(
        ` https://api.openweathermap.org/geo/1.0/direct?q=${
          userInput.value
        },&limit=1&appid=${this.#whetherApiKey}`
      );

      const { lat, lon } = data[0];
      this.#getPosition(lat, lon);
      weatherContaienr.innerHTML = userInput.value = "";
    } catch (err) {
      console.error(`Country not found ${err.message}`);
    }
  }
}

const whetherApp = new App();
