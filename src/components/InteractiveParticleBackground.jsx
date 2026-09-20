import { useEffect, useRef } from "react";

function getParticleCount(width, _height) {
  if (width >= 1400) return 140;
  if (width >= 1024) return 110;
  if (width >= 768) return 80;
  if (width >= 480) return 60;
  return 40;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createParticle(width, height, index, total) {
  const centerX = width / 2;
  const centerY = height / 2;
  const angle = (index / total) * Math.PI * 2;
  const spread = clamp(Math.min(width, height) * (0.2 + Math.random() * 0.5), 140, 650);

  const x = centerX + Math.cos(angle * 1.15) * spread * (0.4 + Math.random() * 0.8);
  const y = centerY + Math.sin(angle * 1.65) * spread * (0.25 + Math.random() * 0.75);

  const radius = 1.2 + Math.random() * 2.4;
  const driftScale = 0.2 + Math.random() * 0.5;

  return {
    x,
    y,
    baseX: x,
    baseY: y,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    radius,
    alpha: 0.3 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    glow: 0.7 + Math.random() * 0.9,
    driftScale,
  };
}

export default function InteractiveParticleBackground({
  particleCount,
  particleColor = "rgba(139, 92, 246, 0.9)",
  connectionDistance = 130,
  interactionRadius = 180,
  interactionStrength = 0.75,
  animationSpeed = 1,
  enabled = true,
  opacity = 0.95,
}) {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false, strength: 0 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    updateReducedMotion();
    mediaQuery.addEventListener?.("change", updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener?.("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handlePointerMove = (event) => {
      pointerRef.current.active = true;
      pointerRef.current.strength = 1;
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.strength = 0;
    };

    const handleClick = (event) => {
      pointerRef.current.active = true;
      pointerRef.current.strength = 1.3;
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("click", handleClick);

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = particleCount ?? getParticleCount(width, height);
      particlesRef.current = Array.from({ length: count }, (_, index) =>
        createParticle(width, height, index, count),
      );
    };

    const render = (time) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const particles = particlesRef.current;
      const pointer = pointerRef.current;

      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }

      if (reducedMotionRef.current) {
        particles.forEach((particle) => {
          particle.x = particle.baseX;
          particle.y = particle.baseY;
        });
      } else {
        for (let i = 0; i < particles.length; i += 1) {
          const particle = particles[i];
          const orbitX = Math.sin(time * 0.00045 * animationSpeed + particle.phase) * 0.5;
          const orbitY = Math.cos(time * 0.0006 * animationSpeed + particle.phase) * 0.5;

          particle.vx += orbitX * particle.driftScale * 0.03;
          particle.vy += orbitY * particle.driftScale * 0.03;

          if (pointer.active) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy) || 1;

            if (distance < interactionRadius) {
              const force = (1 - distance / interactionRadius) * interactionStrength;
              const repel = distance < 80 ? 1.2 : 0.85;
              const directionX = dx / distance;
              const directionY = dy / distance;

              particle.vx -= directionX * force * 0.6 * repel;
              particle.vy -= directionY * force * 0.6 * repel;

              particle.x += directionX * force * 2.2;
              particle.y += directionY * force * 2.2;
            }
          }

          particle.vx *= 0.985;
          particle.vy *= 0.985;
          particle.x += particle.vx * animationSpeed;
          particle.y += particle.vy * animationSpeed;

          const centerX = width / 2;
          const centerY = height / 2;
          const driftX = (centerX - particle.x) * 0.0008;
          const driftY = (centerY - particle.y) * 0.0008;

          particle.x += driftX * 1.5;
          particle.y += driftY * 1.5;

          if (particle.x < -60) particle.x = width + 60;
          if (particle.x > width + 60) particle.x = -60;
          if (particle.y < -60) particle.y = height + 60;
          if (particle.y > height + 60) particle.y = -60;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < connectionDistance) {
            const fade = (1 - distance / connectionDistance) * (pointer.active ? 0.9 : 0.6);
            const stroke = `rgba(139, 92, 246, ${fade * 0.22})`;
            const secondary = `rgba(34, 211, 238, ${fade * 0.2})`;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = fade > 0.45 ? secondary : stroke;
            ctx.lineWidth = 0.7 + fade * 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        const glowBoost = pointer.active
          ? clamp(1 + (1 - Math.hypot(pointer.x - particle.x, pointer.y - particle.y) / interactionRadius) * 1.4, 0.85, 1.9)
          : 1;

        const radius = particle.radius * glowBoost;
        const alpha = clamp(particle.alpha * opacity * glowBoost, 0.15, 0.9);
        const baseColor = particleColor.includes("rgba") ? particleColor : `rgba(139, 92, 246, ${alpha})`;

        ctx.beginPath();
        ctx.fillStyle = baseColor;
        ctx.shadowBlur = 16 * glowBoost;
        ctx.shadowColor = "rgba(139, 92, 246, 0.45)";
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (glowBoost > 1.2) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(34, 211, 238, 0.25)";
          ctx.arc(particle.x, particle.y, radius * 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(render);
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("click", handleClick);
    };
  }, [animationSpeed, connectionDistance, enabled, interactionRadius, interactionStrength, opacity, particleCount, particleColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      style={{ opacity, background: "transparent" }}
    />
  );
}
