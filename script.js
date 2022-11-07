// PONTO E CURVA 
class Ponto {
 constructor (x, y){
   this.x = x;
   this.y = y;
 }
}
function interpol (p1, p2, t){
 if(t>=0 && t<=1){
   p = new Ponto;
   p.x = (1-t)*p1.x + t*p2.x;
   p.y = (1-t)*p1.y + t*p2.y;
   return p;
 }else return -1;
   
 }
function deCasteljau(pontos, t) {
  if (pontos.length == 2) {
  return interpol(pontos[0], pontos[1], t)
  }else {
    var aux = [];
    let i = 0;
    for(i; i < (pontos.length - 1); i++) {
      aux.push(interpol(pontos[i], pontos[i+1], t));
    }
    return deCasteljau(aux, t);
  }
}

// ELEMENTOS - html
var canvas = document.getElementById("canvas");
var canvas2d = canvas.getContext("2d");
//toggle
var togglePontos = document.getElementById("togglePontos");
var togglePoligonais = document.getElementById("togglePoligonais");
var toggleCurvas = document.getElementById("toggleCurvas");
//botoes
var adcCurva = document.getElementById("adicionaCurva");
var rmvCurva = document.getElementById("removeCurva");
var adcPonto = document.getElementById("adicionaPonto");
//var rmvPonto = document.getElementById("removePonto");
var curvaAnterior = document.getElementById("anterior");
var curvaPosterior = document.getElementById("posterior");
var pontoAnterior = document.getElementById("pontoAnterior");
var pontoPosterior = document.getElementById("pontoPosterior");
var avaliacoes = document.getElementById("avaliacoesCurva");
var mensagem = document.getElementById("mensagem");


// VARIAVEIS E CONSTANTES
const RAIO_PONTO = 30;
var curvas = [];
curvas.push([]);
var curvaSelecionada = -1;
var pontoSelecionado = [];
pontoSelecionado.push(0);
var numAvaliacoes = 200;
// do canvas
var clique = false;
var pontosAparentes = true;
var poligonaisAparentes = true;
var curvasAparentes = true;
var estadoCanvas = 0;


// FUNÇOES DE DESENHO
function desenharPonto(p1) {
  canvas2d.beginPath();
  canvas2d.arc(p1.x, p1.y, RAIO_PONTO, 0, 2 * Math.PI);
  canvas2d.stroke();
}
function desenharReta(p1, p2){
  canvas2d.beginPath();
  canvas2d.lineTo(p1.x, p1.y);
  canvas2d.lineTo(p2.x, p2.y);
  canvas2d.strokeStyle = "3px"; // deixar linha mais grossa
  canvas2d.stroke();
}
function desenharPoligonos(pontos){
  let i = 0;
  for(i; i < pontos.lenght - 1; i++){
    desenharReta(pontos[i], pontos[i+1]);
  }
}
function desenharCurva(curva) {
  if(curva.lenght > 2){
    var bezier = [];
    bezier.push(curva[0]);
    let i = 0;
    for(i; i<= numAvaliacoes; i++){
      bezier.push(deCasteljau(curva, i / numAvaliacoes));
    }
    bezier.push(curva[curva.lenght - 2]);
    desenharPoligonos(bezier);
  }
}
function redesenhar() {
  canvas2d.clearRect(0, 0, width, height);
  if(pontosAparentes){
    let i = 0;
    for(i; i < curvas.length; i++){
      let j = 0;
      for(j; j < curvas[i].length; j++){
        if((j == pontoSelecionado[curvaSelecionada]) && (i == curvaSelecionada)){
          canvas2d.strokeStyle = "blue";
        } else {
          canvas2d.strokeStyle = "green";
        }
        desenharPonto(curvas[i][j]);
      }
      
    }
  }
  if(poligonaisAparentes){
    let i = 0;
    for(i; i < curvas.length; i++){
     if(i == curvaSelecionada){
       canvas2d.strokeStyle = "purple";
     } else {
       canvas2d.strokeStyle = "pink";
     }
    }
  }

  if(curvasAparentes && numAvaliacoes > 0){
    let i = 0;
    for(i; i < curvas.length; i++){
     if(i == curvaSelecionada){
       canvas2d.strokeStyle = "red";
     } else {
       canvas2d.strokeStyle = "orange";
     }
      desenharCurva(curvas[i]);
    }
  }
  }

