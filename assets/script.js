const apiKey = "a2df73ceb613685629af070d8e2016bc";
let history=[];
const historyDiv = $("#history");

// Populates history list from local storage when page loads

//making sure we have an array in LS every time we load a new instance of the app
const init = function () {
  history = JSON.parse(localStorage.getItem("history"));

  if (!history) {
    localStorage.setItem("history", JSON.stringify([]));
  }
};
init();

// history search stored to localStorage and on click event listener
const renderHistory = function () {
  historyDiv.empty();
  const lsHistory = JSON.parse(localStorage.getItem("history"));
  for (let index = 0; index < lsHistory.length; index++) {
    const historyElem = $("<a id=citySearch href=#>" + lsHistory[index] + "</a>");
    historyElem.on("click", function() {
      $("#search-input").val(lsHistory[index]);
      $("#search-form").submit();
    });
    historyDiv.append(historyElem);
  }
};

renderHistory();

// event listener on search input and API request

$("#search-form").on("submit", function (event) {
  event.preventDefault();
 

  const userInput = $("#search-input").val();
  const queryUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    userInput +
    "&limit=5&appid=" +
    apiKey;

  // Add the history to local storage
  if (userInput === "") return; //  gate statement to avoid saving empty strings in ls

  console.log(history);
  if (history.length >= 10) {
    // mutate the array and get everything from first index to the end
    history = history.slice(1);
  }
  history.push(userInput);
  localStorage.setItem("history", JSON.stringify(history));

  // Call Geocoding API when search form is submitted to find city lat and long value
  $.ajax({ url: queryUrl }).then(function (response) {
    const lat = response[0].lat;
    const lon = response[0].lon;

    const weatherQueryUrl =
      "https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;

    // Call 5 day weather forecast API after we have city lat and lon value
    $.ajax({ url: weatherQueryUrl }).then(function (weatherResponse) {
      // Puts the response on the HTML page
      const weatherList = weatherResponse.list;
      var todayTemp = weatherResponse.list[0].main.temp;
      console.log(todayTemp);
      var todayHumidity = weatherResponse.list[0].main.humidity;
      console.log(todayHumidity);
      var todayWind = weatherResponse.list[0].wind.speed;
      console.log(todayWind);
      var cityName = weatherResponse.city.name;
      console.log(cityName);
      var todayIconURL = `https://openweathermap.org/img/w/${weatherList[0].weather[0].icon}.png`;
      var todayWeatherIcon = `<img src="${todayIconURL}" />`;

      var todayIcon = $("#today-weather-icon");
      todayIcon.empty();

      //  puts today's weather in container for today's weather
      $("#cityName").text(cityName + " " + moment().format("(DD-MM-YYYY)"));

      $(todayWeatherIcon).appendTo($("#today-weather-icon"));
      $("#Temp").text("Temp: " + todayTemp + "°C");
      $("#Wind").text("Wind: " + todayWind + " KPH");
      $("#Humidity").text("Humidity: " + todayHumidity + "%");

      var forecast = $("#forecast");
      forecast.empty();

      // puts 5 day's forecast weather in container for the 5 day forecast
      for (i = 8; weatherList.length > i; i += 7) {
        console.log(weatherList[i]);
        var tempForecast = weatherList[i].main.temp;
        console.log(tempForecast);
        var humidityForecast = weatherList[i].main.humidity;
        console.log(humidityForecast);
        var windForecast = weatherList[i].wind.speed;
        console.log(windForecast);
        var dayForecast = moment(weatherList[i].dt_txt).format("DD-MM-YYYY");
        var ulEl = $("<ul>");

        var iconURL = `https://openweathermap.org/img/w/${weatherList[i].weather[0].icon}.png`;
        var weatherIcon = $(`
        <li>${dayForecast}</li>
        <li><img src="${iconURL}"/></li>
        <li>Temp: ${tempForecast} &#8451</li>
        <li>Wind:  ${windForecast}KPH</li>
        <li>Humidity: ${humidityForecast}%</li>`);
        ulEl.append(weatherIcon);
        forecast.append(ulEl);

         renderHistory();
       
         
      }
    });
  });
});
