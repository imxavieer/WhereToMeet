/*!
* Start Bootstrap - Business Frontpage v5.0.6 (https://startbootstrap.com/template/business-frontpage)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-frontpage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
var num_of_inputs = 0

function initMap() {
    var lat = parseFloat(document.getElementById("lat").value);
    var lng = parseFloat(document.getElementById("lng").value);
    var loc = { lat: lat, lng: lng };

    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 12, center: loc});
    var marker = new google.maps.Marker({position: loc, map: map});

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
    initAutocomplete();
}

var total_lat = 0
var total_lng = 0
var avg_lat = 0
var avg_lng = 0
var recommended_address = ""

function getLoc() {
    var addr = encodeURI(document.getElementById("addr").value);
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addr + "&key=AIzaSyDbG_KPOQUKczUdjUrQB635LweoahsO6lo";

    axios.get(url)
        .then(response => {   
            var info = getFullAddress(response.data);
            document.getElementById("display").innerHTML = info;
            var coordinate = getLatLng(response.data);
            total_lat += coordinate.lat
            total_lng += coordinate.lng
            // console.log(total_lat,total_lng)

            document.getElementById("lat").value = coordinate["lat"];
            document.getElementById("lng").value = coordinate["lng"];

            var address = document.getElementById("addr").value;
                var bullet = document.createElement("li");
                var lat1 = document.getElementById('lat').value
                var lng1 = document.getElementById('lng').value
                
                // console.log(lat1, lng1)
    
                bullet.innerHTML = 
                    `
                    <div class='row'>
                        <div class='col-10'>
                            ${address}
                        </div>
                        <input type="hidden" id="lat1" value=${lat1}>
                        <input type="hidden" id="lng1" value=${lng1}>
                        <div class='col-2'>
                            <button class='btn btn-danger' onclick='deleteItem(this.parentNode)'>delete</button>
                        </div>
                    </div>
                    `
                ;
                var list = document.getElementById("addresses");
                list.appendChild(bullet);
                num_of_inputs += 1;
                document.getElementById("addr").value = ""
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

// var addButton = document.getElementById("addButton");
// addButton.addEventListener("click", addItem);
    
// function addItem() {
//     var address = document.getElementById("addr").value;
//     var bullet = document.createElement("li");
    
//     bullet.innerHTML = "<div class='row'><div class='col-8'>" + address + "</div>&nbsp;&nbsp; <div class='col-4'><button class='btn btn-warning ' onclick='deleteItem(this.parentNode)'>delete</button></div></div>";
//     var list = document.getElementById("addresses");
//     list.appendChild(bullet);
// }
    
function deleteItem(obj) {
    //    console.log(obj.childNodes)
        let tempObj = obj.parentNode
        console.log(tempObj.childNodes)
        total_lat -= tempObj.childNodes[3].value
        total_lng -= tempObj.childNodes[5].value
        console.log(total_lat,total_lng)
        tempObj.parentNode.remove()
        num_of_inputs -= 1
        // console.log(num_of_inputs)
    }

function reverseGeo() {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + avg_lat + "," + avg_lng + "&key=AIzaSyDbG_KPOQUKczUdjUrQB635LweoahsO6lo";
    axios.get(url)
        .then(response => {   
            recommended_address = document.getElementById("display").innerHTML = response.data.results[5].formatted_address;
            // console.log(response.data)
        })
        .catch(error => {
            console.log(error);
            document.getElementById("display").innerHTML = "Sorry, invalid address. Please try again!";
        });
}

var test_lat;
var test_lng;

async function recommend() {
    // console.log(total_lat,total_lng,num_of_inputs)
    avg_lat = total_lat / num_of_inputs;
    avg_lng = total_lng / num_of_inputs;
    document.getElementById('lat').value = avg_lat;
    document.getElementById('lng').value = avg_lng;
    test_lat = avg_lat;
    test_lng = avg_lng;
    initMap();
    reverseGeo();

    await initialize();

}

function placeSearch(){
    // var query = "Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry";
    // var urlToUse = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + query + "&key=AIzaSyAIoAdg46VQtDiLA1mU-aEXQrGtrkFrcqk";
    // var config = {
    //     method: 'get',
    //     url: urlToUse,
    //     headers: {
    //         'X-Requested-With': 'XMLHttpRequest',
    //         "Access-Control-Allow-Origin": "*"
    //     }
    // }

    // axios.get(config)
    // .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
}
// function nearbySearch(){


//     var config = {
//     method: 'get',
//     url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=1500&type=restaurant&key=AIzaSyDbG_KPOQUKczUdjUrQB635LweoahsO6lo',
//     headers: { }
//     };

//     axios(config)
//     .then(function (response) {
//         console.log("YES");
//     console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log("NO")
//     console.log(error);
//     });
// }

var map;
var service;
var infowindow;
var rad;
rad = 10;

async function initialize() {
    // console.log(test_lat,test_lng)
    var placetype = document.getElementById("placetype").value;

    

  var pyrmont = new google.maps.LatLng(test_lat,test_lng);
//   console.log(pyrmont);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: rad,
    type: [placetype]
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

}

function callback(results, status) {
    // console.log(results.length);
    console.log(status);
    console.log(rad)
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results.length);
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
            rad = 10;
        }}
    else if (rad<30){
        rad += 20;
        console.log(rad);
        recommend();
    }

    else if (rad<500){
        rad += 100;
        console.log(rad);
        recommend();
    }
    else if (rad<1000){
        rad += 200;
        console.log(rad);
        recommend();
    }
}







































function randomize(val) {
    //console.log(val)
    let result = 0
    let up = true
    if (Math.random()>0.5){
        up=false
    }
    if(up){
        result = Math.ceil((numb + Number.EPSILON) * 100) / 100;
    } else {
        result = Math.floor((numb + Number.EPSILON) * 100) / 100;
    }
}