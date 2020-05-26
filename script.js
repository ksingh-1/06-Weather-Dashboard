let cityName, queryURl;
const citySearch=$(".cityinput");

citySearch.on('submit', function (event){
    event.preventDefault();
    letcityName=$('#citySearch').val();
    displayCityweather(cityName);
    
});

$("ullist").on('click', function (event){
    clearPreviousCityData();
    let listItem=event.target.id;
    // errors out
    if(listItem) {
        displayCityweather(list listItem, false);
    }
});



