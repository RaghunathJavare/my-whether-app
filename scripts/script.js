"use strict";

const whetherContaienr = document.querySelector(".app");

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

  constructor() {
    this.#getCurrentCoords();
  }

  #getWhetherData(url) {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error("country not found!");
      return res.json();
    });
  }

  #getCurrentCoords() {
    new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then((res) => this.#getPosition(res));
  }
  // Get user current location
  #getPosition(data) {
    const { latitude: lat, longitude: lng } = data.coords;
    this.#getWhetherData(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${
        this.#whetherApiKey
      }`
    ).then((data) => this.#renderWhether(data));
  }

  #renderWhether(data) {
    let timeDate = new getData();
    console.log(data);
    const html = `
    <div class="container-fluid whether-container">
    <h1 class="city-name text__sizer">${data.name}</h1>
    <h4 class="current-date text__sizer">${timeDate.date}</h4>
    <h4 class="current-time text__sizer">${timeDate.time}</h4>
</div>

<!-- current whether  -->

<div class="whether">
    <i class="fa-solid fa-cloud-sun current-whether"></i>
    <span class="current-whether">39°</span>
</div>`;

    whetherContaienr.insertAdjacentHTML("afterbegin", html);
  }

  // Get city Data
}

const App = new app();
