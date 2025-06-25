const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Oyuncu
const player = {
  x: 50,
  y: canvas.height / 2 - 25,
  size: 50,
  speed: 6
};

// Engelleri tutan dizi
let obstacles = [];
let frameCount = 0;
let score = 0;

// Klavye ve mobil tuş takibi
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup',   e => keys[e.key] = false);

const keys = {};

// Buton elemanları
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');

// Touch / mouse events
downBtn.addEventListener('pointerdown', () => keys['ArrowDown'] = true);
downBtn.addEventListener('pointerup',   () => keys['ArrowDown'] = false);
downBtn.addEventListener('pointerleave',() => keys['ArrowDown'] = false);

upBtn.addEventListener('pointerdown', () => keys['ArrowUp'] = true);
upBtn.addEventListener('pointerup',   () => keys['ArrowUp'] = false);
upBtn.addEventListener('pointerleave',() => keys['ArrowUp'] = false);

function update() {
  // Oyuncu hareketi
  if (keys['ArrowUp']   && player.y > 0)                         player.y -= player.speed;
  if (keys['ArrowDown'] && player.y < canvas.height - player.size) player.y += player.speed;

  // Engel oluşturma
  frameCount++;
  if (frameCount % 90 === 0) {
    const height = 50 + Math.random() * (canvas.height / 2);
    obstacles.push({ x: canvas.width, y: 0, width: 30, height, speed: 4 });
    obstacles.push({ x: canvas.width, y: height + 150, width: 30, height: canvas.height - height - 150, speed: 4 });
  }

  // Engelleri güncelle ve çarpışma kontrolü
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.x -= o.speed;
    if (o.x + o.width < 0) {
      obstacles.splice(i, 1);
      score += 0.5;
    }
    if (
      player.x < o.x + o.width &&
      player.x + player.size > o.x &&
      player.y < o.y + o.height &&
      player.y + player.size > o.y
    ) {
      alert(`Oyun bitti! Puanın: ${Math.floor(score)}`);
      obstacles = [];
      score = 0;
      frameCount = 0;
      player.y = canvas.height / 2 - player.size/2;
      return;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.fillStyle = '#f00';
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
  ctx.fillStyle = '#fff';
  ctx.font = '24px sans-serif';
  ctx.fillText(`Puan: ${Math.floor(score)}`, 20, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();