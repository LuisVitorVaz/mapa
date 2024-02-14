var cont = 0;
var dataValor;
var horaValor;
var lat;
var long;
var coordenadas_iniciais_lat, coordenadas_iniciais_lon;
var coordenadas2,coordenadas3;
var dadosList = document.getElementById("data-box");
var database = firebase.database();

var dadosRef = database.ref("dados"); // Substitua pelo ID correto do seu nó de dados

var map; // Variável para armazenar o mapa

// Evento "child_added" para lidar com novos dados
dadosRef.on("child_added", function(childSnapshot) {
  // Acessa os valores diretamente no nível do childSnapshot
  dataValor = childSnapshot.child("dado1").val();
  horaValor = childSnapshot.child("dado2").val();
  console.log("Novo dado adicionado:");
  console.log(dataValor);
  console.log(horaValor);

  // Exemplo de uso
  const coordenadas1 = converterParaCoordenadas(dataValor, horaValor);
  console.log("aqui esta \n");
  console.log("Latitude:", coordenadas1.latitude);
  console.log("Longitude:", coordenadas1.longitude);

  // recupera a lat e longitude inicialmente
  if (cont == 0) {
    coordenadas_iniciais_lat = coordenadas1.latitude;
    coordenadas_iniciais_lon = coordenadas1.longitude;
    console.log("dados iniciais");
    cont = 50;
  }

  // Verifica se o mapa já foi inicializado
  if (!map) {
    iniciarMapa(coordenadas_iniciais_lat, coordenadas_iniciais_lon,coordenadas1.latitude,coordenadas1.longitude);
  }

  // Atualiza o HTML com os novos valores
  atualizarHTML(coordenadas1.latitude, coordenadas1.longitude);
});
// teste1 e teste2  contem os dados apos o primeiro dado postado no banco no caso e onde sera recebido lat e long apos o ponto incial
function iniciarMapa(lat, lon,teste1,teste2) {
  console.log("dados dentro do mapa :", teste1);
  console.log("dados dentro do mapa : ", teste2);
  // Coordenadas do Ponto A - Porto Alegre, Brasil
  const coordTaxi = [lat, lon];

  // Coordenadas do Ponto B - Usuário (coordenadas fictícias)
  const coordUser = [teste1, teste2];

  // Inicia o mapa com coordenadas do ponto A
  map = L.map('map').setView(coordTaxi, 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

  // Personaliza o ponto no mapa com imagem do táxi.
  const taxiIcon = L.icon({
    className: "taxi-pointers",
    iconUrl: 'car-top-view.png',
    iconSize: [45, 45]
  });
  const taxiMarker = L.marker(coordTaxi, { icon: taxiIcon }).addTo(map);

  // Identifica a melhor rota para iniciar a viagem.
  L.Routing.control({
    waypoints: [
      L.latLng(coordTaxi[0], coordTaxi[1]),
      L.latLng(coordUser[0], coordUser[1])
    ]
  }).on('routesfound', function(e) {
    const latlng = e.routes[0].coordinates;

    // Simula o táxi enviando a localização para o APP.
    latlng.forEach(function(coord, index) {
      setTimeout(function() {
        taxiMarker.setLatLng([coord.lat, coord.lng]);

        // Identifica o final da viagem.
        if (coord.lat === coordUser[0] && coord.lng === coordUser[1]) {
          alert('Seu táxi acabou de chegar!');
        }
      }, 1000 * index);
    });
  }).addTo(map);
}

function atualizarHTML(dataValor, horaValor) {
  // Atualiza o HTML com os valores correspondentes
  document.getElementById("latitude").textContent = dataValor;
  document.getElementById("longitude").textContent = horaValor;
}

function converterParaCoordenadas(latitude, longitude) {
  lat = latitude / 1e6; // Dividir por 1 milhão para obter a parte decimal correta
  long = longitude / 1e6;
  return { latitude: lat, longitude: long };
}
