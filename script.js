// Verify libraries
if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded. Ensure three.min.js is sourced correctly.');
    throw new Error('Three.js not defined');
}
if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded. Ensure gsap.min.js is sourced correctly.');
    throw new Error('GSAP not defined');
}

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('scene-container').appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// Scenes
const scenes = {
    voter: new THREE.Scene(),
    proof: new THREE.Scene(),
    watermark: new THREE.Scene(),
    casting: new THREE.Scene(),
    counting: new THREE.Scene(),
    verification: new THREE.Scene()
};

// Lighting (enhanced with shadows)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
Object.values(scenes).forEach(scene => {
    scene.add(ambientLight.clone());
    scene.add(directionalLight.clone());
});

// Scene Objects (Impressively Real)
// Voter Scene: Holographic Voter with Interactive Console
const voterBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
    new THREE.MeshStandardMaterial({ color: 0x00bfff, metalness: 0.8, roughness: 0.2, emissive: 0x003366 })
);
voterBody.position.set(-2, 1, 0);
voterBody.castShadow = true;
scenes.voter.add(voterBody);
const voterHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x00bfff, metalness: 0.8, roughness: 0.2, emissive: 0x003366 })
);
voterHead.position.set(-2, 2.2, 0);
scenes.voter.add(voterHead);
const consoleBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.5, 1),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 })
);
consoleBase.position.set(2, 0.25, 0);
consoleBase.castShadow = true;
scenes.voter.add(consoleBase);
const consoleScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.8),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, emissive: 0x00bfff, transparent: true, opacity: 0.9 })
);
consoleScreen.position.set(2, 0.75, 0.01);
scenes.voter.add(consoleScreen);

// Proof of Person Scene: Metallic ID with Holographic Chip
const idCardBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 3.5),
    new THREE.MeshStandardMaterial({ color: 0x4682b4, metalness: 0.95, roughness: 0.05, envMapIntensity: 1 })
);
idCardBase.position.set(0, 0, 0);
idCardBase.castShadow = true;
scenes.proof.add(idCardBase);
const idHolo = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
);
idHolo.position.set(0, 0.2, 0);
scenes.proof.add(idHolo);
const idChip = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.2, 0.05, 64, 8),
    new THREE.MeshStandardMaterial({ color: 0x00bfff, emissive: 0x003366, metalness: 0.8, roughness: 0.2 })
);
idChip.position.set(0.8, 0.1, 1);
scenes.proof.add(idChip);

// Watermarked Document Scene: Glossy Ballot with Animated Seal
const ballotBase = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.05, 3),
    new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x00bfff, shininess: 100, transparent: true, opacity: 0.9 })
);
ballotBase.position.set(0, 0, 0);
ballotBase.castShadow = true;
scenes.watermark.add(ballotBase);
const watermarkSeal = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.1, 16, 32),
    new THREE.MeshStandardMaterial({ color: 0x00bfff, emissive: 0x003366, metalness: 0.7, roughness: 0.3 })
);
watermarkSeal.position.set(0, 0.1, 0);
scenes.watermark.add(watermarkSeal);

// Secure Vote Casting Scene: Futuristic Terminal with Glowing Panel
const machineBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 2, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x4682b4, metalness: 0.9, roughness: 0.1 })
);
machineBody.position.set(0, 0, 0);
machineBody.rotation.x = Math.PI / 2;
machineBody.castShadow = true;
scenes.casting.add(machineBody);
const votePanel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 1.2),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, emissive: 0x00bfff, transparent: true, opacity: 0.8 })
);
votePanel.position.set(0, 1.1, 0);
scenes.casting.add(votePanel);
const panelFrame = new THREE.Mesh(
    new THREE.RingGeometry(1.3, 1.4, 32),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 })
);
panelFrame.position.set(0, 1.1, 0);
scenes.casting.add(panelFrame);

// Secure Vote Counting Scene: Crystalline Vault with Holo-Display
const vaultBody = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 2),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, shininess: 150, specular: 0x444444, transparent: true, opacity: 0.8 })
);
vaultBody.position.set(0, 0, 0);
vaultBody.castShadow = true;
scenes.counting.add(vaultBody);
const tallyHolo = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0x00bfff, transparent: true, opacity: 0.7 })
);
tallyHolo.position.set(0, 2, 0.1);
scenes.counting.add(tallyHolo);

