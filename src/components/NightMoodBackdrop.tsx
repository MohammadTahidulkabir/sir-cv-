/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { NightMoodType } from '../types/nightMood.ts';

interface NightMoodBackdropProps {
  mood: NightMoodType;
}

export const NightMoodBackdrop: React.FC<NightMoodBackdropProps> = ({ mood }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (mood !== 'midnight') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate celestial stars
    const starCount = Math.min(140, Math.floor((width * height) / 10000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    }));

    // Occasional shooting star
    let shootingStar: {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    } | null = null;

    let lastShootingStarTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render twinkling stars
      stars.forEach(star => {
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.95) {
          star.alpha = 0.95;
          star.direction = -1;
        } else if (star.alpha < 0.15) {
          star.alpha = 0.15;
          star.direction = 1;
        }

        ctx.fillStyle = `rgba(224, 242, 254, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn shooting star every 7-14 seconds
      const now = Date.now();
      if (!shootingStar && now - lastShootingStarTime > 8000 && Math.random() < 0.02) {
        lastShootingStarTime = now;
        shootingStar = {
          x: Math.random() * (width * 0.7),
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 60,
          speed: Math.random() * 12 + 10,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 0.85,
          active: true
        };
      }

      if (shootingStar && shootingStar.active) {
        const dx = Math.cos(shootingStar.angle) * shootingStar.speed;
        const dy = Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.x += dx;
        shootingStar.y += dy;
        shootingStar.opacity -= 0.022;

        const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          tailX,
          tailY
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        gradient.addColorStop(0.3, `rgba(56, 189, 248, ${shootingStar.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (
          shootingStar.opacity <= 0 ||
          shootingStar.x > width ||
          shootingStar.y > height
        ) {
          shootingStar = null;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mood]);

  if (mood === 'day') return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700" 
      aria-hidden="true"
    >
      {/* 1. Midnight Starfield Mood */}
      {mood === 'midnight' && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-70"
          />
          {/* Deep space cosmic vignettes */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-sky-600/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[160px]" />
        </>
      )}

      {/* 2. Warm Candlelight Reading Mood */}
      {mood === 'candlelight' && (
        <>
          {/* Warm desk lamp / study room ambient radial glow */}
          <div className="absolute -top-32 right-0 w-[800px] h-[800px] bg-radial from-amber-500/12 via-amber-600/5 to-transparent rounded-full blur-[120px] animate-pulse duration-[8000ms]" />
          <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-radial from-amber-700/8 via-orange-950/4 to-transparent rounded-full blur-[140px]" />
          {/* Subtle warm candlelight vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-amber-950/[0.04] to-amber-950/[0.12] pointer-events-none" />
        </>
      )}

      {/* 3. Nordic Aurora Mood */}
      {mood === 'aurora' && (
        <>
          {/* Undulating boreal aurora wave layers */}
          <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-[90px] animate-pulse duration-[6000ms]" />
          <div className="absolute top-10 right-1/4 w-[700px] h-[400px] bg-radial from-teal-400/10 via-emerald-600/5 to-transparent rounded-full blur-[110px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[130px]" />
        </>
      )}
    </div>
  );
};
