const Sprites = (() => {
  const PIXEL = 4;

  function drawPixelGrid(ctx, data, x, y, scale) {
    const ps = PIXEL;
    for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < data[r].length; c++) {
        const color = data[r][c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(
            x + c * ps * scale,
            y + r * ps * scale,
            ps * scale,
            ps * scale
          );
        }
      }
    }
  }

  const B = '#6B4226';
  const b = '#8B5E3C';
  const d = '#5A3620';
  const n = '#3D2314';
  const w = '#F5E6D0';
  const e = '#1A0E08';
  const p = '#D4956A';
  const h = '#F0D0B0';

  const capybaraFrame1 = [
    [0,0,0,0,0,0,B,B,B,0,0,0,0,0,0,0],
    [0,0,0,0,0,B,b,b,b,B,0,0,0,0,0,0],
    [0,0,0,0,B,b,b,b,b,b,B,0,0,0,0,0],
    [0,0,0,B,b,b,b,b,b,b,b,B,0,0,0,0],
    [0,0,B,b,b,b,b,b,b,b,b,b,B,0,0,0],
    [0,0,B,b,b,w,w,b,b,b,b,b,B,0,0,0],
    [0,B,b,b,w,w,e,b,b,b,b,b,b,B,0,0],
    [0,B,b,b,b,b,b,b,b,b,b,b,b,B,0,0],
    [0,B,b,b,b,b,b,p,b,b,b,b,b,B,0,0],
    [0,0,B,b,b,b,b,b,b,b,b,b,B,0,0,0],
    [0,0,0,B,b,b,b,b,b,b,b,B,0,0,0,0],
    [0,0,0,0,B,B,B,B,B,B,B,0,0,0,0,0],
    [0,0,0,0,0,B,0,0,0,B,0,0,0,0,0,0],
    [0,0,0,0,0,B,0,0,0,B,0,0,0,0,0,0],
  ];

  const capybaraFrame2 = [
    [0,0,0,0,0,0,B,B,B,0,0,0,0,0,0,0],
    [0,0,0,0,0,B,b,b,b,B,0,0,0,0,0,0],
    [0,0,0,0,B,b,b,b,b,b,B,0,0,0,0,0],
    [0,0,0,B,b,b,b,b,b,b,b,B,0,0,0,0],
    [0,0,B,b,b,b,b,b,b,b,b,b,B,0,0,0],
    [0,0,B,b,b,w,w,b,b,b,b,b,B,0,0,0],
    [0,B,b,b,w,w,e,b,b,b,b,b,b,B,0,0],
    [0,B,b,b,b,b,b,b,b,b,b,b,b,B,0,0],
    [0,B,b,b,b,b,b,p,b,b,b,b,b,B,0,0],
    [0,0,B,b,b,b,b,b,b,b,b,b,B,0,0,0],
    [0,0,0,B,b,b,b,b,b,b,b,B,0,0,0,0],
    [0,0,0,0,B,B,B,B,B,B,B,0,0,0,0,0],
    [0,0,0,0,B,0,0,0,0,0,B,0,0,0,0,0],
    [0,0,0,0,B,0,0,0,0,0,B,0,0,0,0,0],
  ];

  const capybaraJump = [
    [0,0,0,0,0,0,B,B,B,0,0,0,0,0,0,0],
    [0,0,0,0,0,B,b,b,b,B,0,0,0,0,0,0],
    [0,0,0,0,B,b,b,b,b,b,B,0,0,0,0,0],
    [0,0,0,B,b,b,b,b,b,b,b,B,0,0,0,0],
    [0,0,B,b,b,b,b,b,b,b,b,b,B,0,0,0],
    [0,0,B,b,b,w,w,b,b,b,b,b,B,0,0,0],
    [0,B,b,b,w,w,e,b,b,b,b,b,b,B,0,0],
    [0,B,b,b,b,b,b,b,b,b,b,b,b,B,0,0],
    [0,B,b,b,b,b,b,p,b,b,b,b,b,B,0,0],
    [0,0,B,b,b,b,b,b,b,b,b,b,B,0,0,0],
    [0,0,0,B,b,b,b,b,b,b,b,B,0,0,0,0],
    [0,0,0,0,B,B,B,B,B,B,B,0,0,0,0,0],
    [0,0,B,0,0,0,0,0,0,0,0,0,B,0,0,0],
    [0,B,0,0,0,0,0,0,0,0,0,0,0,B,0,0],
  ];

  const G = '#2D7D2D';
  const g = '#3A9A3A';
  const k = '#1B5C1B';
  const t = '#F0F0E0';
  const T = '#E0E0D0';
  const R = '#CC3333';
  const y = '#4AB84A';

  const crocFrame1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,G,G],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,G,G,G,G],
    [0,0,G,G,0,0,0,0,0,0,0,0,0,0,G,G,G,G,G,k],
    [0,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0],
    [G,G,g,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0],
    [G,t,T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0],
    [G,t,R,T,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0,0],
    [G,t,T,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0,0],
    [G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0,0],
    [0,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0,0,0],
    [0,0,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0,0,0,0],
    [0,0,0,G,G,0,0,0,0,0,0,0,G,G,0,0,0,0,0,0],
    [0,0,0,G,0,0,0,0,0,0,0,0,0,G,0,0,0,0,0,0],
  ];

  const crocFrame2 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,G,G],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,G,G,G,G],
    [0,0,G,G,0,0,0,0,0,0,0,0,0,0,G,G,G,G,G,k],
    [0,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k],
    [G,G,g,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0],
    [G,t,T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0],
    [G,t,R,T,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0],
    [G,t,T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0],
    [G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0],
    [0,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0,0],
    [0,0,G,G,G,G,G,G,G,G,G,G,G,G,G,k,0,0,0,0],
    [0,0,0,G,0,0,0,0,0,0,0,0,0,G,G,0,0,0,0,0],
    [0,0,0,0,G,0,0,0,0,0,0,0,0,G,0,0,0,0,0,0],
  ];

  const R2 = '#E03030';
  const R3 = '#FF4444';
  const R4 = '#C02020';

  const heartData = [
    [0,R2,R2,0,R2,R2,0],
    [R3,R2,R3,R3,R2,R3,R2],
    [R3,R3,R3,R3,R3,R3,R2],
    [R3,R3,R3,R3,R3,R3,R2],
    [0,R3,R3,R3,R3,R3,0],
    [0,0,R4,R4,R4,0,0],
    [0,0,0,R4,0,0,0],
  ];

  const heartEmpty = [
    [0,'#555','#555',0,'#555','#555',0],
    ['#555','#444','#555','#555','#444','#555','#444'],
    ['#555','#555','#555','#555','#555','#555','#444'],
    ['#555','#555','#555','#555','#555','#555','#444'],
    [0,'#555','#555','#555','#555','#555',0],
    [0,0,'#444','#444','#444',0,0],
    [0,0,0,'#444',0,0,0],
  ];

  const DG = '#D4AF37';
  const dg = '#B8960F';
  const db = '#8B7500';
  const RB = '#E8E8E8';
  const RD = '#CC0000';
  const rD = '#AA0000';

  const rubyData = [
    [0,0,0,RD,RD,0,0,0],
    [0,0,RD,RB,RD,RD,0,0],
    [0,RD,RB,RB,RD,RD,RD,0],
    [RD,RB,RD,RD,RD,RD,RD,RD],
    [RD,RD,RD,RD,RD,RD,RD,rD],
    [0,RD,RD,RD,RD,RD,rD,0],
    [0,0,RD,RD,RD,rD,0,0],
    [0,0,0,rD,rD,0,0,0],
  ];

  const medalData = [
    [0,0,DG,DG,DG,DG,0,0],
    [0,DG,dg,dg,dg,dg,DG,0],
    [DG,dg,RB,RB,RB,dg,dg,DG],
    [DG,dg,RB,DG,DG,dg,dg,DG],
    [DG,dg,RB,DG,dg,dg,dg,DG],
    [DG,dg,RB,RB,dg,dg,dg,DG],
    [0,DG,dg,dg,dg,dg,DG,0],
    [0,0,DG,DG,DG,DG,0,0],
  ];

  const cupData = [
    [0,DG,DG,0,0,DG,DG,0],
    [0,DG,dg,DG,DG,dg,DG,0],
    [0,0,DG,dg,dg,DG,0,0],
    [0,0,DG,dg,dg,DG,0,0],
    [0,0,DG,dg,dg,DG,0,0],
    [0,0,0,DG,DG,0,0,0],
    [0,0,DG,DG,DG,DG,0,0],
    [0,DG,DG,DG,DG,DG,DG,0],
  ];

  const sB2 = '#6B4226';
  const sb = '#8B5E3C';
  const sw = '#F5E6D0';
  const se = '#1A0E08';
  const sp = '#D4956A';
  const sg2 = '#606060';

  const victoryCapybara = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,sB2,sB2,sB2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,sB2,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,sB2,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,sB2,sb,sb,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,sB2,sb,sb,sw,sw,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,sB2,sb,sb,sw,sg2,sw,sw,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,sB2,sb,sb,sw,sw,sw,sw,sw,sb,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,sB2,sb,sb,sw,sw,sw,sw,sw,sw,sb,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,sB2,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,sB2,sb,sb,sb,sb,sb,sp,sb,sb,sb,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,sB2,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,sB2,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sb,sB2,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,sB2,sB2,sB2,sB2,sB2,sB2,sB2,sB2,sB2,sB2,sB2,sB2,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,sB2,0,0,0,0,0,0,0,0,0,sB2,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,sB2,0,0,0,0,0,0,0,0,0,sB2,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  function drawCapybara(ctx, x, y, scale, frame, jumping) {
    const data = jumping ? capybaraJump : (frame % 2 === 0 ? capybaraFrame1 : capybaraFrame2);
    drawPixelGrid(ctx, data, x, y, scale);
  }

  function drawCrocodile(ctx, x, y, scale, frame) {
    const data = frame % 2 === 0 ? crocFrame1 : crocFrame2;
    drawPixelGrid(ctx, data, x, y, scale);
  }

  function drawHeart(ctx, x, y, scale, filled) {
    drawPixelGrid(ctx, filled ? heartData : heartEmpty, x, y, scale);
  }

  function drawRuby(ctx, x, y, scale) {
    drawPixelGrid(ctx, rubyData, x, y, scale);
  }

  function drawMedal(ctx, x, y, scale) {
    drawPixelGrid(ctx, medalData, x, y, scale);
  }

  function drawCup(ctx, x, y, scale) {
    drawPixelGrid(ctx, cupData, x, y, scale);
  }

  function drawGround(ctx, x, y, width, height) {
    ctx.fillStyle = '#5A8C3C';
    ctx.fillRect(x, y, width, 3);
    ctx.fillStyle = '#3A6C1C';
    ctx.fillRect(x, y + 3, width, height - 3);
  }

  function drawGroundDetail(ctx, scrollX, canvasWidth, groundY) {
    ctx.fillStyle = '#6BA34A';
    for (let i = 0; i < canvasWidth + 40; i += 20) {
      const offset = (scrollX * 0.5) % 20;
      ctx.fillRect(i - offset, groundY - 2, 8, 2);
    }
    ctx.fillStyle = '#4A8C2C';
    for (let i = 0; i < canvasWidth + 40; i += 35) {
      const offset = (scrollX * 0.3) % 35;
      ctx.fillRect(i - offset + 10, groundY - 4, 4, 2);
    }
  }

  function getVictorySVG() {
    const ps = 6;
    const w = victoryCapybara[0].length * ps;
    const h = victoryCapybara.length * ps;
    const rects = [];
    for (let r = 0; r < victoryCapybara.length; r++) {
      for (let c = 0; c < victoryCapybara[r].length; c++) {
        const color = victoryCapybara[r][c];
        if (color) {
          rects.push(`<rect x="${c * ps}" y="${r * ps}" width="${ps}" height="${ps}" fill="${color}"/>`);
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${rects.join('')}</svg>`;
  }

  function getCapybaraBounds(x, y, scale) {
    const w = 16 * PIXEL * scale;
    const h = 14 * PIXEL * scale;
    return { x: x + 4 * scale, y: y + 2 * scale, width: w - 8 * scale, height: h - 4 * scale };
  }

  function getCrocodileBounds(x, y, scale) {
    const w = 20 * PIXEL * scale;
    const h = 13 * PIXEL * scale;
    return { x: x + 2 * scale, y: y + 2 * scale, width: w - 6 * scale, height: h - 4 * scale };
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
    getVictorySVG,
    getCapybaraBounds,
    getCrocodileBounds,
    PIXEL,
  };
})();
