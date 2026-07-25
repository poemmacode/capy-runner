const Game = (() => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('game-container');

  const VIRT_W = 900;
  const VIRT_H = 350;
  const GROUND_Y = 260;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;
  const BASE_SPEED = 4.5;
  const CAPYBARA_X = 100;
  const CAPYBARA_SCALE = 0.9;
  const CROC_SCALE_MIN = 0.55;
  const CROC_SCALE_MAX = 0.75;
  const CROC_SPAWN_MIN = 100;
  const CROC_SPAWN_MAX = 220;
  const POINTS_PER_CROC = 15;
  const INVINCIBLE_FRAMES = 90;

  canvas.width = VIRT_W;
  canvas.height = VIRT_H;

  const capySize = { width: 76 * CAPYBARA_SCALE, height: 46 * CAPYBARA_SCALE };

  let state = 'start';
  let score = 0;
  let lives = 3;
  let speed = BASE_SPEED;
  let scrollX = 0;
  let frame = 0;
  let capybaraY = GROUND_Y - capySize.height;
  let capybaraVelY = 0;
  let isJumping = false;
  let crocodiles = [];
  let spawnTimer = 0;
  let nextCrocSpawn = CROC_SPAWN_MIN;
  let invincibleTimer = 0;
  let difficultyTimer = 0;
  let clouds = [];
  let isTouchDevice = false;

  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: Math.random() * VIRT_W, y: 20 + Math.random() * 60,
      speed: 0.3 + Math.random() * 0.5, size: 18 + Math.random() * 22
    });
  }

  function resizeCanvas() {
    const maxW = window.innerWidth - 20;
    const maxH = window.innerHeight - 20;
    const scale = Math.min(maxW / VIRT_W, maxH / VIRT_H, 1.2);
    canvas.style.width = (VIRT_W * scale) + 'px';
    canvas.style.height = (VIRT_H * scale) + 'px';
  }

  function resetGame() {
    score = 0; lives = 3; speed = BASE_SPEED; scrollX = 0; frame = 0;
    capybaraY = GROUND_Y - capySize.height; capybaraVelY = 0; isJumping = false;
    crocodiles = []; spawnTimer = 0; nextCrocSpawn = CROC_SPAWN_MIN;
    invincibleTimer = 0; difficultyTimer = 0;
    Rewards.reset(); updateHUD();
  }

  function jump() {
    if (!isJumping && state === 'playing') {
      capybaraVelY = JUMP_FORCE; isJumping = true; Sounds.playJump();
    }
  }

  function spawnCrocodile() {
    const scale = CROC_SCALE_MIN + Math.random() * (CROC_SCALE_MAX - CROC_SCALE_MIN);
    const size = Sprites.getCrocodileSize(scale);
    crocodiles.push({
      x: VIRT_W + 20, y: GROUND_Y - size.height,
      scale, frame: 0, counted: false,
    });
  }

  function update() {
    if (state !== 'playing') return;
    frame++;

    capybaraVelY += GRAVITY; capybaraY += capybaraVelY;
    if (capybaraY + capySize.height >= GROUND_Y) {
      capybaraY = GROUND_Y - capySize.height;
      capybaraVelY = 0; isJumping = false;
    }

    scrollX += speed; difficultyTimer++;
    if (difficultyTimer % 500 === 0 && speed < 12) {
      speed += 0.2;
    }

    spawnTimer++;
    if (spawnTimer >= nextCrocSpawn) {
      spawnCrocodile(); spawnTimer = 0;
      const minGap = Math.max(60, CROC_SPAWN_MIN - Math.floor(speed * 4));
      const maxGap = Math.max(90, CROC_SPAWN_MAX - Math.floor(speed * 6));
      nextCrocSpawn = minGap + Math.random() * (maxGap - minGap);
    }

    for (let i = crocodiles.length - 1; i >= 0; i--) {
      const croc = crocodiles[i];
      croc.x -= speed; croc.frame++;

      if (!croc.counted && croc.x + Sprites.getCrocodileSize(croc.scale).width < CAPYBARA_X) {
        croc.counted = true;
        const events = Rewards.addScore(POINTS_PER_CROC);
        processEvents(events);
      }

      if (croc.x < -200) { crocodiles.splice(i, 1); continue; }

      if (invincibleTimer <= 0) {
        const capB = Sprites.getCapybaraBounds(CAPYBARA_X, capybaraY, CAPYBARA_SCALE);
        const crocB = Sprites.getCrocodileBounds(croc.x, croc.y, croc.scale);
        if (capB.x < crocB.x + crocB.width && capB.x + capB.width > crocB.x &&
            capB.y < crocB.y + crocB.height && capB.y + capB.height > crocB.y) {
          lives--; invincibleTimer = INVINCIBLE_FRAMES; Sounds.playHit(); updateHUD();
          if (lives <= 0) { state = 'gameover'; Sounds.stopBackground(); showGameOver(); return; }
        }
      }
    }

    if (invincibleTimer > 0) invincibleTimer--;

    for (const c of clouds) { c.x -= c.speed; if (c.x < -c.size * 2) { c.x = VIRT_W + c.size; c.y = 20 + Math.random() * 60; } }
    updateHUD();
  }

  function processEvents(events) {
    for (const e of events) {
      switch (e) {
        case 'ruby': Sounds.playRuby(); flashReward('RUBY!'); break;
        case 'medal': Sounds.playMedal(); flashReward('MEDAL!'); break;
        case 'cup': Sounds.playCup(); flashReward('CUP!'); break;
        case 'victory':
          state = 'victory'; Sounds.stopBackground();
          setTimeout(() => { Sounds.playEpicWin(); showVictory(); }, 500);
          break;
      }
    }
  }

  let rewardFlashes = [];

  function flashReward(text) {
    rewardFlashes.push({ text, timer: 60 });
  }

  function drawCloud(cx, cy, size) {
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
    ctx.arc(cx + size * 0.4, cy - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.arc(cx + size * 0.8, cy, size * 0.45, 0, Math.PI * 2);
    ctx.arc(cx + size * 0.4, cy + size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, VIRT_H);
    grad.addColorStop(0, '#87CEEB'); grad.addColorStop(0.5, '#B0E0E6'); grad.addColorStop(1, '#90EE90');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, VIRT_W, VIRT_H);

    for (const c of clouds) drawCloud(c.x, c.y, c.size);

    // Ground
    ctx.fillStyle = '#5A7C3C'; ctx.fillRect(0, GROUND_Y, VIRT_W, VIRT_H - GROUND_Y);
    Sprites.drawGroundDetail(ctx, scrollX, VIRT_W, GROUND_Y);
    ctx.fillStyle = '#3A5C1C'; ctx.fillRect(0, GROUND_Y, VIRT_W, 4);

    // Reward flashes
    for (let i = rewardFlashes.length - 1; i >= 0; i--) {
      const rf = rewardFlashes[i];
      const alpha = Math.min(1, rf.timer / 30);
      ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - alpha)})`;
      ctx.fillRect(VIRT_W / 2 - 80, VIRT_H / 2 - 20, 160, 40);
      ctx.fillStyle = '#FFD700';
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(rf.text, VIRT_W / 2, VIRT_H / 2 + 6);
      rf.timer--;
      if (rf.timer <= 0) rewardFlashes.splice(i, 1);
    }

    // Entities
    if (state === 'playing' || state === 'gameover' || state === 'victory') {
      if (invincibleTimer > 0 && Math.floor(invincibleTimer / 5) % 2 === 0) ctx.globalAlpha = 0.35;
      Sprites.drawCapybara(ctx, CAPYBARA_X, capybaraY, CAPYBARA_SCALE, frame, isJumping);
      ctx.globalAlpha = 1;
    }

    for (const croc of crocodiles) {
      Sprites.drawCrocodile(ctx, croc.x, croc.y, croc.scale, croc.frame);
    }

    if (state === 'start') {
      Sprites.drawCapybara(ctx, VIRT_W / 2 - 38, GROUND_Y - 50, 1.4, frame, false);
    }
  }

  function updateHUD() {
    const d = Rewards.getDisplay();
    const livesEl = document.getElementById('lives'); livesEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const c = document.createElement('canvas'); c.width = 28; c.height = 28;
      Sprites.drawHeart(c.getContext('2d'), 0, 0, 1, i < lives);
      livesEl.appendChild(c);
    }
    document.getElementById('score-display').textContent = `SCORE: ${d.score}`;
    const bar = document.getElementById('rewards-bar'); bar.innerHTML = '';
    if (d.cups > 0) { const el = mkRewardBar('Cup', d.cups); bar.appendChild(el); }
    if (d.medals > 0) { const el = mkRewardBar('Medal', d.medals); bar.appendChild(el); }
    if (d.rubies > 0) { const el = mkRewardBar('Ruby', d.rubies); bar.appendChild(el); }
  }

  function mkRewardBar(type, count) {
    const div = document.createElement('div'); div.className = 'reward-item';
    const c = document.createElement('canvas'); c.width = 32; c.height = 32;
    const fn = type === 'Cup' ? Sprites.drawCup : type === 'Medal' ? Sprites.drawMedal : Sprites.drawRuby;
    fn(c.getContext('2d'), 0, 0, 1); div.appendChild(c);
    const s = document.createElement('span'); s.className = 'reward-count'; s.textContent = `x${count}`; div.appendChild(s);
    return div;
  }

  function showGameOver() {
    const d = Rewards.getDisplay();
    document.getElementById('gameover-screen').classList.remove('hidden');
    document.querySelector('#gameover-screen .final-score').textContent = `SCORE: ${d.score}`;
    document.querySelector('#gameover-screen .final-rewards').innerHTML =
      [d.cups > 0 ? `CUP: ${d.cups}` : '', d.medals > 0 ? `MEDAL: ${d.medals}` : '',
       d.rubies > 0 ? `RUBY: ${d.rubies}` : ''].filter(Boolean).join(' | ') || 'NO REWARDS';
  }

  function showVictory() {
    const d = Rewards.getDisplay();
    const el = document.getElementById('victory-screen'); el.classList.remove('hidden');
    el.querySelector('.final-score').textContent = `FINAL SCORE: ${d.score}`;
    el.querySelector('.victory-svg').innerHTML = `<img src="${Sprites.getVictorySG()}" alt="Victory!" style="width:180px;image-rendering:pixelated"/>`;
  }

  function startGame() {
    ['start-screen', 'gameover-screen', 'victory-screen'].forEach(id =>
      document.getElementById(id).classList.add('hidden'));
    resetGame(); state = 'playing'; Sounds.startBackground();
  }

  function handleAction() {
    if (state === 'start' || state === 'gameover' || state === 'victory') startGame();
    else if (state === 'playing') jump();
  }

  function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }

  function init() {
    isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.getElementById('mobile-controls').classList.remove('hidden');
    }

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); handleAction(); }
    });
    canvas.addEventListener('click', handleAction);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleAction(); });

    document.getElementById('jump-btn').addEventListener('click', handleAction);
    document.getElementById('jump-btn').addEventListener('touchstart', (e) => { e.preventDefault(); handleAction(); });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    updateHUD();
    gameLoop();
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => { Game.init(); });
