/** Referência para o canvas. */
var canvas = document.getElementById('c');

/**
 * Referência para o contexto do canvas, onde as formas são desenhadas.
 * Importante: Lembre-se que no HTML5/Canvas 2D, a origem é o canto superior esquerdo,
 * com x crescendo para a direita e y crescendo para baixo.
 */
var context = canvas.getContext('2d');

/** Conjunto de pontos (coordenadas x e y) que formam um quadrado. */
var square = [[5, 5], [5, 205], [205, 205], [205, 5]];

/** Ponto de ancoramento para rotação do quadrado. */
var squareAnchor = [205, 5];

/** Conjunto de pontos (coordenadas x e y) que formam um pentagrama simplificado. */
var star = [[335, 350], [400, 150], [465, 350], [300, 220], [500, 220]];

/** Ponto de ancoramento para rotação do pentagrama. */
var starAnchor = [400, 250];

/** A taxa de quadros por segundo a ser buscada nas animações. */
var fps = 30;

/** A "velocidade" angular (isto é, o ângulo a ser movido a cada quadro) para a animação de rotação. */
var angleStep = Math.PI / 32;

// Inicia a animação
window.requestAnimationFrame(renderLoop);

/**
 * Desenha (isto é, renderiza no canvas) uma forma definida pelo conjunto de pontos
 * dados. Os pontos são conectados na ordem (o primeiro ao segundo, o segundo ao
 * terceiro, e assim por diante) e a forma é "fechada" - isto é, o último ponto é
 * conectado ao primeiro ponto automaticamente.
 * @param {array} points Array bidimensional contendo arrays de inteiros com as coordenadas
 * x e y de cada ponto da forma a ser renderizada.
 */
function drawShape(points) {
    context.beginPath();
    var point = points[0];
    var x = point[0];
    var y = point[1];
    context.moveTo(x, y);
    for (point of points) {
        x = point[0];
        y = point[1];
        context.lineTo(x, y);
    }
    point = points[0];
    x = point[0];
    y = point[1];
    context.lineTo(x, y);
    context.stroke();
}

/**
 * Translada a forma dada pelos delta em x e em y dados.
 * @param {array} points Array bidimensional contendo arrays de inteiros com as coordenadas
 * x e y de cada ponto da forma a ser rotacionada.
 * @param {int} dx Delta X para translação (isto é, o valor positivo ou negativo pelo qual deverá ser
 * feita a translação no eixo x).
 * @param {int} dy Delta Y para translação (isto é, o valor positivo ou negativo pelo qual deverá ser
 * feita a translação no eixo y).
 */
function translateShape(points, dx, dy) {
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var x = point[0];
        var y = point[1];
        var u = x + dx;
        var v = y + dy;
        points[i] = [u, v];
    }
}

/**
 * Rotaciona a forma dada pelo ângulo dado (em sentido anti-horário), recalculando todos os seus pontos
 * de acordo com a nova rotação definida pelo ângulo dado.
 * @param {array} points Array bidimensional contendo arrays de inteiros com as coordenadas
 * x e y de cada ponto da forma a ser rotacionada.
 * @param {float} angle Ângulo em radianos para realizar a rotação da forma, no sentido anti-horário.
 */
function rotateShape(points, angle, anchor) {
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    translateShape(points, -anchor[0], -anchor[1]);
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var x = point[0];
        var y = point[1];
        var u = x * cos + y * sin;
        var v = -x * sin + y * cos;
        points[i] = [u, v];
    }
    translateShape(points, anchor[0], anchor[1]);
}

/**
 * Executa o loop de renderização das animações.
 */
function renderLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    rotateShape(square, angleStep, squareAnchor);
    drawShape(square);

    rotateShape(star, -angleStep / 4, starAnchor);
    drawShape(star);
    setTimeout(() => window.requestAnimationFrame(renderLoop), 1000 / fps);
}
