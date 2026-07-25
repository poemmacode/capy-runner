const Sprites = (() => {
  const PIXEL = 4;

  function drawPixelGrid(ctx, data, x, y, scale) {
    const ps = PIXEL;
    for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < data[r].length; c++) {
        const color = data[r][c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x + c * ps * scale, y + r * ps * scale, ps * scale, ps * scale);
        }
      }
    }
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function strokeStyle(ctx, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
  }

  function drawCapybara(ctx, x, y, scale, frame, jumping) {
    const s = scale || 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);

    const bob = jumping ? 0 : Math.sin(frame * 0.3) * 0.6;
    ctx.translate(0, bob);

    // Body
    ctx.fillStyle = '#8B5E3C';
    drawRoundedRect(ctx, 10, 8, 42, 30, 8);
    ctx.fill();
    strokeStyle(ctx, '#6B4226');
    drawRoundedRect(ctx, 10, 8, 42, 30, 8);
    ctx.stroke();

    // Belly
    ctx.fillStyle = '#C4956A';
    drawRoundedRect(ctx, 16, 20, 30, 16, 5);
    ctx.fill();

    // Head
    ctx.fillStyle = '#8B5E3C';
    drawRoundedRect(ctx, 48, 4, 20, 12, 5);
    ctx.fill();
    strokeStyle(ctx, '#6B4226');
    drawRoundedRect(ctx, 48, 4, 20, 12, 5);
    ctx.stroke();

    // Snout
    ctx.fillStyle = '#A0785C';
    drawRoundedRect(ctx, 60, 6, 14, 8, 3);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#2A1508';
    drawRoundedRect(ctx, 68, 6, 6, 4, 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#1A0E08';
    ctx.beginPath();
    ctx.arc(58, 7, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(59, 6, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#8B5E3C';
    ctx.beginPath();
    ctx.arc(50, 2, 3, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#D4956A';
    ctx.beginPath();
    ctx.arc(50, 2, 1.5, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#8B5E3C';
    ctx.beginPath();
    ctx.arc(62, 2, 3, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#D4956A';
    ctx.beginPath();
    ctx.arc(62, 2, 1.5, Math.PI, 0);
    ctx.fill();

    // Legs
    const legPhase = jumping ? 0 : Math.sin(frame * 0.4);
    const legOffset = legPhase * 2;

    ctx.fillStyle = '#6B4226';
    const legPositions = [
      [14 + legOffset, 36],
      [20 - legOffset, 36],
      [30 + legOffset, 36],
      [36 - legOffset, 36],
    ];
    for (const [lx, ly] of legPositions) {
      drawRoundedRect(ctx, lx, ly, 7, 7, 3);
      ctx.fill();
    }

    // Feet
    ctx.fillStyle = '#5A3620';
    for (const [lx, ly] of legPositions) {
      drawRoundedRect(ctx, lx - 1, ly + 5, 9, 3, 1);
      ctx.fill();
    }

    // Tail
    ctx.fillStyle = '#6B4226';
    ctx.beginPath();
    ctx.moveTo(10, 12);
    ctx.quadraticCurveTo(2, 6, 5, 16);
    ctx.quadraticCurveTo(3, 10, 10, 12);
    ctx.fill();

    ctx.restore();
  }

  function drawCrocodile(ctx, x, y, scale, frame) {
    const s = scale || 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);

    const mouthPhase = Math.sin(frame * 0.2) * 2;

    // Body
    ctx.fillStyle = '#2D7D2D';
    drawRoundedRect(ctx, 20, 10, 60, 18, 6);
    ctx.fill();
    strokeStyle(ctx, '#1B5C1B');
    drawRoundedRect(ctx, 20, 10, 60, 18, 6);
    ctx.stroke();

    // Belly
    ctx.fillStyle = '#9DD39D';
    drawRoundedRect(ctx, 24, 18, 52, 10, 4);
    ctx.fill();

    // Head / snout
    ctx.fillStyle = '#3A9A3A';
    drawRoundedRect(ctx, 66, 4, 40, 16, 6);
    ctx.fill();
    strokeStyle(ctx, '#1B5C1B');
    drawRoundedRect(ctx, 66, 4, 40, 16, 6);
    ctx.stroke();

    // Upper jaw
    ctx.fillStyle = '#3A9A3A';
    drawRoundedRect(ctx, 72, 4, 36, 8, 3);
    ctx.fill();

    // Lower jaw (animated)
    ctx.fillStyle = '#4AB84A';
    const jawY = 12 + mouthPhase;
    drawRoundedRect(ctx, 74, jawY, 30, 6, 2);
    ctx.fill();

    // Mouth interior
    ctx.fillStyle = '#CC3333';
    drawRoundedRect(ctx, 80, 12 + (mouthPhase > 0 ? mouthPhase * 0.5 : 0), 20, 3, 1);
    ctx.fill();

    // Teeth
    ctx.fillStyle = '#FFFFFF';
    for (let tx = 84; tx < 104; tx += 6) {
      ctx.fillRect(tx, 11, 3, 3);
    }
    for (let tx = 84; tx < 104; tx += 6) {
      ctx.fillRect(tx, 15 + mouthPhase, 3, 3);
    }

    // Eye
    ctx.fillStyle = '#1B5C1B';
    ctx.beginPath();
    ctx.arc(76, 6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(75, 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1A0E08';
    ctx.beginPath();
    ctx.arc(75, 5, 1, 0, Math.PI * 2);
    ctx.fill();

    // Eye bump
    ctx.fillStyle = '#2D7D2D';
    ctx.beginPath();
    ctx.arc(76, 3, 3, Math.PI, 0);
    ctx.fill();

    // Back bumps
    ctx.fillStyle = '#2D7D2D';
    const bumps = [28, 36, 44, 52];
    for (const bx of bumps) {
      ctx.beginPath();
      ctx.arc(bx, 9, 3, Math.PI, 0);
      ctx.fill();
    }

    // Legs
    ctx.fillStyle = '#1B5C1B';
    const legPhase = Math.sin(frame * 0.3);
    const crocLegs = [
      [24 + legPhase * 1.5, 26],
      [34 - legPhase * 1.5, 26],
      [54 + legPhase * 1.5, 26],
      [64 - legPhase * 1.5, 26],
    ];
    for (const [lx, ly] of crocLegs) {
      drawRoundedRect(ctx, lx, ly, 8, 8, 3);
      ctx.fill();
    }

    // Tail
    ctx.fillStyle = '#2D7D2D';
    ctx.beginPath();
    ctx.moveTo(22, 14);
    ctx.quadraticCurveTo(4, 4, 0, 18);
    ctx.quadraticCurveTo(8, 12, 22, 18);
    ctx.fill();

    ctx.restore();
  }

  // --- Small sprites (hearts, ruby, medal, cup) ---
  const R2 = '#E03030', R3 = '#FF4444', R4 = '#C02020';
  const heartData = [
    [0,R2,R2,0,R2,R2,0], [R3,R2,R3,R3,R2,R3,R2], [R3,R3,R3,R3,R3,R3,R2],
    [R3,R3,R3,R3,R3,R3,R2], [0,R3,R3,R3,R3,R3,0], [0,0,R4,R4,R4,0,0], [0,0,0,R4,0,0,0],
  ];
  const heartEmpty = [
    [0,'#555','#555',0,'#555','#555',0], ['#555','#444','#555','#555','#444','#555','#444'],
    ['#555','#555','#555','#555','#555','#555','#444'], ['#555','#555','#555','#555','#555','#555','#444'],
    [0,'#555','#555','#555','#555','#555',0], [0,0,'#444','#444','#444',0,0], [0,0,0,'#444',0,0,0],
  ];
  const DG = '#D4AF37', dg = '#B8960F', RB = '#E8E8E8', RD = '#CC0000', rD = '#AA0000';
  const rubyData = [
    [0,0,0,RD,RD,0,0,0], [0,0,RD,RB,RD,RD,0,0], [0,RD,RB,RB,RD,RD,RD,0],
    [RD,RB,RD,RD,RD,RD,RD,RD], [RD,RD,RD,RD,RD,RD,RD,rD], [0,RD,RD,RD,RD,RD,rD,0],
    [0,0,RD,RD,RD,rD,0,0], [0,0,0,rD,rD,0,0,0],
  ];
  const medalData = [
    [0,0,DG,DG,DG,DG,0,0], [0,DG,dg,dg,dg,dg,DG,0], [DG,dg,RB,RB,RB,dg,dg,DG],
    [DG,dg,RB,DG,DG,dg,dg,DG], [DG,dg,RB,DG,dg,dg,dg,DG], [DG,dg,RB,RB,dg,dg,dg,DG],
    [0,DG,dg,dg,dg,dg,DG,0], [0,0,DG,DG,DG,DG,0,0],
  ];
  const cupData = [
    [0,DG,DG,0,0,DG,DG,0], [0,DG,dg,DG,DG,dg,DG,0], [0,0,DG,dg,dg,DG,0,0],
    [0,0,DG,dg,dg,DG,0,0], [0,0,DG,dg,dg,DG,0,0], [0,0,0,DG,DG,0,0,0],
    [0,0,DG,DG,DG,DG,0,0], [0,DG,DG,DG,DG,DG,DG,0],
  ];

  function drawHeart(ctx, x, y, scale, filled) {
    drawPixelGrid(ctx, filled ? heartData : heartEmpty, x, y, scale);
  }
  function drawRuby(ctx, x, y, scale) { drawPixelGrid(ctx, rubyData, x, y, scale); }
  function drawMedal(ctx, x, y, scale) { drawPixelGrid(ctx, medalData, x, y, scale); }
  function drawCup(ctx, x, y, scale) { drawPixelGrid(ctx, cupData, x, y, scale); }

  function drawGround(ctx, x, y, width, height) {
    ctx.fillStyle = '#5A8C3C';
    ctx.fillRect(x, y, width, 4);
    ctx.fillStyle = '#3A6C1C';
    ctx.fillRect(x, y + 4, width, height - 4);
  }

  function drawGroundDetail(ctx, scrollX, canvasWidth, groundY) {
    ctx.fillStyle = '#6BA34A';
    for (let i = 0; i < canvasWidth + 40; i += 25) {
      const offset = (scrollX * 0.5) % 25;
      ctx.fillRect(i - offset, groundY - 2, 10, 2);
    }
    ctx.fillStyle = '#4A8C2C';
    for (let i = 0; i < canvasWidth + 40; i += 40) {
      const offset = (scrollX * 0.3) % 40;
      ctx.fillRect(i - offset + 12, groundY - 4, 5, 2);
    }
  }

  function getVictorySG() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Victory capybara: same capybara but with sunglasses and victory sign
    drawCapybara(ctx, 0, 0, 0.6, 0, false);

    // Sunglasses
    ctx.fillStyle = '#1A0E08';
    drawRoundedRect(ctx, 30, 6, 16, 6, 2);
    ctx.fill();
    drawRoundedRect(ctx, 52, 6, 16, 6, 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillRect(46, 8, 6, 2);

    // Sunglasses shine
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    drawRoundedRect(ctx, 32, 7, 6, 3, 1);
    ctx.fill();
    drawRoundedRect(ctx, 54, 7, 6, 3, 1);
    ctx.fill();

    // Victory sign (peace sign hand)
    ctx.fillStyle = '#8B5E3C';
    drawRoundedRect(ctx, 68, 16, 8, 12, 3);
    ctx.fill();
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(70, 16, 2, 12);
    ctx.fillRect(74, 16, 2, 12);

    // Cigarette
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(60, 24, 14, 3);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(58, 24, 3, 3);
    // Smoke
    ctx.fillStyle = 'rgba(200,200,200,0.5)';
    ctx.beginPath();
    ctx.arc(56, 22, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(52, 18, 4, 0, Math.PI * 2);
    ctx.fill();

    // "VICTORY" text
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 14px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VICTORY!', 100, 150);

    return canvas.toDataURL();
  }

  function getCapybaraBounds(x, y, scale) {
    const s = scale || 1;
    return { x: x + 15 * s, y: y + 10 * s, width: 50 * s, height: 30 * s };
  }

  function getCrocodileBounds(x, y, scale) {
    const s = scale || 1;
    return { x: x + 10 * s, y: y + 2 * s, width: 90 * s, height: 18 * s };
  }

  function getCapybaraSize(scale) {
    const s = scale || 1;
    return { width: 76 * s, height: 46 * s };
  }

  function getCrocodileSize(scale) {
    const s = scale || 1;
    return { width: 106 * s, height: 34 * s };
  }

  return {
    drawCapybara,
    drawCrocodile,
    drawHeart,
    drawRuby,
    drawMedal,
    drawCup,
    drawGround,
    drawGroundDetail,
    getVictorySG,
    getCapybaraBounds,
    getCrocodileBounds,
    getCapybaraSize,
    getCrocodileSize,
    PIXEL,
  };
})();
