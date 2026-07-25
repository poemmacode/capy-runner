# Capybara Runner Game

## Descripción
Juego endless runner con un capibara pixel art que salta cocodrilos. Inspirado en el juego del dinosaurio de Chrome.

## Stack
- Vanilla JavaScript (sin frameworks)
- Canvas 2D para renderizado
- Sprites dibujados con canvas primitives (arcos, rectángulos)
- Web Audio API para sonidos
- Responsive design con soporte táctil

## Comandos
- `open index.html` — Abrir juego localmente
- No hay build step — es HTML/JS/CSS estático
- Push a `main` para deploy automático en Vercel:
  ```
  git push origin main
  ```

## Estructura
```
/
├── index.html          # Página principal
├── AGENTS.md
├── capy-pixel.svg      # SVG original del capibara (fuente)
├── coco-pixel.svg      # SVG original del cocodrilo (fuente)
├── js/
│   ├── sprites.js      # Sprites con canvas primitives + pixel grids
│   ├── sounds.js       # Web Audio API (8 efectos de sonido)
│   ├── rewards.js      # Sistema de recompensas (rubíes, medallas, copas)
│   └── game.js         # Loop principal, física, colisiones, estado
├── css/
│   └── style.css       # Estilos responsive + mobile
└── assets/             # (opcional)
```

## Convenciones
- Sprites principales (capibara, cocodrilo): canvas primitives (arc/rect)
- Sprites pequeños (corazones, gemas): arrays 2D con `drawPixelGrid`
- Sonidos: Web Audio API, sin archivos externos
- Canvas: 900x350 virtual, escalado responsive
- GROUND_Y = 250

## Mobile
- Botón táctil "JUMP" en celulares
- Canvas responsive escalado al viewport
- Touch events prevenidos de default
- `user-scalable=no` en viewport

## Sistema de Recompensas
- 150 pts → +1 Rubí
- 3 rubíes → +1 Medalla (reset rubíes)
- 3 medallas → +1 Copa
- 3 copas → VICTORIA
