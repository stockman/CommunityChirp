var donnerjour = function(){

var hier = new Date();

hier.setDate(hier.getDate() - 1);

// var hier = new Date();
var dd = hier.getDate();
var mm = hier.getMonth()+1; //January is 0!
var yyyy = hier.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

hier = yyyy+mm+dd;
// console.log(hier);

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

var u = 'http://www.eco-public.com/api/h7q239dd/data/periode/100018487?begin=' + hier + '&end='+ hier +'&step=4';

function Get(u){
var Httpreq = new XMLHttpRequest(); // a new request
Httpreq.open("GET",u,false);
Httpreq.send(null);
return Httpreq.responseText;          

    }
var json_obj = JSON.parse(Get(u));
var compter = json_obj[0].comptage;
// console.log(compter);
  return compter;
}

donnerjour();