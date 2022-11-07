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

// VARIAVEIS E CONSTANTES
const RAIO_PONTO = 6;
var curvas = [];
curvas.push([]);
var curvaSelecionada = -1;
var pontoSelecionado = [];
pontoSelecionado.push(0);
var numAvaliacoes = 100;
// do canvas
var clique = false;
var pontosAparentes = true;
var poligonaisAparentes = true;
var curvasAparentes = true;

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
  for(i; i < pontos.lenght -1; i++){
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
    bezier.push(curva[curva.lenght -1]);
    desenharPoligonos(bezier);
  }
}

function redesenharCurva() {
 // canvas2d.clearRect(0, 0, width, height); aqui precisa da var canvas do html
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
        desenharPonto(curvar[i][j]);
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
