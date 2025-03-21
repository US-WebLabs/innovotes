// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);
camera.position.z = 20;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Crystal Globe
const globeGeometry = new THREE.IcosahedronGeometry(5, 2);
const globeMaterial = new THREE.MeshPhongMaterial({
    color: 0x00bfff,
    transparent: true,
    opacity: 0.5,
    shininess: 100,
    wireframe: true
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Data Stream Particles
const particleCount = 3000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    velocities[i * 3 + 1] = Math.random() * 0.05 + 0.02; // Upward flow
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({ color: 0xe0e0e0, size: 0.1, transparent: true, opacity: 0.7 });
const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Holographic Panels
const panelGeometry = new THREE.PlaneGeometry(4, 2);
const panelMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
const panels = [];
const panelPositions = [[-8, 3, 0], [0, 3, 0], [8, 3, 0]];
for (let i = 0; i < 3; i++) {
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(...panelPositions[i]);
    panels.push(panel);
    scene.add(panel);
}

// Vote Pipeline
const pipeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 32);
const pipeMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.3 });
const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
pipe.rotation.x = Math.PI / 2;
pipe.position.set(0, -5, 0);
scene.add(pipe);

const vaultGeometry = new THREE.BoxGeometry(2, 2, 2);
const vaultMaterial = new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 });
const vault = new THREE.Mesh(vaultGeometry, vaultMaterial);
vault.position.set(0, -10, 0);
scene.add(vault);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.02;

    // Globe
    globe.rotation.y += 0.005;

    // Particle Flow
    const posArray = particles.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        if (posArray[i * 3 + 1] > 20) {
            posArray[i * 3 + 1] = -20;
            posArray[i * 3] = (Math.random() - 0.5) * 20;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
    }
    particles.attributes.position.needsUpdate = true;

    // Panels
    panels.forEach((p, i) => {
        p.position.y = 3 + Math.sin(time + i) * 0.5;
    });

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Vote Demo
document.getElementById('vote-button').addEventListener('click', () => {
    const ballot = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x00bfff })
    );
    ballot.position.set(0, 5, 0);
    scene.add(ballot);

    let t = 0;
    const voteAnim = () => {
        t += 0.05;
        ballot.position.y -= t;
        if (ballot.position.y < -10) {
            scene.remove(ballot);
            vault.scale.set(1.2, 1.2, 1.2);
            setTimeout(() => vault.scale.set(1, 1, 1), 200);
        } else {
            requestAnimationFrame(voteAnim);
        }
    };
    voteAnim();
});

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
