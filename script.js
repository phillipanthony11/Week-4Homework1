var api = "c12a9ed4e6eb7ddfd381ba335aa7ed2e"
var cityName = document.querySelector('#cityName')
var temperature = document.querySelector('#temperature')
var wind = document.querySelector('#wind')
var humidity = document.querySelector('#humidity')
var icon = document.querySelector("#icon")
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
var newdate = `${month}/${day}/${year}`;
var cities = []
var ul = document.getElementById("citiesList");
var cards = document.querySelectorAll(".card")

function initializeCities(){
    if(JSON.parse(localStorage.getItem("cities"))){
        var savedCities = JSON.parse(localStorage.getItem("cities"))
        cities = savedCities
        for (let i = 0; i < cities.length; i++) {
            var li = document.createElement("li");
            li.innerHTML = cities[i]
            addClick(li)
            ul.appendChild(li); 
        }
    }
}

function revealCards(city){
    fetch("https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid=" + api)
    .then((function(response) {
        if(response.ok){
            response.json()
            .then(function (data) {
                console.log(data)
                let forecastTracker = 0
                for (let i = 0; i < cards.length; i++) {
                    cards[i].style.opacity = 1
                    var cardDate = cards[i].querySelector(".date")
                    var cardIcon = cards[i].querySelector(".cardIcon")
                    var cardTemp = cards[i].querySelector(".temp")
                    var cardWind = cards[i].querySelector(".wind")
                    var cardHumidity = cards[i].querySelector(".humidity")
                    cardDate.innerHTML="Date: " + data.list[forecastTracker].dt_txt
                    var iconURL = "http://openweathermap.org/img/w/" + data.list[forecastTracker].weather[0].icon + ".png";
                    cardIcon.setAttribute("src", iconURL)
                    cardTemp.innerHTML="Temperature: " + data.list[forecastTracker].main.temp+"°F"
                    cardWind.innerHTML="Wind Speed: " + data.list[forecastTracker].wind.speed+"MPH"
                    cardHumidity.innerHTML="Humidity: " + data.list[forecastTracker].main.humidity+"%"
                    forecastTracker+=8
                }
              });
        }
        else{
            console.log(response)
            alert('Error: ' + response.statusText)
        }
    }))
}

initializeCities()

document.querySelector("#searchButton").addEventListener('click', search)

function search () {
    getWeather(document.querySelector("#search").value)
}

function saveCity(city){
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities))
    var li = document.createElement("li");
    li.innerHTML = city
    ul.appendChild(li); 
    var listItems = document.querySelectorAll("#citiesList li")
    listItems.forEach(addClick)
}

function addClick(listItem){
    listItem.addEventListener("click", function(event){
        fetch("https://api.openweathermap.org/data/2.5/weather?q="+event.target.innerHTML+"&units=imperial&appid=" + api)
        .then((function(response) {
            if(response.ok){
                response.json()
                .then(function (data) {
                    console.log(data)
                    var iconCode = data.weather[0].icon
                    var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                    icon.setAttribute("src", iconurl)
                    icon.style.display = "block"
                    cityName.innerHTML = event.target.innerHTML + " (" + newdate + ")"
                    temperature.innerHTML = "Temperature: "  + data.main.temp + "°F"
                    humidity.innerHTML = "Humidity: " + data.main.humidity + "%"
                    wind.innerHTML = "Wind Speed: " + data.wind.speed + "MPH"
                    revealCards(event.target.innerHTML)
                  });
            }
            else{
                console.log(response)
                alert('Error: ' + response.statusText)
            }
    }))
})}

function getWeather(city) {
    console.log(city)
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=" + api)
    .then((function(response) {
        if(response.ok){
            response.json()
            .then(function (data) {
                var iconCode = data.weather[0].icon
                var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                icon.setAttribute("src", iconurl)
                icon.style.display = "block"
                cityName.innerHTML = city + " (" + newdate + ")"
                temperature.innerHTML = "Temperature: "  + data.main.temp + "°F"
                humidity.innerHTML = "Humidity: " + data.main.humidity + "%"
                wind.innerHTML = "Wind Speed: " + data.wind.speed + "MPH"
                console.log(data);
                saveCity(city)
                revealCards(city)
              });
        }
        else{
            console.log(response)
            alert('Error: ' + response.statusText)
        }
    }))

}


// Edge cases:
// 1. Same city multiple times
// 2. Make cities appear on load 
