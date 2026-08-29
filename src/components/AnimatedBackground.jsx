import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId;

    const mouse = {
      x: 0,
      y: 0,
      active: false,
    };

    const nodes = [];
    const particles = [];
    const stars = [];

    const NODE_COUNT = 115;
    const PARTICLE_COUNT = 90;
    const STAR_COUNT = 100;

    let rotation = 0;

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createStars();
      createParticles();
      createSphereNodes();
    }

    // --------------------------------------------------
    // Background Stars
    // --------------------------------------------------

    function createStars() {
      stars.length = 0;

      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: random(0, width),
          y: random(0, height),
          size: random(0.4, 1.6),
          alpha: random(0.15, 0.6),
          speed: random(0.002, 0.01),
          phase: random(0, Math.PI * 2),
        });
      }
    }

    function drawStars(time) {
      for (const star of stars) {
        const pulse =
          star.alpha +
          Math.sin(time * star.speed + star.phase) * 0.15;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(190, 180, 255, ${Math.max(
          0.05,
          pulse
        )})`;

        ctx.fill();
      }
    }

    // --------------------------------------------------
    // Floating Particles
    // --------------------------------------------------

    function createParticles() {
      particles.length = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: random(0, width),
          y: random(0, height),
          size: random(0.5, 2.2),
          speedX: random(-0.15, 0.15),
          speedY: random(-0.2, 0.2),
          alpha: random(0.15, 0.55),
          hue: Math.random(),
        });
      }
    }

    function drawParticles() {
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        let color;

        if (p.hue < 0.33) {
          color = `rgba(80, 150, 255, ${p.alpha})`;
        } else if (p.hue < 0.66) {
          color = `rgba(180, 90, 255, ${p.alpha})`;
        } else {
          color = `rgba(255, 80, 190, ${p.alpha})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    // --------------------------------------------------
    // AI Sphere Nodes
    // --------------------------------------------------

    function createSphereNodes() {
      nodes.length = 0;

      for (let i = 0; i < NODE_COUNT; i++) {
        // Fibonacci sphere distribution
        const y = 1 - (i / (NODE_COUNT - 1)) * 2;

        const radius = Math.sqrt(1 - y * y);

        const theta =
          Math.PI * (3 - Math.sqrt(5)) * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        nodes.push({
          x,
          y,
          z,
          size: random(1.2, 2.8),
          pulse: random(0, Math.PI * 2),
        });
      }
    }

    // --------------------------------------------------
    // Sphere Projection
    // --------------------------------------------------

    function projectNode(node, centerX, centerY, radius) {
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      const rotatedX =
        node.x * cosR - node.z * sinR;

      const rotatedZ =
        node.x * sinR + node.z * cosR;

      const perspective =
        1 / (1.8 - rotatedZ * 0.65);

      const x =
        centerX +
        rotatedX *
          radius *
          perspective;

      const y =
        centerY +
        node.y *
          radius *
          perspective;

      return {
        x,
        y,
        z: rotatedZ,
        scale: perspective,
      };
    }

    // --------------------------------------------------
    // Glowing Sphere
    // --------------------------------------------------

    function drawSphereGlow(
      centerX,
      centerY,
      radius
    ) {
      const glow = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.15,
        centerX,
        centerY,
        radius * 1.45
      );

      glow.addColorStop(
        0,
        "rgba(90, 130, 255, 0.16)"
      );

      glow.addColorStop(
        0.35,
        "rgba(110, 70, 255, 0.12)"
      );

      glow.addColorStop(
        0.65,
        "rgba(230, 60, 255, 0.07)"
      );

      glow.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
      );

      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius * 1.45,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = glow;
      ctx.fill();
    }

    // --------------------------------------------------
    // Sphere Outer Rings
    // --------------------------------------------------

    function drawOrbitRings(
      centerX,
      centerY,
      radius
    ) {
      ctx.save();

      ctx.translate(centerX, centerY);
      ctx.rotate(rotation * 0.35);

      // Main ring
      ctx.beginPath();

      ctx.ellipse(
        0,
        0,
        radius * 1.03,
        radius * 0.34,
        0,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(90, 150, 255, 0.25)";

      ctx.lineWidth = 1.2;
      ctx.shadowColor = "#5b8cff";
      ctx.shadowBlur = 15;

      ctx.stroke();

      // Purple ring
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

      ctx.strokeStyle =
        "rgba(190, 90, 255, 0.18)";

      ctx.lineWidth = 1;

      ctx.stroke();

      // Pink ring
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

      ctx.strokeStyle =
        "rgba(255, 80, 190, 0.18)";

      ctx.stroke();

      ctx.restore();
    }

    // --------------------------------------------------
    // Connections
    // --------------------------------------------------

    function drawConnections(projected) {
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];

          // Don't connect backside nodes
          if (a.z < -0.25 || b.z < -0.25) {
            continue;
          }

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const distance =
            Math.sqrt(dx * dx + dy * dy);

          if (distance < 90) {
            const depth =
              (a.z + b.z + 2) / 4;

            const alpha =
              (1 - distance / 90) *
              depth *
              0.75;

            const gradient =
              ctx.createLinearGradient(
                a.x,
                a.y,
                b.x,
                b.y
              );

            gradient.addColorStop(
              0,
              `rgba(70, 140, 255, ${alpha})`
            );

            gradient.addColorStop(
              0.5,
              `rgba(180, 90, 255, ${alpha})`
            );

            gradient.addColorStop(
              1,
              `rgba(255, 80, 190, ${alpha})`
            );

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.7;

            ctx.stroke();
          }
        }
      }
    }

    // --------------------------------------------------
    // Nodes
    // --------------------------------------------------

    function drawNodes(projected, time) {
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const original = nodes[i];

        if (p.z < -0.55) continue;

        const pulse =
          1 +
          Math.sin(
            time * 0.002 +
              original.pulse
          ) *
            0.35;

        const size =
          original.size *
          p.scale *
          pulse;

        let color;

        if (p.z > 0.35) {
          color = "#65a8ff";
        } else if (p.x < width / 2) {
          color = "#9c7cff";
        } else {
          color = "#f56bd5";
        }

        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;

        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    // --------------------------------------------------
    // Energy Waves
    // --------------------------------------------------

    function drawEnergyWave(
      centerX,
      centerY,
      radius,
      time,
      offset
    ) {
      const progress =
        ((time * 0.00015 + offset) % 1);

      const waveRadius =
        radius * (0.75 + progress * 0.6);

      const alpha =
        (1 - progress) * 0.16;

      ctx.beginPath();

      ctx.arc(
        centerX,
        centerY,
        waveRadius,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        `rgba(120, 100, 255, ${alpha})`;

      ctx.lineWidth = 1.2;

      ctx.shadowColor = "#8c70ff";
      ctx.shadowBlur = 20;

      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    // --------------------------------------------------
    // Mouse Glow
    // --------------------------------------------------

    function drawMouseGlow() {
      if (!mouse.active) return;

      const gradient =
        ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          220
        );

      gradient.addColorStop(
        0,
        "rgba(100, 130, 255, 0.10)"
      );

      gradient.addColorStop(
        0.35,
        "rgba(180, 70, 255, 0.06)"
      );

      gradient.addColorStop(
        1,
        "rgba(255, 70, 180, 0)"
      );

      ctx.beginPath();

      ctx.arc(
        mouse.x,
        mouse.y,
        220,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // --------------------------------------------------
    // Main Animation
    // --------------------------------------------------

    function animate(time) {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      // --------------------------------------------
      // Premium Gradient Background
      // --------------------------------------------

      const background =
        ctx.createLinearGradient(
          0,
          0,
          width,
          height
        );

      background.addColorStop(
        0,
        "#070b20"
      );

      background.addColorStop(
        0.28,
        "#130b2d"
      );

      background.addColorStop(
        0.55,
        "#080b22"
      );

      background.addColorStop(
        0.78,
        "#19091f"
      );

      background.addColorStop(
        1,
        "#050817"
      );

      ctx.fillStyle = background;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      // --------------------------------------------
      // Soft Pink / Purple / Blue Light
      // --------------------------------------------

      const blueGlow =
        ctx.createRadialGradient(
          width * 0.15,
          height * 0.25,
          0,
          width * 0.15,
          height * 0.25,
          width * 0.65
        );

      blueGlow.addColorStop(
        0,
        "rgba(50, 100, 255, 0.20)"
      );

      blueGlow.addColorStop(
        0.45,
        "rgba(100, 60, 255, 0.08)"
      );

      blueGlow.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
      );

      ctx.fillStyle = blueGlow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      const pinkGlow =
        ctx.createRadialGradient(
          width * 0.85,
          height * 0.25,
          0,
          width * 0.85,
          height * 0.25,
          width * 0.6
        );

      pinkGlow.addColorStop(
        0,
        "rgba(255, 60, 190, 0.15)"
      );

      pinkGlow.addColorStop(
        0.5,
        "rgba(170, 50, 255, 0.07)"
      );

      pinkGlow.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
      );

      ctx.fillStyle = pinkGlow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      // --------------------------------------------
      // Background elements
      // --------------------------------------------

      drawStars(time);
      drawParticles();

      // --------------------------------------------
      // Sphere position
      // --------------------------------------------

      const centerX = width * 0.72;
      const centerY = height * 0.48;

      const sphereRadius =
        Math.min(width, height) * 0.30;

      drawSphereGlow(
        centerX,
        centerY,
        sphereRadius
      );

      // --------------------------------------------
      // Energy waves
      // --------------------------------------------

      drawEnergyWave(
        centerX,
        centerY,
        sphereRadius,
        time,
        0
      );

      drawEnergyWave(
        centerX,
        centerY,
        sphereRadius,
        time,
        0.5
      );

      // --------------------------------------------
      // Orbit rings
      // --------------------------------------------

      drawOrbitRings(
        centerX,
        centerY,
        sphereRadius
      );

      // --------------------------------------------
      // Project sphere nodes
      // --------------------------------------------

      const projected =
        nodes.map((node) =>
          projectNode(
            node,
            centerX,
            centerY,
            sphereRadius
          )
        );

      // Back to front
      projected.sort(
        (a, b) => a.z - b.z
      );

      // --------------------------------------------
      // Connections
      // --------------------------------------------

      drawConnections(projected);

      // --------------------------------------------
      // Nodes
      // --------------------------------------------

      drawNodes(
        projected,
        time
      );

      // --------------------------------------------
      // Mouse glow
      // --------------------------------------------

      drawMouseGlow();

      // --------------------------------------------
      // Rotation
      // --------------------------------------------

      rotation += 0.0022;

      animationId =
        requestAnimationFrame(animate);
    }

    // --------------------------------------------------
    // Mouse
    // --------------------------------------------------

    function handleMouseMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    // --------------------------------------------------
    // Touch
    // --------------------------------------------------

    function handleTouchMove(event) {
      if (!event.touches[0]) return;

      mouse.x =
        event.touches[0].clientX;

      mouse.y =
        event.touches[0].clientY;

      mouse.active = true;
    }

    // --------------------------------------------------
    // Start
    // --------------------------------------------------

    resize();

    animationId =
      requestAnimationFrame(animate);

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      { passive: true }
    );

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------

    return () => {
      cancelAnimationFrame(
        animationId
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}