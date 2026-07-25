const Game = (() => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  const CANVAS_W = 900;
  const CANVAS_H = 350;
  const GROUND_Y = 220;
  const GRAVITY = 0.5;
  const JUMP_FORCE = -9;
  const BASE_SPEED = 4;
  const CAPYBARA_X = 100;
  const CAPYBARA_SCALE = 0.30;
  const CROC_SCALE_MIN = 0.22;
  const CROC_SCALE_MAX = 0.35;
  const CROC_SPAWN_MIN = 100;
  const CROC_SPAWN_MAX = 220;
  const POINTS_PER_CROC = 10;
  const INVINCIBLE_FRAMES = 90;

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  const capySize = { width: 500 * CAPYBARA_SCALE, height: 280 * CAPYBARA_SCALE };

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
  let cloudX = [];

  for (let i = 0; i < 5; i++) {
    cloudX.push({
      x: Math.random() * CANVAS_W,
      y: 20 + Math.random() * 60,
      speed: 0.3 + Math.random() * 0.5,
      size: 18 + Math.random() * 22
    });
  }

  function resetGame() {
    score = 0;
    lives = 3;
    speed = BASE_SPEED;
    scrollX = 0;
    frame = 0;
    capybaraY = GROUND_Y - capySize.height;
    capybaraVelY = 0;
    isJumping = false;
    crocodiles = [];
    spawnTimer = 0;
    nextCrocSpawn = CROC_SPAWN_MIN;
    invincibleTimer = 0;
    difficultyTimer = 0;
    Rewards.reset();
    updateHUD();
  }

  function jump() {
    if (!isJumping && state === 'playing') {
      capybaraVelY = JUMP_FORCE;
      isJumping = true;
      Sounds.playJump();
    }
  }

  function spawnCrocodile() {
    const scale = CROC_SCALE_MIN + Math.random() * (CROC_SCALE_MAX - CROC_SCALE_MIN);
    const size = Sprites.getCrocodileSize(scale);
    crocodiles.push({
      x: CANVAS_W + 20,
      y: GROUND_Y - size.height,
      scale: scale,
      frame: 0,
      counted: false,
    });
  }

  function update() {
    if (state !== 'playing') return;

    frame++;

    capybaraVelY += GRAVITY;
    capybaraY += capybaraVelY;

    if (capybaraY + capySize.height >= GROUND_Y) {
      capybaraY = GROUND_Y - capySize.height;
      capybaraVelY = 0;
      isJumping = false;
    }

    scrollX += speed;
    difficultyTimer++;

    if (difficultyTimer % 400 === 0 && speed < 10) {
      speed += 0.25;
    }

    spawnTimer++;
    if (spawnTimer >= nextCrocSpawn) {
      spawnCrocodile();
      spawnTimer = 0;
      const minGap = Math.max(60, CROC_SPAWN_MIN - Math.floor(speed * 4));
      const maxGap = Math.max(90, CROC_SPAWN_MAX - Math.floor(speed * 6));
      nextCrocSpawn = minGap + Math.random() * (maxGap - minGap);
    }

    for (let i = crocodiles.length - 1; i >= 0; i--) {
      const croc = crocodiles[i];
      croc.x -= speed;
      croc.frame++;

      if (!croc.counted && croc.x + Sprites.getCrocodileSize(croc.scale).width < CAPYBARA_X) {
        croc.counted = true;
        score += POINTS_PER_CROC;
        const events = Rewards.addScore(POINTS_PER_CROC);
        processEvents(events);
      }

      if (croc.x < -200) {
        crocodiles.splice(i, 1);
        continue;
      }

      if (invincibleTimer <= 0) {
        const capB = Sprites.getCapybaraBounds(CAPYBARA_X, capybaraY, CAPYBARA_SCALE);
        const crocB = Sprites.getCrocodileBounds(croc.x, croc.y, croc.scale);

        if (capB.x < crocB.x + crocB.width &&
            capB.x + capB.width > crocB.x &&
            capB.y < crocB.y + crocB.height &&
            capB.y + capB.height > crocB.y) {
          lives--;
          invincibleTimer = INVINCIBLE_FRAMES;
          Sounds.playHit();
          updateHUD();

          if (lives <= 0) {
            state = 'gameover';
            Sounds.stopBackground();
            showGameOver();
            return;
          }
        }
      }
    }

    if (invincibleTimer > 0) invincibleTimer--;

    for (const cloud of cloudX) {
      cloud.x -= cloud.speed;
      if (cloud.x < -cloud.size * 2) {
        cloud.x = CANVAS_W + cloud.size;
        cloud.y = 20 + Math.random() * 60;
      }
    }

    updateHUD();
  }

  function processEvents(events) {
    for (const event of events) {
      switch (event) {
        case 'ruby': Sounds.playRuby(); showRewardPopup('RUBY!'); break;
        case 'medal': Sounds.playMedal(); showRewardPopup('MEDAL!'); break;
        case 'cup': Sounds.playCup(); showRewardPopup('CUP!'); break;
        case 'victory':
          state = 'victory';
          Sounds.stopBackground();
          setTimeout(() => { Sounds.playEpicWin(); showVictory(); }, 500);
          break;
      }
    }
  }

  function showRewardPopup(text) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.cssText = `
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Press Start 2P', monospace;
      font-size: 18px; color: #FFD700;
      text-shadow: 2px 2px 0 #000;
      z-index: 15; pointer-events: none;
      animation: popupAnim 1s forwards;
    `;
    document.getElementById('game-container').appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  function drawCloud(x, y, size) {
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#87CEEB');
    grad.addColorStop(0.5, '#B0E0E6');
    grad.addColorStop(1, '#90EE90');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    for (const cloud of cloudX) drawCloud(cloud.x, cloud.y, cloud.size);
  }

  function drawGround() {
    ctx.fillStyle = '#5A7C3C';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

    Sprites.drawGroundDetail(ctx, scrollX, CANVAS_W, GROUND_Y);

    ctx.fillStyle = '#3A5C1C';
    ctx.fillRect(0, GROUND_Y + 2, CANVAS_W, 4);
  }

  function drawEntities() {
    if (state === 'playing' || state === 'gameover' || state === 'victory') {
      if (invincibleTimer > 0 && Math.floor(invincibleTimer / 4) % 2 === 0) {
        ctx.globalAlpha = 0.35;
      }
      Sprites.drawCapybara(ctx, CAPYBARA_X, capybaraY, CAPYBARA_SCALE, frame, isJumping);
      ctx.globalAlpha = 1;
    }

    for (const croc of crocodiles) {
      Sprites.drawCrocodile(ctx, croc.x, croc.y, croc.scale, croc.frame);
    }
  }

  function drawStartScreen() {
    const cx = CANVAS_W / 2;
    const cy = GROUND_Y - capySize.height;
    Sprites.drawCapybara(ctx, cx - capySize.width / 2, cy, CAPYBARA_SCALE, frame, false);
  }

  function draw() {
    drawBackground();
    drawGround();
    drawEntities();
    if (state === 'start') drawStartScreen();
  }

  function updateHUD() {
    const display = Rewards.getDisplay();

    const livesEl = document.getElementById('lives');
    livesEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const c = document.createElement('canvas');
      c.width = 28;
      c.height = 28;
      Sprites.drawHeart(c.getContext('2d'), 0, 0, 1, i < lives);
      livesEl.appendChild(c);
    }

    document.getElementById('score-display').textContent = `SCORE: ${display.score}`;

    const bar = document.getElementById('rewards-bar');
    bar.innerHTML = '';

    if (display.cups > 0) {
      const div = document.createElement('div');
      div.className = 'reward-item';
      const c = document.createElement('canvas');
      c.width = 32; c.height = 32;
      Sprites.drawCup(c.getContext('2d'), 0, 0, 1);
      div.appendChild(c);
      const s = document.createElement('span');
      s.className = 'reward-count';
      s.textContent = `x${display.cups}`;
      div.appendChild(s);
      bar.appendChild(div);
    }

    if (display.medals > 0) {
      const div = document.createElement('div');
      div.className = 'reward-item';
      const c = document.createElement('canvas');
      c.width = 32; c.height = 32;
      Sprites.drawMedal(c.getContext('2d'), 0, 0, 1);
      div.appendChild(c);
      const s = document.createElement('span');
      s.className = 'reward-count';
      s.textContent = `x${display.medals}`;
      div.appendChild(s);
      bar.appendChild(div);
    }

    if (display.rubies > 0) {
      const div = document.createElement('div');
      div.className = 'reward-item';
      const c = document.createElement('canvas');
      c.width = 32; c.height = 32;
      Sprites.drawRuby(c.getContext('2d'), 0, 0, 1);
      div.appendChild(c);
      const s = document.createElement('span');
      s.className = 'reward-count';
      s.textContent = `x${display.rubies}`;
      div.appendChild(s);
      bar.appendChild(div);
    }
  }

  function showGameOver() {
    const display = Rewards.getDisplay();
    const el = document.getElementById('gameover-screen');
    el.classList.remove('hidden');
    el.querySelector('.final-score').textContent = `SCORE: ${display.score}`;
    el.querySelector('.final-rewards').innerHTML =
      [display.cups > 0 ? `CUPS: ${display.cups}` : '',
       display.medals > 0 ? `MEDALS: ${display.medals}` : '',
       display.rubies > 0 ? `RUBIES: ${display.rubies}` : ''].filter(Boolean).join(' | ') || 'NO REWARDS';
  }

  function showVictory() {
    const display = Rewards.getDisplay();
    const el = document.getElementById('victory-screen');
    el.classList.remove('hidden');
    el.querySelector('.final-score').textContent = `FINAL SCORE: ${display.score}`;
    el.querySelector('.victory-svg').innerHTML = Sprites.getVictorySVG();
  }

  function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('victory-screen').classList.add('hidden');
    resetGame();
    state = 'playing';
    Sounds.startBackground();
  }

  function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  function setupInput() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (state === 'start' || state === 'gameover' || state === 'victory') startGame();
        else if (state === 'playing') jump();
      }
    });

    canvas.addEventListener('click', () => {
      if (state === 'start' || state === 'gameover' || state === 'victory') startGame();
      else if (state === 'playing') jump();
    });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (state === 'start' || state === 'gameover' || state === 'victory') startGame();
      else if (state === 'playing') jump();
    });
  }

  function init() {
    setupInput();
    updateHUD();
    Sprites.init();

    gameLoop();
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
