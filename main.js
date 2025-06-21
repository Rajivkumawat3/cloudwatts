const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

const latOutput = document.querySelector(".lat");
const lonOutput = document.querySelector(".lon");
const mapLink = document.querySelector(".map-link");

let cityInput = "London";

// Try to get current location
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(`${lat},${lon}`);
            },
            () => {
                fetchWeatherData(cityInput); // fallback
            }
        );
    } else {
        fetchWeatherData(cityInput); // fallback
    }
});

cities.forEach(city => {
    city.addEventListener("click", e => {
        cityInput = e.target.innerHTML;
        fetchWeatherData(cityInput);
    });
});

form.addEventListener("submit", e => {
    e.preventDefault();
    if (search.value.length === 0) {
        alert("Please type in a city name");
    } else {
        cityInput = search.value;
        fetchWeatherData(cityInput);
        search.value = "";
    }
});

function dayOfTheWeek(day, month, year) {
    const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekDay[new Date(`${year}-${month}-${day}`).getDay()];
}

function fetchWeatherData(query) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=0f4c1cb606d94723a5c213059230401&q=${query}&aqi=yes`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            const w = dayOfTheWeek(d, m, y);

            dateOutput.innerHTML = `${w} ${d}-${m}-${y}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64".length);
            icon.src = "./icons" + iconId;

            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            latOutput.innerHTML = data.location.lat.toFixed(4);
            lonOutput.innerHTML = data.location.lon.toFixed(4);
            mapLink.href = `https://www.google.com/maps?q=${data.location.lat},${data.location.lon}`;

            let timeOfDay = "day";
            const code = data.current.condition.code;

            if (!data.current.is_day) timeOfDay = "Night";

            if (code == 1000) {
                app.style.backgroundImage = `url("./images/${timeOfDay}/clear.jpg")`;
                btn.style.background = timeOfDay === "Night" ? "#181e27" : "#e5ba92";
            } else if (
                [1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)
            ) {
                app.style.backgroundImage = `url("./images/${timeOfDay}/cloudy.jpg")`;
                btn.style.background = timeOfDay === "Night" ? "#181e27" : "#fa6d1b";
            } else if (
                [1063, 1069, 1072, 1050, 1153, 1180, 1183, 1186, 1189, 1192, 1195,
                 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)
            ) {
                app.style.backgroundImage = `url("./images/${timeOfDay}/rainy.jpg")`;
                btn.style.background = timeOfDay === "Night" ? "#325c80" : "#647d75";
            } else {
                app.style.backgroundImage = `url("./images/${timeOfDay}/snony.jpg")`;
                btn.style.background = timeOfDay === "Night" ? "#1b11b1" : "#647d75";
            }
        })
        .catch(() => {
            alert("City not found, please try again");
        });
}
