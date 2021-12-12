
function pageInit()
{
    console.log("running pageInit");
}


function pageReady()
{
    console.log("running pageReady");

    var button = document.getElementById("search_button");
    button.addEventListener("click", SearchCity.bind(null) );
}


function SearchCity()
{
    var search_textarea = document.getElementById("search_text");
    var city            = search_textarea.value; 
    console.log("running SearchCity(" + city + ")");
}


window.onload = pageInit;
jQuery(document).ready(pageReady);
