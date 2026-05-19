document.addEventListener("DOMContentLoaded", () => {
  function initSkillsGlobe() {
    const canvas = document.getElementById("skills-globe-canvas");
    if (!canvas) return;

    const container = canvas.parentElement;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || width;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5.8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Group to hold globe and tags
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Central wireframe globe
    const sphereGeom = new THREE.SphereGeometry(1.6, 22, 22);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xFED7A5,
      wireframe: true,
      transparent: true,
      opacity: 0.10
    });
    const wireframeGlobe = new THREE.Mesh(sphereGeom, sphereMat);
    globeGroup.add(wireframeGlobe);

    // 2. Sparkle particle cloud inside the globe
    const particleCount = 180;
    const particlesGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Distribute randomly inside sphere shell
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.6 * Math.pow(Math.random(), 0.7);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color mixing (accent blue and violet particles)
      const mix = Math.random();
      particleColors[i * 3] = mix * 0.31 + (1 - mix) * 0.54; // R
      particleColors[i * 3 + 1] = mix * 0.62 + (1 - mix) * 0.36; // G
      particleColors[i * 3 + 2] = mix * 1.0 + (1 - mix) * 0.96; // B
    }

    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleGlobe = new THREE.Points(particlesGeom, particlesMat);
    globeGroup.add(particleGlobe);

    // 3. Orbiting skills text tags
    const skillsList = [
      { name: "React", color: "#61dafb" },
      { name: "Node.js", color: "#68a063" },
      { name: "Python", color: "#3776ab" },
      { name: "Docker", color: "#2496ed" },
      { name: "Git", color: "#f05032" },
      { name: "LLMs", color: "#9E6752" },
      { name: "Agent Systems", color: "#FED7A5" },
      { name: "RAG", color: "#ec4899" },
      { name: "Vector DBs", color: "#eab308" },
      { name: "LangChain", color: "#FED7A5" },
      { name: "JavaScript", color: "#f7df1e" },
      { name: "HTML5/CSS3", color: "#e34c26" },
      { name: "Tailwind", color: "#38bdf8" },
      { name: "Express.js", color: "#f43f5e" },
      { name: "SQL/NoSQL", color: "#14b8a6" },
      { name: "Linux CLI", color: "#f97316" }
    ];

    const skillSprites = [];
    const count = skillsList.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    function createTextSprite(text, color) {
      const canvasEl = document.createElement('canvas');
      canvasEl.width = 256;
      canvasEl.height = 80;
      const ctx = canvasEl.getContext('2d');

      ctx.clearRect(0, 0, 256, 80);

      const grad = ctx.createLinearGradient(0, 0, 256, 80);
      grad.addColorStop(0, 'rgba(12, 12, 22, 0.88)');
      grad.addColorStop(1, 'rgba(6, 6, 12, 0.94)');

      ctx.fillStyle = grad;
      ctx.strokeStyle = color + "60";
      ctx.lineWidth = 4;

      const x = 6, y = 6, w = 244, h = 68, r = 18;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Space Grotesk", "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.fillText(text, 128, 40);

      const texture = new THREE.CanvasTexture(canvasEl);
      texture.minFilter = THREE.LinearFilter;

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(material);
      sprite.scale.set(1.4, 0.44, 1);
      return sprite;
    }

    skillsList.forEach((skill, i) => {
      const sprite = createTextSprite(skill.name, skill.color);

      // Fibonacci sphere distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * 2 * i / goldenRatio;

      const radius = 2.4;
      sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
      sprite.position.y = radius * Math.sin(phi) * Math.sin(theta);
      sprite.position.z = radius * Math.cos(phi);

      sprite.userData = {
        phi,
        theta,
        radius,
        name: skill.name,
        color: skill.color
      };

      globeGroup.add(sprite);
      skillSprites.push(sprite);
    });

    // Drag controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.002, y: 0.004 };
    let targetRotationVelocity = { x: 0.002, y: 0.004 };

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      targetRotationVelocity.y = deltaMove.x * 0.005;
      targetRotationVelocity.x = deltaMove.y * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch drag support
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;

      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };

      targetRotationVelocity.y = deltaMove.x * 0.007;
      targetRotationVelocity.x = deltaMove.y * 0.007;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Raycast hover tracking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredSprite = null;

    canvas.addEventListener('mousemove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(skillSprites);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (hoveredSprite !== obj) {
          if (hoveredSprite) {
            gsap.to(hoveredSprite.scale, { x: 1.4, y: 0.44, duration: 0.3, ease: "power2.out" });
          }
          hoveredSprite = obj;
          gsap.to(hoveredSprite.scale, { x: 1.75, y: 0.55, duration: 0.3, ease: "power2.out" });
          canvas.style.cursor = 'pointer';
        }
      } else {
        if (hoveredSprite) {
          gsap.to(hoveredSprite.scale, { x: 1.4, y: 0.44, duration: 0.3, ease: "power2.out" });
          hoveredSprite = null;
        }
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    });

    // Window resize handler
    function handleResize() {
      const w = container.clientWidth;
      const h = container.clientHeight || w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      if (isDragging) {
        globeGroup.rotation.y += targetRotationVelocity.y;
        globeGroup.rotation.x += targetRotationVelocity.x;

        rotationVelocity.x = targetRotationVelocity.x;
        rotationVelocity.y = targetRotationVelocity.y;
      } else {
        rotationVelocity.x += (0.001 - rotationVelocity.x) * 0.05;
        rotationVelocity.y += (0.003 - rotationVelocity.y) * 0.05;

        globeGroup.rotation.x += rotationVelocity.x;
        globeGroup.rotation.y += rotationVelocity.y;
      }

      // Floating oscillation
      const time = Date.now() * 0.001;
      skillSprites.forEach((sprite) => {
        if (sprite !== hoveredSprite) {
          const data = sprite.userData;
          const offset = Math.sin(time * 1.5 + data.theta * 5) * 0.06;
          const radius = data.radius + offset;
          sprite.position.x = radius * Math.sin(data.phi) * Math.cos(data.theta);
          sprite.position.y = radius * Math.sin(data.phi) * Math.sin(data.theta);
          sprite.position.z = radius * Math.cos(data.phi);
        }
      });

      renderer.render(scene, camera);
    }

    animate();
  }

  initSkillsGlobe();
});
