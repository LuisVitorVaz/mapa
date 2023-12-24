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
var dadosList = document.getElementById("dados-list");
var cont =0;
var database = firebase.database();
var dadosRef = database.ref("dados");
var data_anterior= null;
var hora_anterior= null;

dadosRef.once("value")
  .then(function(snapshot) {
    if (!snapshot.exists()) {
      console.log("Nenhum dado encontrado.");
    } else {
      snapshot.forEach(function(childSnapshot) {
        var dataValor = childSnapshot.child("Latitude").val();
        var horaValor = childSnapshot.child("Longitude").val();
        var valorTexto = 100; // dados  do campo valor
        if(data_anterior == null && hora_anterior == null) // hora_anterior e data_anterior tera o dado do no anterior ao atual
        {
            data_anterior = dataValor;
            hora_anterior = horaValor;
            cont=50;
            console.log("dados repetidos");
        }
        else if (dataValor == 0 && horaValor == 0) {
          console.log("dados zerados");
        } else {
            if(cont == 50)
            {
              inserir_dados(dataValor,horaValor,valorTexto)
              cont =100;
            }
        }
      });
    }
  })
  .catch(function(error) {
    console.error("Erro ao recuperar dados: " + error.message);
  });

// Escuta alterações contínuas no banco de dados
dadosRef.on("child_added", function(childSnapshot) { // revisar funcao de atualizar os dados
  var dado = childSnapshot.val();
  // inserir_dados(dado.dataValor,dado.horaValor);

});
function inserir_dados(dataValor,horaValor,valorTexto){
  var newRow = dadosList.insertRow();
  // Adiciona células com os valores correspondentes
  newRow.insertCell(0).textContent = 1; // ID
  newRow.insertCell(1).textContent = dataValor;
  newRow.insertCell(2).textContent = horaValor;
  newRow.insertCell(3).textContent = valorTexto;
}
// export {dataValor};
