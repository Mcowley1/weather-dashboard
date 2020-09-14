var searchInput = document.querySelector("#search-input")
var findCity = document.querySelector("#search-btn")
var listItemE1 = document.querySelector(".list-group")
var cityCard = document.querySelector("#city-container")
var clickForCity = document.querySelector(".list-group-item")
var saveCities = JSON.parse(localStorage.getItem(".list-group")) || [];

var getWeatherInfo = function(city) {

    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=8d1c76621b3c56e2c6ba4131cbdbfec9";

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            var latitude = data.city.coord.lat
            var longitude = data.city.coord.lon
                
            return fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=8d1c76621b3c56e2c6ba4131cbdbfec9").then(function(uvResponse) {
                uvResponse.json().then(function(uvData) {
                    displayWeather(data, city, uvData);
                })
            })
        });
    });
};


// function to receive the search input
var searchHandler = function(event) {
    event.preventDefault();
    var searchInput = document.querySelector("#search-input")
    var city = searchInput.value.trim();
    saveCities[saveCities.length] = city;
    cityHistory(city);
    getWeatherInfo(city);

    searchInput.value = "";
    localStorage.setItem(".list-group", JSON.stringify(saveCities));
}


// saves city list 
window.addEventListener("load", function() {
    var list = document.getElementById("city-container")
    for (i = 0; i < saveCities.length; i++) {
        var city = document.createElement("li");
        city.classList.add("list-group-item");
        city.innerHTML = saveCities[i];
        list.appendChild(city)
    }
 
    localStorage.clear();
});

var displayWeather = function(data, city, uvData) {


    // clear content
    document.querySelector(".weather-data").textContent = "";
    document.querySelector(".card-deck").innerHTML = "";
    // pulled from the api
    var currentTemp = data.list[0].main.temp;
    var currentHumid = data.list[0].main.humidity;
    var currentWind = data.list[0].wind.speed;
    var currentUv = uvData.value;

    // current date
    var currentDate = moment().format("M/D/YYYY hh:mm A")
    var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png' />"

    var cityLocation = document.createElement("h2")
    cityLocation.classList = "bold-city text-primary"
    cityLocation.innerHTML = city + ": " + currentDate + iconDisplay

    var cityTemp = document.querySelector(".weather-data")
    var showConditions = document.createElement("h5")
    showConditions.classList = "temp text-primary"
    showConditions.innerHTML = "<h5> Temp: " + currentTemp + "&#8457</h5>";


    var showHumidity = document.createElement("h5")
    showHumidity.classList = "humid text-primary"
    showHumidity.innerHTML = "<h5> Humidity: " + currentHumid + "% </h5>";

    var showWind = document.createElement("h5")
    showWind.classList = "wind text-primary"
    showWind.innerHTML = "<h5> Wind Speed: " + currentWind + " MPH <h5>";


    var uvIndex = document.createElement("h5")
    currentUv.setAttribute = "#current-uv"
    uvIndex.classList = "uv text-primary"
    uvIndex.innerHTML = "<h5> UV Index:  <span id=show-uv>" + currentUv + "</span>" + "</h5>"

    cityTemp.appendChild(cityLocation)
    cityTemp.appendChild(showConditions)
    cityTemp.appendChild(showHumidity)
    cityTemp.appendChild(showWind)
    cityTemp.appendChild(uvIndex)
        
    if (currentUv > 10) {
        $("#show-uv").addClass("danger")
    } else if (currentUv >= 6 && currentUv <= 9.9) {
        $("#show-uv").addClass("moderate")
    } else {
        $("#show-uv").addClass("favorable")
    }


    var fiveHeader = document.querySelector("#five-day-header")
    fiveHeader.innerHTML = "<h2> 5 Day Forecast: </h2>"
    var cardDeck = document.querySelector(".card-deck")

    // this for loop iterates over the info in the list array to get the conditions for the 5 day display 
    for (var i = 0; i < data.list.length; i += 8) {
        var fiveDay = (data.list[i])
        var dayDate = moment.unix(fiveDay.dt).format("M/D/YYYY")
        var card = document.createElement("div")
        card.classList = "card bg-primary text-warning"
        var cardBody = document.createElement("div")
        cardBody.classList = "card-body "
        var dateDisplay = "<p id=date>" + dayDate + "</p>"
        var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + fiveDay.weather[0].icon + "@2x.png' />"

        var tempDisplay = "<p> Temp: " + Math.floor(fiveDay.main.temp) + "&#8457</p>"
        var humidityDisplay = "<p> Humidity: " + fiveDay.main.humidity + "%</p>"
        cardBody.innerHTML = dateDisplay + iconDisplay + tempDisplay + humidityDisplay
        card.appendChild(cardBody)
        cardDeck.appendChild(card)


    }
}

var cityHistory = function(showCity) {
    // create list item for each city
    var historyOne = document.createElement("li")
    historyOne.classList = "list-group-item"
    historyOne.textContent = showCity + "";
    historyOne.setAttribute("style", "cursor: pointer");

    cityCard.appendChild(historyOne)
    if (clickForCity != null) historyOne.onClick = clickCity
}

var clickCity = function(city) {

    if (city) {
        getWeatherInfo(city);
        searchInput.value = "";
    } else {
        alert("Select a City")
    }
}


findCity.addEventListener("click", searchHandler);

searchInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchHandler(event)
    }
});

listItemE1.addEventListener("click", function(e) {
    clickCity(e.target.innerText)
})