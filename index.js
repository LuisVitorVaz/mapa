const firebaseConfig = {
    apiKey: "AIzaSyCG6pcJI9JV8G6gW8F8HAhfEGJvw8vhXDY",
    authDomain: "bancodedados-a7591.firebaseapp.com",
    databaseURL: "https://bancodedados-a7591-default-rtdb.firebaseio.com",
    projectId: "bancodedados-a7591",
    storageBucket: "bancodedados-a7591.appspot.com",
    messagingSenderId: "741882138538",
    appId: "1:741882138538:web:ac252fba2cb841cc39e5d3",
    measurementId: "G-6BRRPEZT5Y"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Faz a ligação com o HTML
var passarosList = document.getElementById("passaros-list");
var dataElement = document.getElementById("data-list");
var horaElement = document.getElementById("hora-list");
// Inicializa o Firebase (se ainda não estiver inicializado)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var database = firebase.database();
var passarosRef = database.ref("dados");
var horaRef = database.ref("Latitude");
var dataRef = database.ref("Longitude");

passarosRef.on("child_added", function(childSnapshot) {
  var valor = childSnapshot.val();

 
  var listItem = document.createElement("li");
  listItem.textContent = "Valor: " + valor;

 
  passarosList.appendChild(listItem);
});
dataRef.on("child_added", function(childSnapshot) {
  var dataValor = childSnapshot.val();
  dataElement.textContent = "Data: " + dataValor;
});

horaRef.on("child_added", function(childSnapshot) {
  var horaValor = childSnapshot.val();
  horaElement.textContent = "Hora: " + horaValor;
});
passarosRef.once("value") 
  .then(function(snapshot) {
    if (!snapshot.exists()) {
      console.log("Nenhum dado encontrado para temperatura.");
    }
  })
  .catch(function(error) {
    console.error("Erro ao recuperar dados: " + error.message);
  });
  // Carregar dados iniciais para "data" usando once("value")
dataRef.once("value")
.then(function(snapshot) {
  if (!snapshot.exists()) {
    console.log("Nenhum dado encontrado para data.");
  } else {
    snapshot.forEach(function(childSnapshot) {
      var dataValor = childSnapshot.val();
      dataElement.textContent = "Data: " + dataValor;
    });
  }
})
.catch(function(error) {
  console.error("Erro ao recuperar dados de data: " + error.message);
});

// Carregar dados iniciais para "hora" usando once("value")
horaRef.once("value")
.then(function(snapshot) {
  if (!snapshot.exists()) {
    console.log("Nenhum dado encontrado para hora.");
  } else {
    snapshot.forEach(function(childSnapshot) {
      var horaValor = childSnapshot.val();
      horaElement.textContent = "Hora: " + horaValor;
    });
  }
})
.catch(function(error) {
  console.error("Erro ao recuperar dados de hora: " + error.message);
});
// Agora exporte estrutura após as inicializações
module.exports = { horaRef, dataRef };