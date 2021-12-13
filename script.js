var storeObj = {};


function pageInit()
{
    console.log("running pageInit");
    storeInit();
}

function storeInit(){
    console.log("storeInit");
    storeObj.validcity = 0; 
    storeObj.updated=0;
    storeObj.city="non";
    storeObj.lat=0;
    storeObj.lon=0;
    storeObj.history=[];
    storeObj.date= new Date();
    console.log("storeInit=%o",storeObj);
}

function storeSetCity(city,lat,lon){
    var date = new Date();
    var dates1 = date.toString();
    console.log("storeSetCity("+city+ ","+lat+","+lon+" at "+dates1);
    if (lat != 0 && lon != 0 ){
        storeObj.city = city;
        storeObj.lat = lat;
        storeObj.lon = lon;
        storeObj.validcity =1;
        storeObj.updated=1;
        storeObj.dates=dates1;
        storeObj.date=date;

        storeObj.day=[];
        storeObj.day[0]={};
        storeObj.day[1]={};
        storeObj.day[2]={};
        storeObj.day[3]={};
        storeObj.day[4]={};
        storeObj.day[5]={};

        if (storeObj.history.includes(city)){
            console.log("skippping city add to history");
        } else{
            storeObj.history.push(city);
            storeObj.history.reverse();
        }
    }
    console.log("storeSetCity=%o",storeObj);
}

function storeSetDay(day,data){
    if (day>=0 && day<=5 ){
        storeObj.day[day]=data;
        storeObj.updated=1;
    }
    console.log("storeSetDay=%o",storeObj);

}
function storeGetDay(day){
    if (day>=0 && day<=5 ){
        console.log("storeGetDay=%o",storeObj.day[day]);
        return storeObj.day[day];
    }
}

function storeSave(){
    console.log("storeSave %o",storeObj);
    localStorage.setItem("storeObj", JSON.stringify(storeObj));
}

function storeLoad(){
    var json_data = localStorage.getItem("storeObj");
   if (json_data != null ) {
    console.log("running loadData");
    console.log("json=" + json_data);
     storeObj = JSON.parse(json_data);
     storeObj.updated=1;
     storeObj.date= new Date();
   }
   console.log("storeLoad %o",storeObj);
}

function pageReady()
{
    console.log("running pageReady");
    storeLoad();
    var button = document.getElementById("search_button");
    button.addEventListener("click", SearchCity.bind(null,"") );

}


function SearchCity(city="")
{
    if (city == "" || city == null){
        var search_textarea = document.getElementById("search_text");
            city            = remove_linebreaks(search_textarea.value); 
    }
    console.log("running SearchCity(" + city + ")");
    GetCityLocation(city);
}

function GetCityLocation(city)
{
    var apikey = "34cfbc64baac89bb6d449e9ff3ac1421";
    var newcity= encodeURIComponent(city);
        newcity = newcity.replace(" ","+");
    var url = "https://api.openweathermap.org/geo/1.0/direct?q=" + newcity + "&limit=1&appid="+apikey;
    console.log ("runnign GetCityLocation() url="+url);
    $.get(url, function (data,status) {
        console.log("status="+status);
        console.log("data= %o",data);
        if(status=="success" && Object.keys(data).length >0){
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log("got city " +city+ " at " +lat+" , "+ lon); 
            GetCityWeather(city, lat, lon);

        }

    });
}
function GetCityWeather(city, lat, lon)
{
    //var lat = 33.44; 
    //var lon = -94.04;/
    var apikey = "34cfbc64baac89bb6d449e9ff3ac1421";
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=" + apikey;
    console.log ("runnign GetCityWeather() url="+url); 
    $.get(url, function (data,status) {
        console.log("status="+status);
        console.log("data= %o",data);
        if(status=="success" && Object.keys(data).length >0){
            var lat = data.lat;
            var lon = data.lon;
            console.log("got city " +city+ " at " +lat+" , "+ lon); 
            storeSetCity(city,lat,lon);
            storeSetDay(0,data.daily[0]);
            storeSetDay(1,data.daily[1]);
            storeSetDay(2,data.daily[2]);
            storeSetDay(3,data.daily[3]);
            storeSetDay(4,data.daily[4]);
            storeSetDay(5,data.daily[5]);
            storeSave();
        }

    });

}

