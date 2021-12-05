// var initMap = function() {
//     console.log("INIT MAP")
// }
// console.log(document.getElementById("map"))
// var map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 5,
//     center: { lat: 37.0902, lng: -95.7129 },
//     zoomControl: false
//   });
function draw_pointers(map, pointers) {
  // console.log(pointers[0])
  for (pointer in pointers) {
    var p = pointers[pointer];
    console.log(p);

    var marker = new google.maps.Marker({
      position: {
        lat: parseFloat(p.lat),
        lng: parseFloat(p.long),
      },
      map: map,
      label: p.name,
    });
  }
}

function get_pointers(map) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch('http://localhost:3000/api/recommendations/get-recs', requestOptions)
    .then((response) => response.text())
    .then((result) => draw_pointers(map, JSON.parse(result)))
    .catch((error) => console.log('error', error));
}

function initMap() {
  console.log('INIT MAP');
  setTimeout(() => {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: { lat: 37.0902, lng: -95.7129 },
      zoomControl: false,
    });

    get_pointers(map);
  }, 1000);
} // now it IS a function and it is in global

// initMap()
