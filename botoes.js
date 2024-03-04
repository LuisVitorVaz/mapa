import { adicionarCirculo, criarLinhaEntrePontos,circulosAdicionados  } from './configmapa.js'; // Importa as funções necessárias

let isRoute1Clicked = false;
let isRoute1Visible = true; // Variável para controlar a visibilidade da rota 1
let isRoute2Clicked = false;


export function handleRoute1Click() {
    // Inverte o estado de clique do botão "Rota 1"
    isRoute1Clicked = !isRoute1Clicked;
    
    // Alterna a cor do botão entre amarelo e a cor original
    if (isRoute1Clicked) {
      document.getElementById('route1-btn').style.backgroundColor = 'yellow'; // Muda cor para amarelo
    } else {
      document.getElementById('route1-btn').style.backgroundColor = ''; // Restaura a cor original
    }
    
    // Alternar a visibilidade da rota no mapa
    if (isRoute1Visible) {
        ocultarCirculo(circulosAdicionados); // Oculta o círculo
    } else {
        mostrarCirculo(circulosAdicionados); // Mostra o círculo
    }
    
    isRoute1Visible = !isRoute1Visible; // Inverte o estado de visibilidade da rota 1
}
// Dentro de ocultarCirculo e mostrarCirculo, você chama toggleCircle com a variável 
function  ocultarCirculo(circulos) {
    console.log("ocultando circulo");
    circulos.forEach(circulo => {
        circulo.setStyle({ fillOpacity: 0,color: 'transparent' }); // Oculta cada ponto na lista
    });
}

function mostrarCirculo(circulos) {
    circulos.forEach(circulo => {
        circulo.setStyle({ fillOpacity: 0.5 }); // Mostra cada ponto na lista
    });
}
export function handleRoute2Click() {
    isRoute2Clicked = !isRoute2Clicked; // Inverte o estado de clique
    if (isRoute2Clicked) {
        document.getElementById('route2-btn').style.backgroundColor = 'yellow'; // Muda cor para amarelo
    } else {
        document.getElementById('route2-btn').style.backgroundColor = ''; // Restaura a cor original
    }
}


document.getElementById('route1-btn').addEventListener('click', handleRoute1Click);
document.getElementById('route2-btn').addEventListener('click', handleRoute2Click);