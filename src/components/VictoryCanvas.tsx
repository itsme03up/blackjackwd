import React, { useRef, useEffect } from "react";

const opts = {
  side: 35,
  picksParTick: 2,
  baseTime: 40,
  addedTime: 10,
  baseLight: 0,
  addedLight: 60,
  strokeLight: 30,
  hueSpeed: 0.4,
  repaintAlpha: 1,
};

export const VictoryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;
    let sum = w + h;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let difX = Math.sqrt(3) * opts.side / 2;
    let difY = opts.side * 3 / 2;
    let rad = Math.PI / 6;
    let cos = Math.cos(rad) * opts.side;
    let sin = Math.sin(rad) * opts.side;
    let hexs: any[] = [];
    let tick = 0;

    function loop() {
      if (!ctx) return;
      window.requestAnimationFrame(loop);
      tick += opts.hueSpeed;
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < opts.picksParTick; ++i)
        hexs[(Math.random() * hexs.length) | 0].pick();
      hexs.forEach(hex => hex.step(ctx));
    }

class Hex {
  x: number;
  y: number;
  sum: number;
  picked: boolean;
  time: number;
  targetTime: number;
  xs: number[];
  ys: number[];
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sum = this.x + this.y;
    this.picked = false;
    this.time = 0;
    this.targetTime = 0;
    this.xs = [this.x + cos, this.x, this.x - cos, this.x - cos, this.x, this.x + cos];
    this.ys = [this.y - sin, this.y - opts.side, this.y - sin, this.y + sin, this.y + opts.side, this.y + sin];
  }
  pick() {
    this.picked = true;
    this.time = this.time || 0;
    this.targetTime = this.targetTime || ((opts.baseTime + opts.addedTime * Math.random()) | 0);
  }
  step(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;
    const prop = this.time / this.targetTime;
    const color = `hsl(${this.sum / sum * 100 + tick},100%,${opts.strokeLight}%)`;
    ctx.beginPath();
    ctx.moveTo(this.xs[0], this.ys[0]);
    for (let i = 1; i < this.xs.length; ++i)
      ctx.lineTo(this.xs[i], this.ys[i]);
    ctx.lineTo(this.xs[0], this.ys[0]);
    if (this.picked) {
      ++this.time;
      if (this.time >= this.targetTime) {
        this.time = 0;
        this.targetTime = 0;
        this.picked = false;
      }
      ctx.fillStyle = ctx.shadowColor = `hsl(${this.sum / sum * 100 + tick},100%,${opts.baseLight + opts.addedLight * Math.sin(prop * Math.PI)}%)`;
      ctx.fill();
    } else {
      ctx.strokeStyle = ctx.shadowColor = color;
      ctx.stroke();
    }
  }
}

    hexs = [];
    for (let x = 0; x < w; x += difX * 2) {
      let i = 0;
      for (let y = 0; y < h; y += difY) {
        ++i;
        hexs.push(new Hex(x + difX * (i % 2), y));
      }
    }
    loop();

    function handleResize() {
      if (!c) return;
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      sum = w + h;
      hexs = [];
      for (let x = 0; x < w; x += difX * 2) {
        let i = 0;
        for (let y = 0; y < h; y += difY) {
          ++i;
          hexs.push(new Hex(x + difX * (i % 2), y));
        }
      }
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: '"Stalinist One", sans-serif',
            fontSize: '4rem',
            color: '#fff',
            textShadow: '0 0 32px #facc15, 0 0 8px #38bdf8',
            letterSpacing: '0.18em',
            userSelect: 'none',
          }}
        >
          YOU WIN!
        </span>
      </div>
    </>
  );
};
