const apiKey = "a2df73ceb613685629af070d8e2016bc";
let history;
const historyDiv = $("#history")
// TODO: Populate history list from local storage when page loads

// making sure we have an array in LS every time we load a new instance of the app
const init = function () {
  history = JSON.parse(localStorage.getItem("history"));

  if (!history) {
    localStorage.setItem("history", JSON.stringify([]));
  }
};
init();

const renderHistory = function(){
    historyDiv.empty()
    const lsHistory = JSON.parse(localStorage.getItem("history"));
    for (let index = 0; index < lsHistory.length; index++) {
        const historyElem = $("<div>"+lsHistory[index]+"</div>")
        historyDiv.append(historyElem)
        
    }
}
renderHistory();

$("#search-form").on("submit", function (event) {
  event.preventDefault();
renderHistory()


  const userInput = $("#search-input").val();
  const queryUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    userInput +
    "&limit=5&appid=" +
    apiKey;

  // Add the history to local storage
  if (userInput === "") return; //  gate statement to avoid saving empty strings in ls

  history.push(userInput);
  if (history.length >= 10) {
    // mutate the array and get everything from first index to the end
    history = history.slice(1);

    localStorage.setItem("history", JSON.stringify(history));
  }

  // Call Geocoding API when search form is submitted to find city lat and long value
  $.ajax({ url: queryUrl }).then(function (response) {
    const lat = response[0].lat;
    const lon = response[0].lon;

    const weatherQueryUrl =
      "http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;

    // Call 5 day weather forecast API after we have city lat and lon value
    $.ajax({ url: weatherQueryUrl }).then(function (weatherResponse) {
      // Put the response on the HTML page
      const weatherList = weatherResponse.list;
      var todayTemp = weatherResponse.list[0].main.temp;
      console.log(todayTemp);
      var todayHumidity = weatherResponse.list[0].main.humidity;
      console.log(todayHumidity);
      var todayWind = weatherResponse.list[0].wind.speed;
      console.log(todayWind);
      var cityName = weatherResponse.city.name;
      console.log(cityName);

      //  put today's weather in container for today's weather
      $("#cityName").text(cityName + " " + moment().format("(DD-MM-YYYY)"));
      $("#Temp").text(todayTemp + "C");
      $("#Wind").text(todayWind + "KPH");
      $("#Humidity").text(todayHumidity + "%");
      var forecast = $("#forecast");
      forecast.empty();

      // put 5 day's forecast weather in container for the 5 day forecast
      for (i = 8; weatherList.length > i; i += 7) {
        console.log(weatherList[i]);
        var olEl = $("<ol>");
        olEl.text("hello");
        var iconURL = `http://openweathermap.org/img/w/${weatherList[i].weather[0].icon}.png`;
        var weatherIcon = $(`<li><img src="${iconURL}" /></li>`);
        olEl.append(weatherIcon);
        forecast.append(olEl);
      }

      // Icon URL http://openweathermap.org/img/w/" + iconcode + ".png" --> concatenation (adding of strings)
      // Icon URL `htt://openweathermap.org/img/w/${iconcode}.png` --> template literal (template string) --> alternative to what's above
    });
  });
});
