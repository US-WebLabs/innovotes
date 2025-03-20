// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x2a2a2a, 1); // Match logo background

// Camera Position
camera.position.z = 5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3D Ballot Box Model
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x003366, shininess: 100 });
const ballotBox = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(ballotBox);

// Slot on Top
const slotGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.2);
const slotMaterial = new THREE.MeshPhongMaterial({ color: 0x002244 });
const slot = new THREE.Mesh(slotGeometry, slotMaterial);
slot.position.y = 0.525; // Position on top of the box
ballotBox.add(slot);

// Wave (Simplified as a Curved Line)
const waveMaterial = new THREE.LineBasicMaterial({ color: 0xC0C0C0 });
const wavePoints = [];
for (let i = 0; i < 50; i++) {
    const x = i * 0.1 - 2.5;
    const y = Math.sin(i * 0.2) * 0.5;
    const z = 0;
    wavePoints.push(new THREE.Vector3(x, y + 0.5, z));
}
const waveGeometry = new THREE.BufferGeometry().setFromPoints(wavePoints);
const wave = new THREE.Line(waveGeometry, waveMaterial);
ballotBox.add(wave);

// Checkmark (Simplified as Two Lines)
const checkMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000 });
const checkPoints1 = [
    new THREE.Vector3(0.2, 0.5, 0),
    new THREE.Vector3(0, 0.3, 0)
];
const checkPoints2 = [
    new THREE.Vector3(0, 0.3, 0),
    new THREE.Vector3(-0.2, 0.7, 0)
];
const checkGeometry1 = new THREE.BufferGeometry().setFromPoints(checkPoints1);
const checkGeometry2 = new THREE.BufferGeometry().setFromPoints(checkPoints2);
const checkLine1 = new THREE.Line(checkGeometry1, checkMaterial);
const checkLine2 = new THREE.Line(checkGeometry2, checkMaterial);
ballotBox.add(checkLine1);
ballotBox.add(checkLine2);

// Animation and Interactivity
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    ballotBox.rotation.y += 0.01;
    ballotBox.rotation.x = mouseY * 0.5;
    ballotBox.rotation.y += mouseX * 0.5;
    renderer.render(scene, camera);
}
animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Form Submission Alert
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});
