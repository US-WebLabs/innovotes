// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Camera Position
camera.position.z = 15;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Globe
const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
const globeMaterial = new THREE.MeshPhongMaterial({
    color: 0x1e90ff, // Blue base for Earth
    shininess: 100,
    wireframe: false
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// US Highlight (Simplified as a glowing ring)
const usRingGeometry = new THREE.RingGeometry(5.1, 5.2, 64);
const usRingMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide });
const usRing = new THREE.Mesh(usRingGeometry, usRingMaterial);
usRing.rotation.x = Math.PI / 2;
scene.add(usRing);

// Particle System
const particleCount = 2000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30; // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30; // z

    // Red, white, blue particles
    const colorChoice = i % 3;
    colors[i * 3] = colorChoice === 0 ? 1 : 0; // r
    colors[i * 3 + 1] = colorChoice === 1 ? 1 : 0; // g
    colors[i * 3 + 2] = colorChoice === 2 ? 1 : 0; // b
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const particleMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Holographic Panels (Simplified as planes)
const panelGeometry = new THREE.PlaneGeometry(3, 1.5);
const panelMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });

const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
panel1.position.set(7, 2, 0);
scene.add(panel1);

const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
panel2.position.set(-7, 2, 0);
scene.add(panel2);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate globe and particles
    globe.rotation.y += 0.005;
    particleSystem.rotation.y += 0.002;

    // Animate panels (hover effect simulation)
    panel1.rotation.y += 0.01;
    panel2.rotation.y -= 0.01;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// CTA Button Interaction
document.getElementById('cta-button').addEventListener('click', () => {
    alert('Welcome to the Future of Voting! Sign up coming soon.');
    // Could transition to a form or video here
});
