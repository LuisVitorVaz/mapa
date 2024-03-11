import {circulosAdicionados, trajetoria,circulosdealerta,toggleCircle} from './configmapa.js'; // Importa as funções necessárias

let isRoute1Clicked = false;
let isRoute2Clicked = false;
let isRoute3Clicked = false;
let isRoute1Visible = true; // Variável para controlar a visibilidade da rota 1




// BOTAO VERDE COM O TITULO PONTOS
export function handleRoute1Click() {
   
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

// BOTAO AZUL COM O TITULO TRACADO
export function handleRoute2Click() {
    isRoute2Clicked = !isRoute2Clicked; // Inverte o estado de clique
    if (isRoute2Clicked) {
        document.getElementById('route2-btn').style.backgroundColor = 'yellow'; // Muda cor para amarelo

        trajetoria.forEach(circulo => {
            circulo.setStyle({ fillOpacity: 0, color: 'transparent' }); // Oculta cada ponto na lista
        });
    } else {
        document.getElementById('route2-btn').style.backgroundColor = ''; // Restaura a cor original

        trajetoria.forEach(circulo => {
            circulo.setStyle({ fillOpacity: 0.5, color: 'blue' }); // Restaura a opacidade e a cor do círculo
        });
    }
}
// BOTAO DE ALERTA 
let toggleCircleAtivo = false; // Variável para controlar se toggleCircle está ativo

export function handleRoute3Click() {
    isRoute3Clicked = !isRoute3Clicked; // Inverte o estado de clique
    
    if (isRoute3Clicked) {
        document.getElementById('route3-btn').style.backgroundColor = 'hsl(0, 70%, 80%)'; // Muda cor para vermelho
       
        circulosdealerta.forEach(circulo => {
            circulo.setStyle({ fillOpacity: 0, color: 'transparent' }); // Oculta cada ponto na lista
        });

        // Chama toggleCircle somente se não estiver ativo
        if (!toggleCircleAtivo) {
            toggleCircleAtivo = true;
            toggleCircle(true);
        }

    } else {
        document.getElementById('route3-btn').style.backgroundColor = ''; // Restaura a cor original
        circulosdealerta.forEach(circulo => {
            circulo.setStyle({ fillOpacity: 0.5, color: 'red' }); // Restaura a opacidade e a cor do círculo
        });

        // Não é necessário chamar toggleCircle aqui
    }
}
export function handleRoute4Click() {
    isRoute2Clicked = !isRoute2Clicked; // Inverte o estado de clique
    if (isRoute2Clicked) {
        document.getElementById('route4-btn').style.backgroundColor = 'yellow'; // Muda cor para amarelo
    } else {
        document.getElementById('route4-btn').style.backgroundColor = ''; // Restaura a cor original
    }
}
export function handleRoute5Click() {
    isRoute2Clicked = !isRoute2Clicked; // Inverte o estado de clique
    if (isRoute2Clicked) {
        document.getElementById('route5-btn').style.backgroundColor = 'yellow'; // Muda cor para amarelo
    } else {
        document.getElementById('route5-btn').style.backgroundColor = ''; // Restaura a cor original
    }
}
// BOTAO DE ALERTA 
export function handleRoute6Click() {
    isRoute2Clicked = !isRoute2Clicked; // Inverte o estado de clique
    if (isRoute2Clicked) {
        document.getElementById('route6-btn').style.backgroundColor = 'hsl(0, 70%, 80%)'; // Muda cor para vermelho
    } else {
        document.getElementById('route6-btn').style.backgroundColor = ''; // Restaura a cor original
    }
}
// Dentro de ocultarCirculo e mostrarCirculo, você chama toggleCircle com a variável 
function  ocultarCirculo(circulos) {
    console.log("ocultando circulo");
    circulos.forEach(circulo => {
        circulo.setStyle({ fillOpacity: 0,color: 'transparent' }); // Oculta cada ponto na lista
    });
}
function mostrarCirculo(circulos) {
    console.log("mostrar circulo");
    circulos.forEach(circulo => {
        circulo.setStyle({ fillOpacity: 0.5 }); // Mostra cada ponto na lista
    });
}


document.getElementById('route1-btn').addEventListener('click', handleRoute1Click);
document.getElementById('route2-btn').addEventListener('click', handleRoute2Click);
document.getElementById('route3-btn').addEventListener('click', handleRoute3Click);
document.getElementById('route4-btn').addEventListener('click', handleRoute4Click);
document.getElementById('route5-btn').addEventListener('click', handleRoute5Click);
document.getElementById('route6-btn').addEventListener('click', handleRoute6Click);