// Paper Verification Scene: Stacked Papers with Scanner Beam
const paperBase = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1.5),
    new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x00bfff, shininess: 50 })
);
paperBase.position.set(0, 0, 0);
paperBase.castShadow = true;
scenes.verification.add(paperBase);
const scannerBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 3, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.4 })
);
scannerBeam.position.set(0, 0.5, 0);
scannerBeam.rotation.z = Math.PI / 2;
scenes.verification.add(scannerBeam);

// Checkmarks (per scene)
const checkGeometry = new THREE.BufferGeometry();
const checkVertices = new Float32Array([-0.7, 0, 0, 0, 1.2, 0, 0.7, 0, 0]);
checkGeometry.setAttribute('position', new THREE.BufferAttribute(checkVertices, 3));
const checkMaterial = new THREE.LineBasicMaterial({ color: 0x00bfff, linewidth: 6 });
const checks = {};
Object.keys(scenes).forEach(key => {
    const check = new THREE.Line(checkGeometry, checkMaterial);
    check.position.set(0, 3, 0);
    check.scale.set(0, 0, 0);
    scenes[key].add(check);
    checks[key] = check;
});

// Animation State
let currentScene = scenes.voter;
let stage = -1;

// Animation Timeline with GSAP
function playDemo() {
    const tl = gsap.timeline({ onComplete: () => stage = 6 });

    // Voter Scene: Holographic Activation
    tl.set({}, { onStart: () => currentScene = scenes.voter })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(voterBody.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1, yoyo: true, repeat: 1 }, 0)
      .to(consoleScreen, { opacity: 1, duration: 1, ease: "power2.in" }, 0.5)
      .to(checks.voter.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2);

    // Proof of Person Scene: ID Scan
    tl.set({}, { onStart: () => currentScene = scenes.proof })
      .to(camera.position, { x: 0, y: 5, z: 8, duration: 2, ease: "power3.inOut" })
      .to(idCardBase.rotation, { y: "+=6.28", duration: 2, ease: "power2.inOut" }, "<")
      .to(idHolo, { opacity: 0.8, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(idChip.rotation, { x: "+=12.56", duration: 2, ease: "power2.inOut" }, "<")
      .to(checks.proof.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Watermarked Document Scene: Ballot Stamp
    tl.set({}, { onStart: () => currentScene = scenes.watermark })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(ballotBase.position, { y: 0.5, duration: 1, ease: "bounce.out" }, "<")
      .to(watermarkSeal.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(watermarkSeal.rotation, { z: "+=6.28", duration: 2, ease: "power2.inOut" }, "<")
      .to(checks.watermark.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Secure Vote Casting Scene: Terminal Activation
    tl.set({}, { onStart: () => currentScene = scenes.casting })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(machineBody.rotation, { y: "+=3.14", duration: 2, ease: "power2.inOut" }, "<")
      .to(votePanel.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(checks.casting.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Secure Vote Counting Scene: Vault Pulse
    tl.set({}, { onStart: () => currentScene = scenes.counting })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(vaultBody.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(tallyHolo, { opacity: 1, duration: 1, ease: "power2.in" }, "<")
      .to(checks.counting.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Paper Verification Scene: Scanner Sweep
    tl.set({}, { onStart: () => currentScene = scenes.verification })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(paperBase.position, { y: 0.3, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(scannerBeam.scale, { y: 1.5, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(checks.verification.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(currentScene, camera);
}
animate();

// Interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(currentScene.children.filter(obj => obj.isMesh));
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        gsap.to(intersects[0].object.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });
    } else {
        document.body.style.cursor = 'default';
        currentScene.children.filter(obj => obj.isMesh).forEach(obj =>
            gsap.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.3 })
        );
    }
});

renderer.domElement.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(currentScene.children.filter(obj => obj.isMesh));
    if (intersects.length > 0) {
        gsap.killTweensOf(camera.position);
        gsap.to(camera.position, { x: 0, y: 5, z: 8, duration: 1, ease: "power2.inOut" });
    }
});

document.getElementById('start-button').addEventListener('click', () => {
    if (stage === -1 || stage === 6) {
        stage = 0;
        Object.values(checks).forEach(check => check.scale.set(0, 0, 0));
        camera.position.set(0, 10, 20);
        camera.lookAt(0, 0, 0);
        playDemo();
    }
});

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
