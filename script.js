var canvas = document.getElementById('canvas_bezier')

canvas.width = document.getElementById('canvas_bezier_container').scrollWidth
canvas.height =
  document.getElementById('canvas_bezier_container').scrollHeight -
  0.042 * window.innerHeight

var context = canvas.getContext('2d')
var rect = canvas.getBoundingClientRect()
var pontos = []
var curvas = [pontos]
var avaliacoesCurva = 200
var quant = 0
var pontosControle = 1
var poligonaisControle = 1
var exibirCurva = 1
var moverSelecionado = false
var noCirculo = false

//------------------ CONTROLES -------------------
/**
 * Inicia o processo de gerar uma nova curva
 */
function novaCurva() {
  if (curvas[quant].length != 0) {
    pontos = []
    quant = curvas.length
    gerarCurva()
  }
}

/**
 * Apaga a curva em foco
 */
function deletarCurva() {
  curvas.splice(quant, 1)
  quant = curvas.length - 1
  if (quant == -1) {
    quant = 0
    pontos = []
  } else {
    pontos = curvas[quant]
  }
  gerarCurva()
}

/**
 * Alterna entre as curvas - curva anterior
 */
function curvaAnterior() {
  if (quant > 0) {
    quant--
    pontos = curvas[quant]
    gerarCurva()
  }
}

/**
 * Alterna entre as curvas - próxima curva
 */
function proximaCurva() {
  if (quant < curvas.length - 1) {
    quant++
    pontos = curvas[quant]
    gerarCurva()
  }
}

/**
 * Muda a avaliação
 */
function mudarAvaliacao() {
  avaliacoesCurva = document.getElementById('avaliacoesCurva').value
  gerarCurva()
}

/**
 * Permite a seleção de um ponto para alterar sua posição
 */
function moverPonto() {
  document.getElementById('moverPontoButton').classList.toggle('active')
  moverSelecionado = true
}

/**
 * alterna entre visualizar ou não os pontos de controle
 */
function alternarPontosControle(evt) {
  document.getElementById('pontosControleButton').classList.toggle('active')
  pontosControle = !pontosControle
  gerarCurva()
}

/**
 * Altera entre visualizar ou não os poligonais de controle
 */
function alternarPoligonaisControle() {
  document.getElementById('poligonaisControleButton').classList.toggle('active')
  poligonaisControle = !poligonaisControle
  gerarCurva()
}

/**
 *Alternar entre visualizar ou não as curvas
 */
function alternarExibicaoCurvas() {
  document.getElementById('exibicaoCurvasButton').classList.toggle('active')
  exibirCurva = !exibirCurva
  gerarCurva()
}

// Escuta o evento de clicar o mouse
canvas.addEventListener('mousedown', function (event) {
  if (event.which == 1 && !moverSelecionado) {
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    pontos.push({ x: x, y: y })
    curvas[quant] = pontos
    gerarCurva()
  } else if (event.which == 1 && moverSelecionado) {
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    let indice = estaNoCirculo({ x: x, y: y })
    if (noCirculo) {
      canvas.addEventListener(
        'mouseup',
        (onMouseUp = (event) => {
          canvas.removeEventListener('mouseup', onMouseUp)
          canvas.removeEventListener('mousemove', onMouseMove)
        })
      )
      canvas.addEventListener(
        'mousemove',
        (onMouseMove = (event) => {
          curvas[quant][indice].x =
            event.clientX - canvas.getBoundingClientRect().left
          curvas[quant][indice].y =
            event.clientY - canvas.getBoundingClientRect().top
          gerarCurva()
        })
      )
    }
    moverSelecionado = false
    document.getElementById('moverPontoButton').classList.toggle('active')
    noCirculo = false
  }
})

document.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  if (!moverSelecionado) {
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    excluirPonto(x, y)
  }
})

//------------ Funções de desenho ----------------
function gerarCurva() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (k = 0; k < curvas.length; k++) {
    if (k == quant) {
      if (pontosControle) {
        for (c = 0; c < curvas[k].length; c++) {
          mostrarPonto(curvas[k][c].x, curvas[k][c].y, 'rgba(28, 49, 89, 1)')
        }
      }
      if (poligonaisControle) {
        desenharReta(curvas[k], 'rgba(28, 49, 89, 1)', 1)
      }
      if (exibirCurva) {
        desenharCurva(curvas[k], 'rgba(28, 49, 89, 1)', 3)
      }
    } else {
      if (pontosControle) {
        for (c = 0; c < curvas[k].length; c++) {
          mostrarPonto(curvas[k][c].x, curvas[k][c].y, 'rgba(28, 49, 89, 0.25)')
        }
      }
      if (poligonaisControle) {
        desenharReta(curvas[k], 'rgba(28, 49, 89, 0.25)', 1)
      }
      if (exibirCurva) {
        desenharCurva(curvas[k], 'rgba(28, 49, 89, 0.25)', 1)
      }
    }
  }
}

function mostrarPonto(x, y, cor) {
  context.beginPath()
  context.arc(x, y, 10, 0, 2 * Math.PI, true)
  context.moveTo(x, y)
  context.strokeStyle = cor
  context.fillStyle = cor
  context.fill()
  context.stroke()
}

function desenharReta(pontos, cor, linha) {
  for (v = 0; v < pontos.length - 1; v++) {
    let x2 = pontos[v + 1].x
    let y2 = pontos[v + 1].y
    context.lineWidth = linha
    context.beginPath()
    context.moveTo(pontos[v].x, pontos[v].y)
    context.lineTo(x2, y2)
    context.strokeStyle = cor
    context.stroke()
  }
}

function desenharCurva(pontos, cor, linha) {
  let curva = []
  for (n = 0; n <= avaliacoesCurva; n++) {
    let ponto = deCasteljau(pontos, n)
    curva.push({ x: ponto.x, y: ponto.y })
  }
  desenharReta(curva, cor, linha)
}

function deCasteljau(pontos, n) {
  if (pontos.length > 1) {
    let aux = []
    let xX
    let yY
    for (i = 0; i < pontos.length - 1; i++) {
      xX =
        pontos[i].x * (1 - n / avaliacoesCurva) +
        pontos[i + 1].x * (n / avaliacoesCurva)
      yY =
        pontos[i].y * (1 - n / avaliacoesCurva) +
        pontos[i + 1].y * (n / avaliacoesCurva)
      aux.push({ x: xX, y: yY })
    }
    return deCasteljau(aux, n)
  } else {
    return pontos[0]
  }
}

function excluirPonto(posX, posY) {
  indice = estaNoCirculo({ x: posX, y: posY })
  if (indice > -1) {
    pontos.splice(indice, 1)
    gerarCurva()
  }
}

function estaNoCirculo(ponto) {
  for (f = 0; f < pontos.length; f++) {
    var v = { x: pontos[f].x - ponto.x, y: pontos[f].y - ponto.y }
    if (Math.sqrt(v.x * v.x + v.y * v.y) <= 10) {
      noCirculo = true
      return f
    }
  }
  return -1
}