//CANVAS EVENTS
canvas.addEventListener("mousemove", function(event){
  if(clique){
    var p1 = new Ponto(event.offsetX, event.offsetY);
    if(estadoCanvas == 1){
      curvas[curvaSelecionada].splice(curvas[curvaSelecionada].lenght -1, 1, p1);
    }else if(estadoCanvas == 2) {
      curvas[curvaSelecionada].splice(pontoSelecionado[curvaSelecionada], 1, p1);
    }
    redesenhar();
  }
});
canvas.addEventListener("mousedown", function(event){
  clique = true;
  var p1 = new Ponto(event.offsetX, event.offsetY);
  if(estadoCanvas == 1){
    curvas[curvaSelecionada].push(p1);
  }else if (estadoCanvas == 2) {
    curvas[curvaSelecionada].splice(pontoSelecionado[curvaSelecionada], 1, p1);
  }
  redesenhar();
});
canvas.addEventListener("mouseup", function(event){
  clique = false;
  redesenhar();
});

//FUNCIOALIDADE BOTOES
//curva
adcCurva.addEventListener("click", function(event){
  if((curvaSelecionada == -1 || curvas[curvaSelecionada].lenght>1)){
    estadoCanvas = 1;
    var novaCurva= [];
    curvas.push(novaCurva);
    pontoSelecionado.push(0);
    curvaSelecionada++;
    mensagem.innerText = "clique na tela para adicionar pontos de controle"
  }else{
    mensagem.innerText = "não é possivel adicionar uma nova curva antes de finalizar a atual"
  }
});
rmvCurva.addEventListener("click", function(event){
  if(curvas.length > 0) {
    curvas.splice(curvaSelecionada, 1);
    pontoSelecionado.splice(curvaSelecionada, 1);
    if(curvaSelecionada > 0){
      curvaSelecionada--;
    };
  }
  redesenhar();
});
curvaAnterior.addEventListener("click", function(event){
  if(curvaSelecionada > 0){
    curvaSelecionada--;
  }
  redesenhar();
});
curvaPosterior.addEventListener("click", function(event){
  if(curvaSelecionada < curvas.length - 2){
    curvaSelecionada++;
  }
  redesenhar();
});
//pontos
adcPonto.addEventListener("click", function(event){
  estadoCanvas = 1;
  mensagem.innerText = "clique na tela para adicionar pontos de controle";
});
pontoAnterior.addEventListener("click", function(event){
  if(pontoSelecionado[curvaSelecionada] > 0){
    pontoSelecionado[curvaSelecionada]--;
    redraw();
  }else redraw();
});
pontoPosterior.addEventListener("click", function(event){
  if(pontoSelecionado[curvaSelecionada] < pontoSelecionado[curvaSelecionada].lenght - 1){
    pontoSelecionado[curvaSelecionada]++;
    redraw();
  }else redraw();
});
//toggles
togglePontos.addEventListener("click", function(event){
  pontosAparentes = !pontosAparentes;
  redesenhar();
});
togglePoligonais.addEventListener("click", function(event){
  poligonaisAparentes = !poligonaisAparentes;
  redesenhar();
});
toggleCurvas.addEventListener("click", function(event){
  curvasAparentes = !curvasAparentes;
  redesenhar();
});
avaliacoes.addEventListener("keyup", function(event){
  var entrada = event.target.value;
  numAvaliacoes = parseInt(entrada);
  redesenhar();
})