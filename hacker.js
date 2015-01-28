

// ----- process: ---/
//get today's date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

today = yyyy+mm+dd-1;
console.log(today);

// get the json string
// var ecoUrl = 'http://www.eco-public.com/api/h7q239dd/data/periode/102018487/?begin=' + today + '&step=5'

//tempr
var ecoUrl = 'http://www.eco-public.com/api/h7q239dd/data/periode/100018487?begin=20150126&end=20150126&step=4';

//  not yet working
$.getJSON(ecoUrl, function(data) {
    //data is the JSON string
});


// parse json string


var jsObjects = [{a: 1, b: 2}, {a: 3, b: 4}, {a: 5, b: 6}, {a: 7, b: 8}];
var result = jsObjects.filter(function( obj ) {
  return obj.b == 6;
});

console.log(result);



//my cool data:

I can use the lat long which would be neat!

{"titre":"Peace Bridge Cyclist Counts","idPdc":102018487,"alias":"Alias","logos":["https://www.eco-visio.net/Logos/4190/1418316508984.jpg"],"langue":"CA","date":"2014-04-24","photos":[],"latitude":51.054085,"longitude":-114.07913,"pratique":2,"message":null,"url":"http://www.eco-public.com/Public/?id=102018487","nbPratiques":0,"nbSens":0}


// testing pull


var u = 'http://www.eco-public.com/api/h7q239dd/data/periode/100018487?begin=20150126&end=20150126&step=4';

$.ajax({
dataType: "json",
url: u,
data: u.data,
success: u.success
});


//parse previous days value

var jsonData = [{"date":"2015-01-27 00:00:00.0","comptage":902,"timestamp":1422313200000}];

for(var obj in jsonData){
    if(jsonData.hasOwnProperty(obj)){
    for(var prop in jsonData[obj]){
        if(jsonData[obj].hasOwnProperty(prop)){
//     alert(prop + ':' + jsonData[obj][prop]);
//            console.log(prop);
            if (prop == 'comptage') {
                var u = jsonData[obj][prop];
                console.log(u);
            }
        }
    }
}
}



// RAD!!!!! sloppy but it works

var u = 'http://www.eco-public.com/api/h7q239dd/data/periode/100018487?begin=20150126&end=20150126&step=4';

var request = $.getJSON( u, function() {

});

request.done(function(data){
//  console.log(data); 
  var compter = data[0].comptage
//  console.log(data[0].comptage);
  console.log(compter);
});



