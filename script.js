$(document).ready(function () {
    var appID = '52bc5d6c63798323a47e2f9d77df0a30';
    var weather = "";
    var city = "";
    var todays_date = moment().format('L');
    var search_history = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));
    var uviAPI = "https://api.openweathermap.org/data/2.5/uvi?lat=";

    displaySearches();
    function currentWeather() {

        if ($(this).attr("id") === "searchBtn") {
            city = $("#searchBar").val();
        } else {
            city = $(this).text();
        }

        weather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + appID;

        if (search_history.indexOf(city) === -1) {

            search_history.push(city);
        }

        localStorage.setItem("cities", JSON.stringify(search_history));

        displaySearches();

        $.getJSON(weather, function (json) {
            let temp = (json.main.temp - 273.15) * (9 / 5) + 32;
            let windspeed = json.wind.speed * 2.237;

            $("#current-city").text(json.name + " " + todays_date);
            $("#weather-img").attr("src", "https://api.openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temperature").text(temp.toFixed(2) + "°F");
            $("#humidity").text(json.main.humidity + "%");
            $("#windspeed").text(windspeed.toFixed(2) + " " + "mph");

            // var lat = response.coord.lat;
            // var lon = response.coord.lon;
            // var uviQueryURL = uviAPI + lat + "&lon=" + lon + appID;

            // $.ajax({
            //     url: uviQueryURL,
            //     method: "GET"
            // }).then(function (uviResponse) {
            //     var uviResults = uviResponse;
            //     var uvi = uviResults.value;
            //     $("#uv-index").html(
            //       
            //     );

            //     if (uvi < 3) {
            //         $("#uvi-badge").css("background-color", "green");
            //     } else if (uvi < 6) {
            //         $("#uvi-badge").css("background-color", "yellow");
            //     } else if (uvi < 8) {
            //         $("#uvi-badge").css("background-color", "orange");
            //     } else if (uvi < 11) {
            //         $("#uvi-badge").css("background-color", "red");
            //     } else {
            //         $("#uvi-badge").css("background-color", "purple");
            //     }
            // });
        
        });
    }

    function FiveDayForecast() {

        let Five_Day_Forecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=" + appID;

        let day_count = 1;

        $.ajax({
            url: Five_Day_Forecast,
            method: "GET"
        }).then(function (response) {

            for (let i = 0; i < response.list.length; i++) {
                let dateandtime = response.list[i].dt_txt;
                let date = dateandtime.split(" ")[0];
                let time = dateandtime.split(" ")[1];

                if (time === "15:00:00") {
                    let year = date.split("-")[0];
                    let month = date.split("-")[1];
                    let day = date.split("-")[2];
                    $("#day-" + day_count).children(".card-date").text(month + "/" + day + "/" + year);
                    $("#day-" + day_count).children(".card-icon").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#day-" + day_count).children(".card-temp").text("Temp: " + ((response.list[i].main.temp - 273.15) * (9 / 5) + 32).toFixed(2) + "°F");
                    $("#day-" + day_count).children(".card-humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                    day_count++;
                };
            };
        });
    };

    // Display for Search bar and history searches // 
    function displaySearches() {

        $("#searched-cities").empty();
        search_history.forEach(function (city) {

            let history_item = $("<li>");

            history_item.addClass("list-group-item btn");
            history_item.text(city);

            $("#searched-cities").prepend(history_item);
        });
        $(".citysearchButton").click(currentWeather);
        $(".citysearchButton").click(FiveDayForecast);
    }

    $("#clear-history").click(function () {
        localStorage.clear();
        location.reload();
    });
    $("#.citysearchButton").click(displaySearches);
})