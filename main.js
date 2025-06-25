const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Oyuncu
const player = {
  x: 50,
  y: canvas.height / 2 - 25,
  size: 50,
  speed: 8  // Hızı artırıldı
};

// Engelleri tutan dizi
let obstacles = [];
let frameCount = 0;
let score = 0;

// Klavye ve mobil tuş takibi
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup',   e => keys[e.key] = false);

const keys = {};

// Mobil buton elemanları
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

  // Engel oluşturma (akışı hızlandırmak için sıklık artırıldı)
  frameCount++;
  if (frameCount % 60 === 0) {  // Önce 90 idi, şimdi 60
    const height = 50 + Math.random() * (canvas.height / 2);
    const speed = 6 + Math.floor(score / 5);  // Zamanla hız artışı
    obstacles.push({ x: canvas.width, y: 0, width: 30, height, speed });
    obstacles.push({ x: canvas.width, y: height + 150, width: 30, height: canvas.height - height - 150, speed });
  }

  // Engelleri güncelle ve çarpışma kontrolü
  obstacles = obstacles.filter(o => {
    o.x -= o.speed;
    if (
      player.x < o.x + o.width &&
      player.x + player.size > o.x &&
      player.y < o.y + o.height &&
      player.y + player.size > o.y
    ) {
      alert(`Oyun bitti! Puanın: ${Math.floor(score)}`);
      // Oyun reset
      obstacles = [];
      score = 0;
      frameCount = 0;
      player.y = canvas.height / 2 - player.size/2;
      return false;
    }
    if (o.x + o.width < 0) {
      score += 0.5;
      return false;
    }
    return true;
  });
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