// TODO: Style current HTML

const apiKey = "a2df73ceb613685629af070d8e2016bc";
const history = JSON.parse(localStorage.getItem('history')) || [];
// TODO: Populate history list from local storage when page loads

$('#search-form').on('submit', function(event) {
    event.preventDefault();

    const userInput = $('#search-input').val();
    const queryUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userInput + '&limit=5&appid=' + apiKey;
    // TODO: put the search value on the history list container

    // Add the history to local storage
    history.push(userInput);
    localStorage.setItem('history', JSON.stringify(history));

    // Call Geocoding API when search form is submitted to find city lat and long value
    $.ajax({ url: queryUrl })
        .then(function(response) {
            const lat = response[0].lat;
            const lon = response[0].lon;

            const weatherQueryUrl = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

            // Call 5 day weather forecast API after we have city lat and lon value
            $.ajax({ url: weatherQueryUrl })
                .then(function(weatherResponse) {
                    // Put the response on the HTML page
                    const weatherList = weatherResponse.list;

                    const weathers = [];
                    for (let i = 0; i < weatherList.length; i += 8) {
                        weathers.push(weatherList[i]);
                        
                    }

                    // console.log(weathers);
                    console.log(weatherResponse);
                    // weathers[0] will be today's weather

                    // weathers[1 - 4] will be 5 days forecast
                    // 
                    // Temp    (list.main.temp )
                    // Humidity  list.main.humudity
                    // Wind     list.wind.speed
                    var todayTemp = weatherResponse.list[0].main.temp;
                    console.log(todayTemp)
                    var todayHumidity = weatherResponse.list[0].main.humidity;
                    console.log(todayHumidity)
                    var todayWind = weatherResponse.list[0].wind.speed;
                    console.log(todayWind)
                    var cityName = weatherResponse.city.name;
                    console.log(cityName)

                    //  put today's weather in container for today's weather
                   
                   $("#cityName").text(cityName + " " + moment().format("(DD-MM-YYYY)"));
                   $('#Temp').text(todayTemp + "C")
                   $('#Wind').text(todayWind + 'KPH')
                   $('#Humidity').text(todayHumidity + '%')
                   var forecast = $('#forecast');
                    // TODO: put 5 day's forecast weather in container for the 5 day forecast
                 for (i = 0 ; weathers.length > i ; i++){
                    console.log(weathers[i])
                    var olEl = $('<ol>') ;
                    olEl.text('hello')
                    forecast.append(olEl);
                //     var tempEl = weatherResponse.list[i].main.temp;
                //    $("<li>)").append(tempEl);
                //    windEl.text(todayWind + 'KPH')
                //    humidityEl.text(todayHumidity + '%')
                  

                 }




                    // Icon URL http://openweathermap.org/img/w/" + iconcode + ".png"
                });
        });
});