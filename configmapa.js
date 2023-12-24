// import {dataValor} from './index.js'
// console.log("aqui no arquivo");
// console.log(dataValor);

let myCustomColourUser = 'background-color: red;';
const markerHtml = `
	width: 3rem;
	height: 3rem;
	display: block;
	left: -1.5rem;
	top: -1.5rem;
	position: relative;
	border-radius: 3rem;
	transform: rotate(45deg);
	border: 3px solid #FFFFFF;`;

  const coordTaxi = [-30.0326, -51.2300]; // Porto Alegre, Brasil

  // Coordenadas do Ponto B - Usuário
  const coordUser = [-30.0277, -51.2287]; // Coordenadas fictícias do usuário
  

// Iniciar o mapa com coordenadas do ponto A
const map = L.map('map').setView(coordTaxi, 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Personalizar Ponto no mapa com imagem do táxi.
const taxiIcon = L.icon({
  className: "taxi-pointers",
  iconUrl: 'car-top-view.png',
  iconSize: [45, 45]
});
const taxiMarker = L.marker(coordTaxi, { icon: taxiIcon }).addTo(map);

// Identificar a melhor rota para iniciar a viagem.
L.Routing.control({
  waypoints: [
    L.latLng(coordTaxi[0], coordTaxi[1]),
    L.latLng(coordUser[0], coordUser[1])
  ]
}).on('routesfound', function (e) {
  const latlng = e.routes[0].coordinates;

  // Simular o táxi enviando a localização para o APP.
  latlng.forEach(function (coord, index) {
    setTimeout(function () {
      taxiMarker.setLatLng([coord.lat, coord.lng]);

      // Identificar o final da viagem.
      if (coord.lat === coordUser[0] && coord.lng === coordUser[1]) {
        alert('Seu táxi acabou de chegar!');
      }
    }, 1000 * index);
  });
}).addTo(map);
