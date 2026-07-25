# Capybara Runner Game

## Descripción
Juego endless runner con un capibara pixel art que salta cocodrilos. Inspirado en el juego del dinosaurio de Chrome.

## Stack
- Vanilla JavaScript
- Canvas 2D para renderizado
- SVG pixel art para sprites
- Web Audio API para sonidos

## Comandos
- `npm run dev` — Iniciar servidor local (si está configurado, de lo contrario abrir index.html directamente)
- No hay build step — es HTML/JS/CSS estático

## Deploy
El deploy se hace automáticamente via Vercel al hacer push a `main`:
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
│   ├── sprites.js      # Sprite loader + renderizado SVG en canvas
│   ├── sounds.js       # Web Audio API (8 efectos de sonido)
│   ├── rewards.js      # Sistema de recompensas (rubíes, medallas, copas)
│   └── game.js         # Loop principal, física, colisiones, estado
├── css/
│   └── style.css       # Estilos pixel art
└── assets/             # (opcional)
```

## Convenciones
- Sprites: SVGs limpios (sin background blanco) en `js/*-clean.svg`
- Sprites pequeños (corazones, gemas): arrays 2D con `drawPixelGrid`
- Sonidos: Web Audio API, sin archivos externos
- Escala de sprites SVG: 0.30 para capibara, 0.22-0.35 para cocodrilo
- Canvas: 900x350, GROUND_Y = 220

## Sistema de Recompensas
- 150 pts → +1 Rubí
- 3 rubíes → +1 Medalla (reset rubíes)
- 3 medallas → +1 Copa
- 3 copas → VICTORIA
