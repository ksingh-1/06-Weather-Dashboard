$(document).ready(function () {   
    let appid="52bc5d6c63798323a47e2f9d77df0a30";
    let city=$("#cityFind").val();
    let weather="";
    let date=moment().format("L");
    let search_history=JSON.parse(localStorage.getItem("cities"))===null?[]:JSON.parse(localStorage.getItem("cities"));
    
    
    displaySearches();
    function todaysReport(){
        if ($(this).attr("id")==="citysearchBtn") {
            city=$("#cityFind").val();
        } else {
            city=$(this).text();
        }
        
        weather="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + appid;

        if (search_history.indexOf(city)=== -1){
            search_history.push(city);
        }

        localStorage.setItem("cities", JSON.stringify(search_history));

        displaySearches();

        $.getJSON(weather, function (JSON) {
            let temp=(JSON.main.temp - 273.15)*(9/5)+32;
            let windspeed=JSON.wind.speed*2.237;
            $("#current-city").text(JSON.name+" "+ date);
            $("#weather-image").attr("src", "https://api.openweathermap.org/img/w/" + JSON.weather[0].icon +".png");
            $("#temperature").text(temp.toFixed(2)+ "°F");
            $("#humidity").text(JSON.main.humidity + "%");
            $("#windspeed").text(windspeed.toFixed(2)+" " + "mph");
        });
    }
    function ForecastFiveDays() {
        let Forecast_Five_Days= "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=" + appid;
        let day_count=1;

        $.ajax({
            url: Forecast_Five_Days,
            method:"GET"
        }).then(function (response) {
            for (let i=0; i<response.list.length; i++) {
                let dateandtime=response.list[i].dt_txt;
                let date=dateandtime.split(" ")[0];
                let time=dateandtime.split(" ")[1];
                if (time==="15:00:00"){
                    let year=date.split("-")[0];
                    let month=date.split("-")[1];
                    let day=date.split("-")[2];

                    $("#day-" + day_count).children(".card-day").text(month+"/"+day+"/"+year);
                    $("#day-" + day_count).children(".card-image").attr("src", "https://api.openweathermap.org/img/w/"+response.list[i].weather[0].icon+".png");
                    $("#day-" + day_count).children(".card-temp").text("Temperature: " + ((response.list[i].main.temp-273.15)*(9/5)+32).toFixed(2)+"°F");
                    $("#day-" + day_count).children(".card-humidity").text("Humidity: "+response.list[i].main.humidity + "%");
                    day_count++;
                }
            }
        });
    }

    function displaySearches() {
        $("#cities-searched").empty();
        search_history.forEach(function (city) {
            let history_item= $("<li>");
            history_item.addClass("list-group-item btn");
            history_item.text(city);
            $("#cities-searched").prepend(history_item);
        });
        $(".citySearchButton").click(todaysReport);
        $(".citySearchButton").click(ForecastFiveDays);
    }
    $("#clear-history").click(function() {
        localStorage.clear();
        location.reload();
    });
    $("#citySearchButton").click(displaySearches);
});
