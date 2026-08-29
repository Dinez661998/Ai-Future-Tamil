import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;
    let resizeTimer = 0;
    let lastFrameTime = 0;
    let rotation = 0;
    let isVisible = !document.hidden;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let reducedMotion = motionQuery.matches;

    const mouse = { x: 0, y: 0, active: false };

    let nodes = [];
    let particles = [];
    let stars = [];
    let staticBackground = null;

    const isMobile = () => window.innerWidth < 768;

    const settings = {
      desktop: {
        nodes: 62,
        particles: 34,
        stars: 48,
        fps: 30,
        connectionDistance: 74,
        maxConnectionsPerNode: 4,
      },
      mobile: {
        nodes: 38,
        particles: 18,
        stars: 28,
        fps: 24,
        connectionDistance: 62,
        maxConnectionsPerNode: 3,
      },
    };

    const getSettings = () =>
      isMobile() ? settings.mobile : settings.desktop;

    const random = (min, max) =>
      Math.random() * (max - min) + min;

    function createStars(count) {
      stars = Array.from({ length: count }, () => ({
        x: random(0, width),
        y: random(0, height),
        size: random(0.45, 1.45),
        alpha: random(0.15, 0.5),
        phase: random(0, Math.PI * 2),
      }));
    }

    function createParticles(count) {
      particles = Array.from({ length: count }, () => ({
        x: random(0, width),
        y: random(0, height),
        size: random(0.6, 2),
        speedX: random(-0.09, 0.09),
        speedY: random(-0.12, 0.12),
        alpha: random(0.15, 0.45),
        hue: Math.random(),
      }));
    }

    function createSphereNodes(count) {
      nodes = [];

      for (let i = 0; i < count; i++) {
        const y = 1 - (i / Math.max(count - 1, 1)) * 2;
        const radius = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;

        nodes.push({
          x: Math.cos(theta) * radius,
          y,
          z: Math.sin(theta) * radius,
          size: random(1.1, 2.5),
          pulse: random(0, Math.PI * 2),
        });
      }
    }

    function buildStaticBackground() {
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.round(width * dpr));
      offscreen.height = Math.max(1, Math.round(height * dpr));

      const octx = offscreen.getContext("2d", { alpha: false });
      if (!octx) {
        staticBackground = null;
        return;
      }

      octx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const background = octx.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, "#070b20");
      background.addColorStop(0.28, "#130b2d");
      background.addColorStop(0.55, "#080b22");
      background.addColorStop(0.78, "#19091f");
      background.addColorStop(1, "#050817");

      octx.fillStyle = background;
      octx.fillRect(0, 0, width, height);

      const blueGlow = octx.createRadialGradient(
        width * 0.15,
        height * 0.25,
        0,
        width * 0.15,
        height * 0.25,
        width * 0.65
      );
      blueGlow.addColorStop(0, "rgba(50, 100, 255, 0.20)");
      blueGlow.addColorStop(0.45, "rgba(100, 60, 255, 0.08)");
      blueGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      octx.fillStyle = blueGlow;
      octx.fillRect(0, 0, width, height);

      const pinkGlow = octx.createRadialGradient(
        width * 0.85,
        height * 0.25,
        0,
        width * 0.85,
        height * 0.25,
        width * 0.6
      );
      pinkGlow.addColorStop(0, "rgba(255, 60, 190, 0.15)");
      pinkGlow.addColorStop(0.5, "rgba(170, 50, 255, 0.07)");
      pinkGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      octx.fillStyle = pinkGlow;
      octx.fillRect(0, 0, width, height);

      staticBackground = offscreen;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(
        window.devicePixelRatio || 1,
        isMobile() ? 1 : 1.35
      );

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const current = getSettings();
      createStars(current.stars);
      createParticles(current.particles);
      createSphereNodes(current.nodes);
      buildStaticBackground();
    }

    function drawStaticBackground() {
      if (!staticBackground) {
        ctx.fillStyle = "#070b20";
        ctx.fillRect(0, 0, width, height);
        return;
      }

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(staticBackground, 0, 0);
      ctx.restore();
    }

    function drawStars(time) {
      for (const star of stars) {
        const pulse =
          star.alpha +
          Math.sin(time * 0.0016 + star.phase) * 0.1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,180,255,${Math.max(
          0.05,
          pulse
        )})`;
        ctx.fill();
      }
    }

    function drawParticles() {
      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.speedX;
          p.y += p.speedY;
        }

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        let color;

        if (p.hue < 0.33) {
          color = `rgba(80,150,255,${p.alpha})`;
        } else if (p.hue < 0.66) {
          color = `rgba(180,90,255,${p.alpha})`;
        } else {
          color = `rgba(255,80,190,${p.alpha})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    function projectNode(node, centerX, centerY, radius) {
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      const rotatedX = node.x * cosR - node.z * sinR;
      const rotatedZ = node.x * sinR + node.z * cosR;
      const perspective = 1 / (1.8 - rotatedZ * 0.65);

      return {
        x: centerX + rotatedX * radius * perspective,
        y: centerY + node.y * radius * perspective,
        z: rotatedZ,
        scale: perspective,
      };
    }

    function drawSphereGlow(centerX, centerY, radius) {
      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.15,
        centerX,
        centerY,
        radius * 1.35
      );

      glow.addColorStop(0, "rgba(90,130,255,0.12)");
      glow.addColorStop(0.4, "rgba(110,70,255,0.08)");
      glow.addColorStop(0.72, "rgba(230,60,255,0.04)");
      glow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    function drawOrbitRings(centerX, centerY, radius) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation * 0.35);

      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.03, radius * 0.34, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(90,150,255,0.22)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        radius * 1.08,
        radius * 0.55,
        Math.PI / 2.5,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(190,90,255,0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        radius * 1.12,
        radius * 0.25,
        -Math.PI / 3,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(255,80,190,0.15)";
      ctx.stroke();

      ctx.restore();
    }

    function drawConnections(projected) {
      const current = getSettings();
      const thresholdSq =
        current.connectionDistance * current.connectionDistance;

      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        if (a.z < -0.25) continue;

        let connections = 0;

        for (
          let j = i + 1;
          j < projected.length &&
          connections < current.maxConnectionsPerNode;
          j++
        ) {
          const b = projected[j];
          if (b.z < -0.25) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < thresholdSq) {
            const distance = Math.sqrt(distanceSq);
            const depth = (a.z + b.z + 2) / 4;
            const alpha =
              (1 - distance / current.connectionDistance) *
              depth *
              0.42;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(125,120,255,${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();

            connections++;
          }
        }
      }
    }

    function drawNodes(projected, time) {
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const original = nodes[i];

        if (!original || p.z < -0.55) continue;

        const pulse = reducedMotion
          ? 1
          : 1 + Math.sin(time * 0.0015 + original.pulse) * 0.22;

        const size = original.size * p.scale * pulse;

        let color;

        if (p.z > 0.35) {
          color = "#65a8ff";
        } else if (p.x < width / 2) {
          color = "#9c7cff";
        } else {
          color = "#f56bd5";
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    function drawEnergyWave(centerX, centerY, radius, time, offset) {
      const progress = reducedMotion
        ? offset
        : (time * 0.00012 + offset) % 1;

      const waveRadius = radius * (0.78 + progress * 0.52);
      const alpha = (1 - progress) * 0.11;

      ctx.beginPath();
      ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(120,100,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawMouseGlow() {
      if (!mouse.active || isMobile()) return;

      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        190
      );

      gradient.addColorStop(0, "rgba(100,130,255,0.07)");
      gradient.addColorStop(0.4, "rgba(180,70,255,0.035)");
      gradient.addColorStop(1, "rgba(255,70,180,0)");

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 190, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    function drawFrame(time, force = false) {
      const current = getSettings();
      const frameInterval = 1000 / current.fps;

      if (!force && time - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(drawFrame);
        return;
      }

      lastFrameTime = time;

      drawStaticBackground();
      drawStars(time);
      drawParticles();

      const centerX = width * (isMobile() ? 0.76 : 0.72);
      const centerY = height * 0.48;
      const sphereRadius =
        Math.min(width, height) * (isMobile() ? 0.24 : 0.29);

      drawSphereGlow(centerX, centerY, sphereRadius);
      drawEnergyWave(centerX, centerY, sphereRadius, time, 0);
      drawEnergyWave(centerX, centerY, sphereRadius, time, 0.5);
      drawOrbitRings(centerX, centerY, sphereRadius);

      const projected = nodes.map((node) =>
        projectNode(node, centerX, centerY, sphereRadius)
      );

      drawConnections(projected);
      drawNodes(projected, time);
      drawMouseGlow();

      if (!reducedMotion) {
        rotation += isMobile() ? 0.0014 : 0.0018;
      }

      if (isVisible && !reducedMotion) {
        animationId = requestAnimationFrame(drawFrame);
      }
    }

    function startAnimation() {
      cancelAnimationFrame(animationId);

      if (reducedMotion) {
        drawFrame(performance.now(), true);
        return;
      }

      lastFrameTime = 0;
      animationId = requestAnimationFrame(drawFrame);
    }

    function handleResize() {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        resize();
        startAnimation();
      }, 180);
    }

    function handleMouseMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    function handleVisibilityChange() {
      isVisible = !document.hidden;

      if (isVisible) {
        startAnimation();
      } else {
        cancelAnimationFrame(animationId);
      }
    }

    function handleReducedMotionChange(event) {
      reducedMotion = event.matches;
      startAnimation();
    }

    resize();
    startAnimation();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener?.("change", handleReducedMotionChange);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimer);

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      motionQuery.removeEventListener?.(
        "change",
        handleReducedMotionChange
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
