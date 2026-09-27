'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { media } from '@/lib/motion';
import { whenIdle } from '@/lib/idle';
import { fragmentShader, vertexShader } from './water-shader';

/**
 * Renders the pink water shader over the still photo of her banner water.
 * Compiling a shader blocks the main thread, so setup waits until the browser
 * is idle; until then the photo is what you see, and the live water fades in
 * over it. It draws below device resolution (water is soft anyway), only runs
 * while on screen and in a visible tab, and draws one still frame for visitors
 * who prefer reduced motion. Without WebGL the canvas simply never appears.
 */
export function WaterCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let teardown: (() => void) | null = null;

    const cancelIdle = whenIdle(() => {
      const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
      if (!gl || gl.isContextLost()) return;

      const compile = (type: number, src: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn('[water] shader failed', gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      };
      const vs = compile(gl.VERTEX_SHADER, vertexShader);
      const fs = compile(gl.FRAGMENT_SHADER, fragmentShader);
      if (!vs || !fs) return;
      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPosition = gl.getAttribLocation(program, 'aPosition');
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      const u = {
        resolution: gl.getUniformLocation(program, 'uResolution'),
        time: gl.getUniformLocation(program, 'uTime'),
        pointer: gl.getUniformLocation(program, 'uPointer'),
        pointerAmt: gl.getUniformLocation(program, 'uPointerAmt'),
      };

      const still = window.matchMedia(media.reduce).matches;
      const small = window.matchMedia(media.mobile).matches;
      // Fraction of device pixels to render. The shader is smooth, so this is
      // mostly invisible and saves a lot of fill rate on large screens.
      const quality = small ? 0.5 : 0.62;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(canvas.clientWidth * dpr * quality));
        const h = Math.max(1, Math.round(canvas.clientHeight * dpr * quality));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
        gl.uniform2f(u.resolution, w, h);
      };

      const pointer = { x: 0.62, y: 0.55, tx: 0.62, ty: 0.55, amt: 0, target: 0 };
      const onPointer = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        pointer.target = inside && e.pointerType === 'mouse' ? 1 : 0;
        pointer.tx = (e.clientX - r.left) / r.width;
        pointer.ty = 1 - (e.clientY - r.top) / r.height;
      };

      let raf = 0;
      let running = false;
      let onScreen = true;
      const start = performance.now();

      const draw = (now: number) => {
        pointer.x += (pointer.tx - pointer.x) * 0.06;
        pointer.y += (pointer.ty - pointer.y) * 0.06;
        pointer.amt += (pointer.target - pointer.amt) * 0.04;
        gl.uniform1f(u.time, still ? 28 : (now - start) / 1000 + 20);
        gl.uniform2f(u.pointer, pointer.x, pointer.y);
        gl.uniform1f(u.pointerAmt, pointer.amt);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const loop = (now: number) => {
        draw(now);
        raf = requestAnimationFrame(loop);
      };
      const play = () => {
        if (running || still || !onScreen || document.hidden) return;
        running = true;
        raf = requestAnimationFrame(loop);
      };
      const pause = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      resize();
      draw(performance.now());
      setReady(true);

      const ro = new ResizeObserver(() => {
        resize();
        if (!running) draw(performance.now());
      });
      ro.observe(canvas);

      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) play();
        else pause();
      });
      io.observe(canvas);

      const onVisibility = () => (document.hidden ? pause() : play());
      document.addEventListener('visibilitychange', onVisibility);
      if (!still) window.addEventListener('pointermove', onPointer, { passive: true });
      play();

      teardown = () => {
        pause();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pointermove', onPointer);
        // Free what this effect made, but keep the context itself: the canvas
        // (and its context) survive a remount, and a lost context can't be reused.
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      };
    }, 2500);

    return () => {
      cancelIdle();
      teardown?.();
      setReady(false);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('transition-opacity duration-[1.6s]', ready ? 'opacity-100' : 'opacity-0', className)}
    />
  );
}
