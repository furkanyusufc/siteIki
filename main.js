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

// Klavye takibi
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup',   e => keys[e.key] = false);

function update() {
  // Oyuncu hareketi
  if (keys['ArrowUp']   && player.y > 0)                      player.y -= player.speed;
  if (keys['ArrowDown'] && player.y < canvas.height - player.size) player.y += player.speed;

  // Engel oluşturma
  frameCount++;
  if (frameCount % 90 === 0) {
    const height = 50 + Math.random() * (canvas.height / 2);
    obstacles.push({
      x: canvas.width,
      y: 0,
      width: 30,
      height: height,
      speed: 4
    });
    // Alt kısmı kapatacak
    obstacles.push({
      x: canvas.width,
      y: height + 150,
      width: 30,
      height: canvas.height - height - 150,
      speed: 4
    });
  }

  // Engelleri güncelle ve çarpışma kontrolü
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.x -= o.speed;
    // Ekranın dışına çıkınca sil ve puan ekle
    if (o.x + o.width < 0) {
      obstacles.splice(i, 1);
      score += 0.5; // çift blok seti için 1 puan
    }
    // Çarpışma
    if (
      player.x < o.x + o.width &&
      player.x + player.size > o.x &&
      player.y < o.y + o.height &&
      player.y + player.size > o.y
    ) {
      // Oyun bitti
      alert(`Oyun bitti! Puanın: ${Math.floor(score)}`);
      // Yeniden başlat
      obstacles = [];
      score = 0;
      frameCount = 0;
      player.y = canvas.height / 2 - player.size/2;
      return;
    }
  }
}

function draw() {
  // Temizle
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Oyuncuyu çiz
  ctx.fillStyle = '#0f0';
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Engelleri çiz
  ctx.fillStyle = '#f00';
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });

  // Puan
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
