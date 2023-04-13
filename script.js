var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
  
var snake = {
  x: 160,
  y: 160,
  
  // verschiebt jedes Bild um eine Gitterlänge in x- oder y-Richtung
  dx: grid,
  dy: 0,
  
  // alle Raster, die der Schlangenkörper belegt, im Auge behalten
  cells: [],
  
  // Länge der Schlange. wächst beim Essen eines Apfels
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// zufällige ganze Zahlen in einem bestimmten Bereich ermitteln
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  requestAnimationFrame(loop);

  // Verlangsamung des loops auf 15 statt 60 fps (60/15 = 4)
  if (++count < 8) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // Schlange durch ihre Geschwindigkeit bewegen
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Schlange horizontal am Rand des Bildschirms positionieren
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // Schlange vertikal am Rand des Bildschirms positionieren
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // Verfolgen, wo die Schlange war. Der vordere Teil des Feldes ist immer der Kopf
  snake.cells.unshift({x: snake.x, y: snake.y});

  // Zellen entfernen, wenn wir uns von ihnen entfernen
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Zeichne Apfel
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // Zeichne Schlange 1 Feld 
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    
    // Das Zeichnen 1 px kleiner als das Raster erzeugt einen Rastereffekt im Schlangenkörper
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    // schlange ist Apfel
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // 400x400 was 25x25 ist
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Kollision mit allen nachfolgenden Zellen prüfen 
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // Schlange nimmt denselben Platz ein wie ein Körperteil beim Spiel zurücksetzen
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}

// auf Tastaturereignisse hören, um die Schlange zu bewegen
document.addEventListener('keydown', function(e) {
  // verhindern, dass die Schlange sich selbst zurückverfolgt, indem sie überprüft, ob sie 
  // nicht bereits auf der gleichen Achse bewegt (links drücken, während man sich
  // während man sich nach links bewegt, wird nichts bewirken, und wenn man nach rechts drückt, während man sich nach links bewegt
  // sollte du dich nicht mit deinem eigenen Körper kollidieren lassen)
  
  // linke Pfeiltaste
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // Pfeiltaste nach oben
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // rechte Pfeiltaste
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // Pfeiltaste nach unten
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// starte das Spiel
requestAnimationFrame(loop);