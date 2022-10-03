"use strict";
const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
let mapEvent, map;

//get current position and display map leaflet
const getposition = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      console.log(position);
      const { latitude: lat, longitude: lng } = position.coords;
      const coords = [lat, lng];
      map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", function (mapE) {
        mapEvent = mapE;
        console.log(mapE);
        form.classList.remove("hidden");
      });
    },
    error => {
      console.log(error);
    }
  );
};
getposition();

//toggle workout form
formInput.addEventListener("change", function (e) {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});

//submit form and display workout on map
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 100,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${
          formInput.value === "running" ? "running-popup" : "cycling-popup"
        }`,
      })
    )
    .setPopupContent(`${formInput.value === "running" ? "Running" : "Cycling"}`)
    .openPopup();

  const config = {
    running: {
      text: "Running",
      date: getDate(),
      id: String(Date.now()).slice(-10)[0],
      icon: "🏃‍♂️",
      min: +inputDuration.value,
      km: +inputDistance.value,
      val: +inputCadence.value,
      pace: Math.round(+inputDuration.value / +inputDistance.value),
      unit: "m",
      paceUnit: "min/km",
      sym: "🦶🏼",
    },
    cycling: {
      text: "Cycling",
      date: getDate(),
      id: String(Date.now()).slice(-10)[0],
      icon: "🚴‍♀️",
      sym: "⛰",
      min: +inputDuration.value,
      km: +inputDistance.value,
      val: +inputElevation.value,
      pace: Math.round(+inputDistance.value / (+inputDuration.value / 60)),
      paceUnit: "km/h",
      unit: "m",
    },
  };
  const workout =
    formInput.value === "running" ? config["running"] : config["cycling"];

  displayList(workout);
});

//display workout list
function displayList({
  id,
  date,
  icon,
  min,
  sym,
  km,
  pace,
  paceUnit,
  unit,
  val,
  text,
}) {
  const html = `
    <li class="workout workout--${text}" data-id="${id}">
        <h2 class="workout__title">${
          text.slice(0, 1).toUpperCase() + text.slice(1)
        } on ${date}</h2>
        <div class="workout__details">
      <span class="workout__icon">${icon}</span>
      <span class="workout__value">${km}</span>
      <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${min}</span>
      <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${pace}</span>
      <span class="workout__unit">${paceUnit}</span>
        </div>
        <div class="workout__details">
        <span class="workout__icon">${sym}</span>
                <span class="workout__value">${val}</span>
            <span class="workout__unit">${unit}</span>
        </div>
  </li>
    
    `;

  form.insertAdjacentHTML("afterend", html);
}

//get date and month of work
function getDate() {
  const now = new Date();
  //prettier ignore
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[now.getMonth()];
  const date = now.getDate();
  return `${month} ${date}`;
}

//console.log(getDate());
