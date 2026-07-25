const Game = (() => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  const CANVAS_W = 900;
  const CANVAS_H = 300;
  const GROUND_Y = 240;
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const BASE_SPEED = 5;
  const CAPYBARA_X = 80;
  const CROC_SPAWN_MIN = 90;
  const CROC_SPAWN_MAX = 200;
  const POINTS_PER_CROC = 10;
  const INVINCIBLE_FRAMES = 90;

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  let state = 'start';
  let score = 0;
  let lives = 3;
  let speed = BASE_SPEED;
  let scrollX = 0;
  let frame = 0;
  let animFrame = 0;
  let animTimer = 0;
  const capybaraSize = Sprites.getCapybaraSize(1);
  let capybaraY = GROUND_Y - capybaraSize.height;
  let capybaraVelY = 0;
  let isJumping = false;
  let crocodiles = [];
  let nextCrocSpawn = CROC_SPAWN_MIN;
  let spawnTimer = 0;
  let invincibleTimer = 0;
  let difficultyTimer = 0;
  let cloudX = [];

  for (let i = 0; i < 5; i++) {
    cloudX.push({
      x: Math.random() * CANVAS_W,
      y: 20 + Math.random() * 60,
      speed: 0.3 + Math.random() * 0.5,
      size: 15 + Math.random() * 20
    });
  }

  function resetGame() {
    score = 0;
    lives = 3;
    speed = BASE_SPEED;
    scrollX = 0;
    frame = 0;
    animFrame = 0;
    animTimer = 0;
    capybaraY = GROUND_Y - capybaraSize.height;
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
    const scale = 0.7 + Math.random() * 0.4;
    const crocSize = Sprites.getCrocodileSize(scale);
    crocodiles.push({
      x: CANVAS_W + 20,
      y: GROUND_Y - crocSize.height,
      scale: scale,
      frame: 0,
      frameTimer: 0,
      counted: false,
    });
  }

  function update() {
    if (state !== 'playing') return;

    frame++;
    animTimer++;
    if (animTimer > 8) {
      animTimer = 0;
      animFrame++;
    }

    capybaraVelY += GRAVITY;
    capybaraY += capybaraVelY;

    if (capybaraY >= GROUND_Y - capybaraSize.height) {
      capybaraY = GROUND_Y - capybaraSize.height;
      capybaraVelY = 0;
      isJumping = false;
    }

    scrollX += speed;
    difficultyTimer++;

    if (difficultyTimer % 300 === 0 && speed < 12) {
      speed += 0.3;
    }

    spawnTimer++;
    if (spawnTimer >= nextCrocSpawn) {
      spawnCrocodile();
      spawnTimer = 0;
      const minGap = Math.max(50, CROC_SPAWN_MIN - Math.floor(speed * 3));
      const maxGap = Math.max(80, CROC_SPAWN_MAX - Math.floor(speed * 5));
      nextCrocSpawn = minGap + Math.random() * (maxGap - minGap);
    }

    for (let i = crocodiles.length - 1; i >= 0; i--) {
      const croc = crocodiles[i];
      croc.x -= speed;
      croc.frameTimer++;
      if (croc.frameTimer > 12) {
        croc.frameTimer = 0;
        croc.frame++;
      }

      if (!croc.counted && croc.x + Sprites.getCrocodileSize(croc.scale).width < CAPYBARA_X) {
        croc.counted = true;
        score += POINTS_PER_CROC;
        const events = Rewards.addScore(POINTS_PER_CROC);
        processEvents(events);
      }

      if (croc.x < -100) {
        crocodiles.splice(i, 1);
        continue;
      }

      if (invincibleTimer <= 0) {
        const capB = Sprites.getCapybaraBounds(CAPYBARA_X, capybaraY, 1);
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
        case 'ruby':
          Sounds.playRuby();
          showRewardPopup('RUBY!');
          break;
        case 'medal':
          Sounds.playMedal();
          showRewardPopup('MEDAL!');
          break;
        case 'cup':
          Sounds.playCup();
          showRewardPopup('CUP!');
          break;
        case 'victory':
          state = 'victory';
          Sounds.stopBackground();
          setTimeout(() => {
            Sounds.playEpicWin();
            showVictory();
          }, 500);
          break;
      }
    }
  }

  function showRewardPopup(text) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Press Start 2P', monospace;
      font-size: 18px;
      color: #FFD700;
      text-shadow: 2px 2px 0 #000;
      z-index: 15;
      pointer-events: none;
      animation: popupAnim 1s forwards;
    `;
    document.getElementById('game-container').appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  function drawCloud(x, y, size) {
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.6, '#B0E0E6');
    gradient.addColorStop(1, '#90EE90');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    for (const cloud of cloudX) {
      drawCloud(cloud.x, cloud.y, cloud.size);
    }

    ctx.fillStyle = '#3A5C1C';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

    Sprites.drawGroundDetail(ctx, scrollX, CANVAS_W, GROUND_Y);

    ctx.fillStyle = '#2A4C0C';
    ctx.fillRect(0, GROUND_Y + 2, CANVAS_W, 4);

    if (state === 'playing' || state === 'gameover' || state === 'victory') {
      if (invincibleTimer > 0 && Math.floor(invincibleTimer / 4) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }
      Sprites.drawCapybara(ctx, CAPYBARA_X, capybaraY, 1, animFrame, isJumping);
      ctx.globalAlpha = 1;
    }

    for (const croc of crocodiles) {
      Sprites.drawCrocodile(ctx, croc.x, croc.y, croc.scale, croc.frame);
    }

    if (state === 'start') {
      const startSize = Sprites.getCapybaraSize(1.5);
      Sprites.drawCapybara(ctx, CANVAS_W / 2 - startSize.width / 2, GROUND_Y - startSize.height, 1.5, animFrame, false);
    }
  }

  function updateHUD() {
    const display = Rewards.getDisplay();

    const livesEl = document.getElementById('lives');
    livesEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const c = document.createElement('canvas');
      c.width = 28;
      c.height = 28;
      const cctx = c.getContext('2d');
      Sprites.drawHeart(cctx, 0, 0, 1, i < lives);
      livesEl.appendChild(c);
    }

    document.getElementById('score-display').textContent = `SCORE: ${display.score}`;

    const rewardsBar = document.getElementById('rewards-bar');
    rewardsBar.innerHTML = '';

    if (display.cups > 0) {
      const item = document.createElement('div');
      item.className = 'reward-item';
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      Sprites.drawCup(c.getContext('2d'), 0, 0, 1);
      item.appendChild(c);
      const span = document.createElement('span');
      span.className = 'reward-count';
      span.textContent = `x${display.cups}`;
      item.appendChild(span);
      rewardsBar.appendChild(item);
    }

    if (display.medals > 0) {
      const item = document.createElement('div');
      item.className = 'reward-item';
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      Sprites.drawMedal(c.getContext('2d'), 0, 0, 1);
      item.appendChild(c);
      const span = document.createElement('span');
      span.className = 'reward-count';
      span.textContent = `x${display.medals}`;
      item.appendChild(span);
      rewardsBar.appendChild(item);
    }

    if (display.rubies > 0) {
      const item = document.createElement('div');
      item.className = 'reward-item';
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      Sprites.drawRuby(c.getContext('2d'), 0, 0, 1);
      item.appendChild(c);
      const span = document.createElement('span');
      span.className = 'reward-count';
      span.textContent = `x${display.rubies}`;
      item.appendChild(span);
      rewardsBar.appendChild(item);
    }
  }

  function showGameOver() {
    const display = Rewards.getDisplay();
    const el = document.getElementById('gameover-screen');
    el.classList.remove('hidden');
    el.querySelector('.final-score').textContent = `SCORE: ${display.score}`;
    el.querySelector('.final-rewards').innerHTML = [
      display.cups > 0 ? `CUPS: ${display.cups}` : '',
      display.medals > 0 ? `MEDALS: ${display.medals}` : '',
      display.rubies > 0 ? `RUBIES: ${display.rubies}` : '',
    ].filter(Boolean).join(' | ') || 'NO REWARDS';
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

  function init() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (state === 'start' || state === 'gameover' || state === 'victory') {
          startGame();
        } else if (state === 'playing') {
          jump();
        }
      }
    });

    canvas.addEventListener('click', () => {
      if (state === 'start' || state === 'gameover' || state === 'victory') {
        startGame();
      } else if (state === 'playing') {
        jump();
      }
    });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (state === 'start' || state === 'gameover' || state === 'victory') {
        startGame();
      } else if (state === 'playing') {
        jump();
      }
    });

    updateHUD();
    gameLoop();
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
