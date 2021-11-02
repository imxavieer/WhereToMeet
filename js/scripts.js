/*!
* Start Bootstrap - Business Frontpage v5.0.6 (https://startbootstrap.com/template/business-frontpage)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-frontpage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

function initMap() {
    var lat = parseFloat(document.getElementById("lat").value);
    var lng = parseFloat(document.getElementById("lng").value);
    var loc = { lat: lat, lng: lng };

    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 12, center: loc});
    var marker = new google.maps.Marker({position: loc, map: map});
}

function getLoc() {
    var addr = encodeURI(document.getElementById("addr").value);
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addr + "&key=AIzaSyAIoAdg46VQtDiLA1mU-aEXQrGtrkFrcqk";

    axios.get(url)
        .then(response => {   
            var info = getFullAddress(response.data);
            document.getElementById("display").innerHTML = info;
            var coordinate = getLatLng(response.data);
            document.getElementById("lat").value = coordinate["lat"];
            document.getElementById("lng").value = coordinate["lng"];
            initMap();
        })
        .catch(error => {
            console.log(error);
            document.getElementById("display").innerHTML = "Sorry, invalid address. Please try again!";
        });
}

function getFullAddress(data) {
    var addr = data["results"][0]["formatted_address"];
    var loc = getLatLng(data);
    return addr + "<br> lat: " + loc["lat"] + ",lng: " + loc["lng"];
}

function getLatLng(data) {
    var location = data["results"][0]["geometry"]["location"];
    return location;
}
let autocomplete;
function initAutocomplete(){
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('addr'),
        {
            types: [],
            componentRestrictions: {'country':['SG']},
        }
    );
}

var addButton = document.getElementById("addButton");
            addButton.addEventListener("click", addItem);
    
            function addItem() {
                var address = document.getElementById("addr").value;
                var bullet = document.createElement("li");
    
                bullet.innerHTML = address + "<button class='btn btn-secondary' onclick='deleteItem(this.parentNode)'>delete</button>";
                var list = document.getElementById("addresses");
                list.appendChild(bullet);
            }
    
            function deleteItem(obj) {
                obj.remove()
            }