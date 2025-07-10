const mapOptions = {
  center: [17.385044, 78.486671],
  zoom: 10,
};

const API = "https://restcountries.com/v3.1/all";

let map = new L.map("map", mapOptions);
let marker;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function locateMap([lat, long]) {
  map.setView([lat, long], 5);
  marker = L.marker([lat, long], {
    riseOnHover: true,
  }).addTo(map);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const jsonData = await response.json();
    console.log(jsonData);
    const countries = document.querySelector(".countries");

    jsonData.map((country) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      //   selectedCountryName = country?.name?.common;
      div.className = "country";
      div.onclick = () => {
        const popup = document.querySelector(".popup");
        if (popup) {
          popupClose();
        }
        showPopup(
          country?.name?.common,
          country?.continents?.[0],
          country?.currencies,
          country?.flag
        );
        locateMap(country?.latlng);
      };
      img.src = country?.flags?.svg;
      img.className = "country__img";
      countries.appendChild(div);
      div.appendChild(img);
    });
  } catch (err) {
    console.error(err);
  }
});

const containerRight = document.querySelector(".container__right");

function showPopup(name, continent, currencyDetails, flag) {
  if (marker) {
    map.removeLayer(marker);
  }
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.style.visibility = "visible";
  const p1 = document.createElement("p");
  p1.className = "para-text";

  p1.innerText = "Country : " + name + " " + flag;
  const p2 = document.createElement("p");
  p2.className = "para-text";

  p2.innerText = "Continent : " + continent;
  const p3 = document.createElement("p");
  const key = Object.keys(currencyDetails)[0];
  p3.innerText = "Currency Name : " + currencyDetails[key]?.name;
  p3.className = "para-text";

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "Close";
  closeBtn.className = "close";
  closeBtn.onclick = popupClose;
  popup.appendChild(p1);
  popup.appendChild(p2);
  popup.appendChild(p3);
  popup.appendChild(closeBtn);
  containerRight.appendChild(popup);
}

function popupClose() {
  const containerRight = document.querySelector(".container__right");
  const popup = document.querySelector(".popup");
  containerRight.removeChild(popup);
  map.removeLayer(marker);
}
