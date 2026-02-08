import React, { useEffect, useRef, useState } from 'react';
import './SpaceBackgroundClean.css';

const SpaceBackgroundClean = () => {
  const canvasRef = useRef(null);
  const [animationRunning, setAnimationRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const objectsRef = useRef({});
  const animationRunningRef = useRef(animationRunning);

  useEffect(() => {
    animationRunningRef.current = animationRunning;
  }, [animationRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let rafId;

    // Define initializeObjects first so it can be used by resizeCanvas
    const initializeObjects = () => {
      objectsRef.current = {
        stars: Array.from({ length: 200 }, () => new Star()),
        centralBody: new CentralBody(),
        planets: [
          new Planet(120, 8, 0.008, 'rgba(255, 100, 100, 1)'),
          new Planet(180, 12, 0.006, 'rgba(255, 200, 100, 1)'),
          new Planet(280, 10, 0.004, 'rgba(100, 150, 255, 1)'),
          new Planet(400, 20, 0.002, 'rgba(255, 180, 120, 1)', true),
          new Planet(520, 18, 0.0015, 'rgba(255, 220, 150, 1)', true)
        ],
        asteroids: Array.from({ length: 50 }, () => new Asteroid())
      };
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeObjects();
    };

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.brightness = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.brightness += this.twinkleSpeed;
        if (this.brightness > 1 || this.brightness < 0) {
          this.twinkleSpeed *= -1;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.brightness;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Planet {
      constructor(orbitRadius, size, speed, color, hasRing = false) {
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.orbitRadius = orbitRadius;
        this.size = size;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
        this.color = color;
        this.hasRing = hasRing;
        this.glowSize = size * 1.5;
      }

      update() {
        if (animationRunningRef.current) {
          this.angle += this.speed * speedMultiplier;
        }
        this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius;
        this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius;
      }

      draw() {
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowSize);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color.replace('1)', '0.3)'));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.hasRing) {
          ctx.strokeStyle = 'rgba(255, 200, 150, 0.6)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(this.x, this.y, this.size * 1.8, this.size * 0.5, Math.PI / 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    class Asteroid {
      constructor() {
        this.reset();
      }

      reset() {
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.orbitRadius = 150 + Math.random() * 250;
        this.size = 2 + Math.random() * 4;
        this.speed = 0.003 + Math.random() * 0.007;
        this.angle = Math.random() * Math.PI * 2;
        this.color = `rgba(${180 + Math.random() * 75}, ${150 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.8)`;
      }

      update() {
        if (animationRunningRef.current) {
          this.angle += this.speed * speedMultiplier;
        }
        this.x = this.centerX + Math.cos(this.angle) * this.orbitRadius;
        this.y = this.centerY + Math.sin(this.angle) * this.orbitRadius;
      }

      draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.3;
        ctx.fillStyle = this.color;
        const trailX = this.x - Math.cos(this.angle) * 10;
        const trailY = this.y - Math.sin(this.angle) * 10;
        ctx.beginPath();
        ctx.arc(trailX, trailY, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class CentralBody {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 40;
        this.pulsePhase = 0;
      }

      update() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        if (animationRunningRef.current) {
          this.pulsePhase += 0.02 * speedMultiplier;
        }
      }

      draw() {
        const pulseSize = this.size + Math.sin(this.pulsePhase) * 5;

        const outerGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pulseSize * 3);
        outerGlow.addColorStop(0, 'rgba(255, 220, 100, 0.3)');
        outerGlow.addColorStop(0.5, 'rgba(255, 200, 50, 0.1)');
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();

        const innerGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pulseSize);
        innerGlow.addColorStop(0, 'rgba(255, 255, 150, 1)');
        innerGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
        innerGlow.addColorStop(1, 'rgba(218, 165, 32, 0.6)');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x - 10, this.y - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 8, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      const { stars, planets, asteroids, centralBody } = objectsRef.current;
      
      // Safety check in case initialization hasn't happened yet
      if (!stars) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      planets.forEach(planet => {
        planet.update();
        planet.draw();
      });

      asteroids.forEach(asteroid => {
        asteroid.update();
        asteroid.draw();
      });

      centralBody.update();
      centralBody.draw();

      rafId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [speedMultiplier]); // Removed animationRunning from dependency array to allow smooth toggling

  return (
    <>
      <canvas ref={canvasRef} className="space-canvas" />
    </>
  );
};

export default SpaceBackgroundClean;
