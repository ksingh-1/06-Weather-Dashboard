$(document).ready(function () {
    let appid="&APPID=52bc5d6c63798323a47e2f9d77df0a30";
    // var city=searchedCities[searchedCities.length-1];
    let city="";
    let weather="";
    let todays_date=moment().format('dddd,MMMM Do YYYY');
    let searchHistory=JSON.parse(localStorage.getItem("cities"))===null?[]:JSON.parse(localStorage.getItem("cities"));
    init();
    // const queryURL="api.openweathermap.org/data/2.5/weather?q=";
    
    
    // const citySearch=$(".cityinput");

    // $(document).ready(function () {
    //     var city=citiesLIst[citiesLIst.length-1];
    //     fiveDays(city);
    //     citySearch(city);
    // });

    // citySearch.on('submit', function (event){
    //     event.preventDefault();
    //     // letcityName=$('#citySearch').val();
    //     displayCityweather(cityName);

    // function citySearch(city) {
    //     $(".city").empty();
    //     $(".temp").empty();
    //     $(".humidity").empty();
    //     $(".wind").empty();
    //     $(".uvIndex").empty();
    // });

    displaySearch();
    function currentWeather(){
        if ($(this).attr("id")==="citySearchBtn") {
            city=$("#citySearch").val();
        } 
        else {
            city=$(this).text();
        }
    

        weather="https://api.openweathermap.org/data/2.5/weather?q=" + city + appid;

        if (searchHistory.indexOf(city)===-1){
        searchHistory.push(city);
        }

        localStorage.setItem("cities", JSON.stringify(searchHistory));

        displaySearch();

        $.getJSON(weather, function (json) {
            let temp=(json.main.temp - 273.15)*(9/5)+32;
            let windspeed=json.wind.speed*2.237;
            $("#activeCity").text(json.name+" "+todays_date);
            $("#weatherImg").text("src", "https://api.openweathermap.org/img/w/" + json.weather[0].icon+".png");
            $("#temperature").text(temp.toFixed(2)+ "*F");
            $("#humidity").text(json.main.humidity + "%");
            $("#windspeed").text(windspeed.toFixed(2)+" " + "mph");
        });
    }
    function ForecastFiveDays() {
        let Five_Day_Forecast= "https://api.openweathermap.org/data/2.5/forecast?q=" + city + appid;
        let day_count=1;

        $ajax({
            url:Five_Day_Forecast,
            method:"GET"
        })
        .then(function(response) {
            for (let i=0; i<response.list.length; i++) {
                let dateandtime=response.list[i].dt_txt;
                let day=dateandtime.split(" ")[0];
                let time=dateandtime.split(" ")[1];
                if (time==="15:00:00"){
                    let year=date.split("-")[0];
                    let month=date.split("-")[1];
                    let date=date.split("-")[2];

                    $("date-") + day_count.children(".card-date").text(month+ "/" + day+ "/" + year);
                    $("date-") + day_count.children(".image").attr("src", "https://api.openweathermap.org/img/w/"+response.list[i].weather[0].icon+".png");
                    $("date-") + day_count.children(".card-temperature").text("Temperature: " + ((response.list[i].main.temp=273.15)*(9/5)+32).toFixed(2)+"*F");
                    $("date-") + day_count.children(".card-humidity").text("Humidity: "+response.list[i].main.humidity + "%");
                    day_count++;
                }
            }
        });
    }

    function displaySearch(){
        $("#searchedCities").empty();
        searchHistory.forEach(function (city) {
            let past_search=$("<li>");
            past_search.addClass("list-group-time btn");
            past_search.text(city);
            $("#searched-city").prepend(past_search);
        });
        $(".citySearchBtn").click(currentWeather);
        $(".citySearchBtn").click(ForecastFiveDays);
    }
    $("#clearHistory").click(function() {
        localStorage.clear();
        location.reload();
    });
    $("#citySearchBtn").click(displaySearch);
});

// Search History//
    // $("ullist").on('click', function (event){
    //     clearPreviousCityData();
    //     let listItem=event.target.id;
    //     console.log("Search History: " +listItem);
    //     if (!!listItem){
    //         displayCityWeather(listItem, false);
    //     }
    // });
