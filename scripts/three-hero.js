/* ==========================================================================
   THUGIL TRENDY BOUTIQUE - 3D TEMPLE PILLARS & CINEMATIC HERO
   High-Visibility Dravidian Horse/Yaali Architectural Pillars
   Framing Left & Right of the Hero with Dramatic Warm Temple Lighting
   ========================================================================== */

class TempleHero3D {
  constructor() {
    this.canvas = document.getElementById('hero-webgl-canvas');
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.leftPillar = null;
    this.rightPillar = null;
    this.dirLight = null;
    this.ambientLight = null;

    this.isLoaded = false;
    this.animationProgress = 0;
    this.isOpening = true;
    this.scrollProgress = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Configuration for prominent, high-visibility pillars
    this.config = {
      closedDistance: 1.2,
      openDistanceDesktop: 4.8,
      openDistanceTablet: 3.4,
      openDistanceMobile: 2.2,
      pillarScaleDesktop: 2.1,
      pillarScaleMobile: 1.4,
      animationDuration: 2.8
    };

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight;
    const aspect = width / height;

    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0.4, 8.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.setupLighting();
    this.loadPillars();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('scroll', () => this.onScroll());

    this.lastTime = performance.now();
    this.animate();
  }

  setupLighting() {
    // Ambient light - bright warm illumination
    this.ambientLight = new THREE.AmbientLight(0xFFF0DD, 1.4);
    this.scene.add(this.ambientLight);

    // Hemisphere light (Warm gold sky, deep maroon bounce)
    const hemiLight = new THREE.HemisphereLight(0xFFE8CC, 0x651C32, 1.2);
    this.scene.add(hemiLight);

    // Key Light: Warm Golden Sunbeam from front-right
    this.dirLight = new THREE.DirectionalLight(0xFFE2A8, 3.2);
    this.dirLight.position.set(6, 9, 6);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);

    // Fill Light: Gold architectural rim light from left
    const leftFill = new THREE.DirectionalLight(0xD4AF37, 2.8);
    leftFill.position.set(-6, 7, 5);
    this.scene.add(leftFill);

    // Center Gold Sanctum Glow
    const centerPoint = new THREE.PointLight(0xFFA834, 2.5, 15);
    centerPoint.position.set(0, 0, 3);
    this.scene.add(centerPoint);
  }

  loadPillars() {
    const loader = new THREE.GLTFLoader();
    const modelPath = 'assets/models/temple_pillar.glb';

    loader.load(
      modelPath,
      (gltf) => {
        const baseModel = gltf.scene;

        baseModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.65;
              child.material.metalness = 0.2;
              child.material.color.setHex(0xEED9C4); // Lighter, vivid stone color
            }
          }
        });

        // Left Pillar - facing inward
        this.leftPillar = baseModel.clone();
        this.leftPillar.rotation.y = Math.PI * 0.28;

        // Right Pillar - mirrored facing inward
        this.rightPillar = baseModel.clone();
        this.rightPillar.rotation.y = -Math.PI * 0.28;

        const scale = this.getPillarScale();
        this.leftPillar.scale.set(scale, scale, scale);
        this.rightPillar.scale.set(scale, scale, scale);

        const initialOffset = this.config.closedDistance;
        const initialY = this.getPillarY();
        this.leftPillar.position.set(-initialOffset, initialY, 0.5);
        this.rightPillar.position.set(initialOffset, initialY, 0.5);

        this.scene.add(this.leftPillar);
        this.scene.add(this.rightPillar);

        this.isLoaded = true;
        this.startTime = performance.now();
      },
      undefined,
      () => {
        this.setupProceduralFallback();
      }
    );
  }

  setupProceduralFallback() {
    const group = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.6,
      metalness: 0.2
    });

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 7, 16), stoneMat);
    group.add(shaft);
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.4), stoneMat);
    base.position.y = -3.5;
    group.add(base);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.6), stoneMat);
    cap.position.y = 3.5;
    group.add(cap);

    this.leftPillar = group.clone();
    this.rightPillar = group.clone();

    const scale = this.getPillarScale();
    this.leftPillar.scale.set(scale, scale, scale);
    this.rightPillar.scale.set(scale, scale, scale);

    this.scene.add(this.leftPillar);
    this.scene.add(this.rightPillar);
    this.isLoaded = true;
    this.startTime = performance.now();
  }

  getPillarScale() {
    const width = window.innerWidth;
    if (width < 768) return this.config.pillarScaleMobile;
    return this.config.pillarScaleDesktop;
  }

  getPillarY() {
    const width = window.innerWidth;
    if (width < 768) return -3.2;
    return -3.6;
  }

  getTargetDistance() {
    const width = window.innerWidth;
    if (width < 768) return this.config.openDistanceMobile;
    if (width < 1024) return this.config.openDistanceTablet;
    return this.config.openDistanceDesktop;
  }

  onResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    if (this.leftPillar && this.rightPillar) {
      const scale = this.getPillarScale();
      this.leftPillar.scale.set(scale, scale, scale);
      this.rightPillar.scale.set(scale, scale, scale);
    }
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = window.innerHeight;
    this.scrollProgress = Math.min(scrollTop / heroHeight, 1.5);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    this.lastTime = now;

    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    if (this.isLoaded && this.leftPillar && this.rightPillar) {
      if (this.isOpening) {
        const elapsed = (now - this.startTime) / 1000;
        const raw = Math.min(elapsed / this.config.animationDuration, 1);
        this.animationProgress = 1 - Math.pow(1 - raw, 3);

        if (raw >= 1) this.isOpening = false;
      }

      const targetDist = this.getTargetDistance();
      const currentDist = THREE.MathUtils.lerp(
        this.config.closedDistance,
        targetDist,
        this.animationProgress
      );

      const scrollX = this.scrollProgress * 0.8;
      const scrollY = this.scrollProgress * 0.6;
      const baseY = this.getPillarY() - scrollY;

      this.leftPillar.position.set(-currentDist - scrollX, baseY, 0.5);
      this.rightPillar.position.set(currentDist + scrollX, baseY, 0.5);

      // Subtle dynamic tilt
      this.leftPillar.rotation.y = (Math.PI * 0.28) + (this.mouseX * 0.1);
      this.rightPillar.rotation.y = (-Math.PI * 0.28) + (this.mouseX * 0.1);

      this.camera.position.x = this.mouseX * 0.2;
      this.camera.position.y = 0.4 - (this.mouseY * 0.12);
      this.camera.lookAt(0, 0, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.templeHero = new TempleHero3D();
});
