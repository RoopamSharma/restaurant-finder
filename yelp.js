var map;
var radius;
var lng,lat;
var json;
var markers = Array();
var bounds;

//Function to initialize the map
function initMap() {
	var loc = {lat: 32.75, lng: -97.13};
    map = new google.maps.Map(document.getElementById('map'), {
        center: loc,
        zoom: 16});
    google.maps.event.addListener(map, "bounds_changed", function() {
    bounds = map.getBounds();
    var nc = new google.maps.LatLng(bounds.l.l,bounds.j.l);   
	var center = map.getCenter();
	center = center.toJSON();
	lat = center.lat;
	lng = center.lng;
	var nc = new google.maps.LatLng(bounds.l.l,lng);
	var center = new google.maps.LatLng(lat,lng);
	console.log(nc.toString())
	console.log(center.toString())
	radius = google.maps.geometry.spherical.computeDistanceBetween(center,nc);
	});	
}

//sends the request to the server
function sendRequest () {
   console.log(radius);
   console.log(lat);
   console.log(lng);
   clearLabels();
   var xhr = new XMLHttpRequest();
   radius = Math.min(parseInt(radius),40000);
   console.log("Radius"+radius);
   //The actual search radius may be lower than the suggested radius in dense urban areas, and higher in regions of less business density.
   xhr.open("GET", "proxy.php?term="+document.getElementById("search").value+"&longitude="+lng+"&latitude="+lat+"&radius="+radius+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          json = JSON.parse(this.responseText);          
		  console.log(json);
		  addLabels(json);
		  var str = "<ol>";
		  for(i=0;i<json.businesses.length;i++){
			str+= "<li class='item'><div><img class='img' src='"+json.businesses[i].image_url+"' alt='image'><a class='title' href='"+json.businesses[i].url+"'>"+json.businesses[i].name+"</a><label class='ratings'>Ratings: "+json.businesses[i].rating+"</label></div></li>"
		  }
		  str+="</ol>"
		  document.getElementById("output").innerHTML = str;
       }
   };
   xhr.send(null);
}

//adds markers on the map
function addLabels(obj){
	markers = Array();
	for (i=0;i<obj.businesses.length;i++){
		markers[i] = new google.maps.Marker({
			position: {lat: obj.businesses[i].coordinates.latitude,lng : obj.businesses[i].coordinates.longitude},
			label: (i+1).toString(),	
			map: map});	
	}
}

//remove the markers from the map
function clearLabels(){
	for (i=0;i<markers.length;i++){
		markers[i].setMap(null);
	}
}