function updateCityWeatherDetail(){
    var city_weather_detail = document.getElementById("city_weather_detail");
    var weather = storeGetDay(0);
    console.log("weather=%o",weather);
    var dates =getFormattedDate(storeObj.date);
    city_weather_detail.innerHTML = "<p class=city_weather_detail_title>" + storeObj.city + " " + dates + "</p>";
    city_weather_detail.innerHTML += "<p>" + "Temp: " + KtoF(weather.temp.day) + " F</p>";
    city_weather_detail.innerHTML += "<p>" + "Wind: " + round(weather.wind_speed,1) + " MPH</p>";
    city_weather_detail.innerHTML += "<p>" + "Humidity: " + weather.humidity + " %</p>";
    city_weather_detail.innerHTML += "<p>" + "UV index: " + weather.uvi + "</p>";

    var search_textarea = document.getElementById("search_text");
    search_textarea.value = storeObj.city;
}

function updateCityWeatherDay(day){
    var dayid = "day"+ day;
    console.log("updateCityWeatherDay(" + dayid + ")");
    var city_weather_day = document.getElementById(dayid);
    var weather = storeGetDay(day);
    console.log("weather=%o",weather);
    var datems=storeObj.date.getTime();
        datems=datems+(24*60*60*1000*day);
    var daydate = new Date(datems);
    var dates=getFormattedDate(daydate);
    city_weather_day.innerHTML = "<p class=city_weather_day_title>"  + dates + "</p>";
    city_weather_day.innerHTML += "<p>" + "Temp: " + KtoF(weather.temp.day) + " F</p>";
    city_weather_day.innerHTML += "<p>" + "Wind: " + round(weather.wind_speed,1) + " MPH</p>";
    city_weather_day.innerHTML += "<p>" + "Humidity: " + weather.humidity + " %</p>";
}
function updateSearchHistory(){
    console.log("updateSearchHistory()");
    var search_history = document.getElementById("search_history_div");
    var length = storeObj.history.length;
    if (length>10){length=10};
    search_history.innerHTML = "";
    for (let i=0; i<length; i++ ){  
        var city = storeObj.history[i];                
        search_history.innerHTML += "<button class=button_history id=search_history_button_"+i+">"+ city + "</button>";
    }
}

function updateSearchHistoryEvent (){
    var length = storeObj.history.length;
    if (length>10){length=10};
    for (let i=0; i<length; i++){
        var city = storeObj.history[i]; 
        var button = document.getElementById("search_history_button_"+i);
        if (button != null){
            button.addEventListener("click", SearchCity.bind(null,city) );
        }
    }
}


function updateDisplay(){
    if (storeObj.updated == 1 && storeObj.validcity ==1 ){
        console.log("updateDisplay()");
        updateSearchHistory();
        updateCityWeatherDetail();
        updateCityWeatherDay(1);
        updateCityWeatherDay(2);
        updateCityWeatherDay(3);
        updateCityWeatherDay(4);
        updateCityWeatherDay(5);
        updateSearchHistoryEvent();
        storeObj.updated = 0;
    }
}

function KtoF(kelvin){
    var F=(kelvin-273.15)*(9/5)+(32);
    return round(F,1); 

}

function round(value,precision){
    var multiplier = Math.pow(10,precision || 0);
    return Math.round(value * multiplier) / multiplier;

}

function getFormattedDate(date) {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
  }

function remove_linebreaks( message ) {
    return message.replace( /[\r\n]+/gm, "" );
  }

window.onload = pageInit;
jQuery(document).ready(pageReady);
setInterval(updateDisplay, 1000);
