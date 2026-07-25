const Sprites = (() => {
  let capyCanvas = null;
  let crocCanvas = null;
  let loaded = false;
  let loadCallbacks = [];

  function onReady(cb) {
    if (loaded) cb();
    else loadCallbacks.push(cb);
  }

  function loadSVGText(path) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', path, true);
      req.onload = () => resolve(req.responseText);
      req.onerror = reject;
      req.send();
    });
  }

  function svgToDataUrl(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function svgToCanvas(svgText, w, h) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);
        resolve(c);
      };
      img.src = svgToDataUrl(svgText);
    });
  }

  async function init() {
    try {
      const capySVG = await loadSVGText('js/capy-clean.svg');
      const crocSVG = await loadSVGText('js/coco-clean.svg');
      capyCanvas = await svgToCanvas(capySVG, 500, 280);
      crocCanvas = await svgToCanvas(crocSVG, 500, 330);
      loaded = true;
      loadCallbacks.forEach(cb => cb());
      loadCallbacks = [];
    } catch (e) {
      console.error('Sprites.init error:', e);
    }
  }

  function drawCapybara(ctx, x, y, scale, frame, jumping) {
    if (!capyCanvas) return;
    const bob = jumping ? 0 : Math.sin(frame * 0.3) * 2;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(capyCanvas, 0, 0, 500, 280, x, y + bob, 500 * scale, 280 * scale);
  }

  function drawCrocodile(ctx, x, y, scale, frame) {
    if (!crocCanvas) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(crocCanvas, 0, 0, 500, 330, x, y, 500 * scale, 330 * scale);
  }

  // --- Small pixel sprites (hearts, ruby, medal, cup) ---

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

  function getVictorySVG() {
    if (!capyCanvas) return '<div>Loading...</div>';
    const dataUrl = capyCanvas.toDataURL();
    return `<img src="${dataUrl}" style="width:240px;image-rendering:pixelated;border-radius:12px;box-shadow:0 0 20px rgba(255,215,0,0.5)" alt="Victory Capybara"/>`;
  }

  function getCapybaraBounds(x, y, scale) {
    const margin = 0.12;
    return {
      x: x + 500 * scale * margin,
      y: y + 280 * scale * margin,
      width: 500 * scale * (1 - margin * 2),
      height: 280 * scale * (1 - margin * 2),
    };
  }

  function getCrocodileBounds(x, y, scale) {
    const margin = 0.1;
    return {
      x: x + 500 * scale * margin,
      y: y + 330 * scale * margin,
      width: 500 * scale * (1 - margin * 2),
      height: 330 * scale * (1 - margin * 2),
    };
  }

  function getCapybaraSize(scale) {
    return { width: 500 * scale, height: 280 * scale };
  }

  function getCrocodileSize(scale) {
    return { width: 500 * scale, height: 330 * scale };
  }

  return {
    init,
    onReady,
    drawCapybara,
    drawCrocodile,
    drawHeart,
    drawRuby,
    drawMedal,
    drawCup,
    drawGround,
    drawGroundDetail,
    getVictorySVG,
    getCapybaraBounds,
    getCrocodileBounds,
    getCapybaraSize,
    getCrocodileSize,
    PIXEL,
  };
})();
