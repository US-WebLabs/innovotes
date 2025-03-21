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

// Lighting
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
// Step 1: Voter Initiation - "Start the Process"
// Innovotes offers a user-friendly entry point where voters initiate the secure process.
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

// Step 2: Proof of Person - "Verify Your Identity"
// Innovotes ensures only authorized voters participate using advanced ID verification.
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

// Step 3: Specialized Watermarked Document - "Get Your Secure Ballot"
// Innovotes provides tamper-proof ballots with unique watermarks for authenticity.
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

// Step 4: Secure Vote Casting - "Cast Your Vote Safely"
// Innovotes uses cutting-edge tech to encrypt and transmit votes securely.
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

// Step 5: Secure Vote Counting - "See Your Vote Counted"
// Innovotes ensures transparent, real-time vote tallying with no tampering.
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

// Step 6: Paper Verification - "Confirm with Paper Backup"
// Innovotes offers a physical paper trail to double-check digital results.
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

// Checkmarks
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

// Font Loader (Helvetica for professional look)
const fontLoader = new THREE.FontLoader();
let font;
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
    font = loadedFont;
    initText();
});

// Instructional Text with Explanations
const textObjects = {};
function initText() {
    const instructions = {
        voter: "Step 1: Start the Process\nInnovotes begins with a secure voter entry point.",
        proof: "Step 2: Verify Your Identity\nOnly authorized voters proceed with advanced ID checks.",
        watermark: "Step 3: Get Your Secure Ballot\nReceive a tamper-proof ballot with a unique watermark.",
        casting: "Step 4: Cast Your Vote Safely\nYour vote is encrypted and stored securely.",
        counting: "Step 5: See Your Vote Counted\nTransparent, real-time tallying ensures accuracy.",
        verification: "Step 6: Confirm with Paper Backup\nA paper trail verifies the digital count."
    };
    Object.keys(scenes).forEach(key => {
        const textGeometry = new THREE.TextGeometry(instructions[key], {
            font: font,
            size: 0.4,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: false
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-3, 4, 0);
        textMesh.scale.set(0, 0, 0);
        scenes[key].add(textMesh);
        textObjects[key] = textMesh;
    });
}

// Animation State
let currentScene = scenes.voter;
let stage = -1;
let timeline;

// Animation Timeline with GSAP
function playDemo() {
    const startButton = document.getElementById('start-button');
    gsap.to(startButton, { opacity: 0, duration: 0.5, ease: "power2.in", onComplete: () => startButton.style.display = 'none' });

    if (timeline) timeline.kill();
    timeline = gsap.timeline({ onComplete: () => stage = 6 });

    // Step 1: Voter Initiation
    timeline.set({}, { onStart: () => currentScene = scenes.voter })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(voterBody.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1, yoyo: true, repeat: 1 }, 0)
      .to(consoleScreen, { opacity: 1, duration: 1, ease: "power2.in" }, 0.5)
      .to(textObjects.voter.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 0)
      .to(checks.voter.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2)
      .to({}, { duration: 3, id: "voterPause" }); // Pause for reading

    // Step 2: Proof of Person
    timeline.set({}, { onStart: () => currentScene = scenes.proof })
      .to(textObjects.voter.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in" })
      .to(camera.position, { x: 0, y: 5, z: 8, duration: 2, ease: "power3.inOut" })
      .to(idCardBase.rotation, { y: "+=6.28", duration: 2, ease: "power2.inOut" }, "<")
      .to(idHolo, { opacity: 0.8, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(idChip.rotation, { x: "+=12.56", duration: 2, ease: "power2.inOut" }, "<")
      .to(textObjects.proof.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, "<")
      .to(checks.proof.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2)
      .to({}, { duration: 3, id: "proofPause" });

    // Step 3: Watermarked Document
    timeline.set({}, { onStart: () => currentScene = scenes.watermark })
      .to(textObjects.proof.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in" })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(ballotBase.position, { y: 0.5, duration: 1, ease: "bounce.out" }, "<")
      .to(watermarkSeal.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(watermarkSeal.rotation, { z: "+=6.28", duration: 2, ease: "power2.inOut" }, "<")
      .to(textObjects.watermark.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, "<")
      .to(checks.watermark.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2)
      .to({}, { duration: 3, id: "watermarkPause" });

    // Step 4: Secure Vote Casting
    timeline.set({}, { onStart: () => currentScene = scenes.casting })
      .to(textObjects.watermark.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in" })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(machineBody.rotation, { y: "+=3.14", duration: 2, ease: "power2.inOut" }, "<")
      .to(votePanel.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(textObjects.casting.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, "<")
      .to(checks.casting.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2)
      .to({}, { duration: 3, id: "castingPause" });

    // Step 5: Secure Vote Counting
    timeline.set({}, { onStart: () => currentScene = scenes.counting })
      .to(textObjects.casting.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in" })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(vaultBody.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(tallyHolo, { opacity: 1, duration: 1, ease: "power2.in" }, "<")
      .to(textObjects.counting.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, "<")
      .to(checks.counting.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2)
      .to({}, { duration: 3, id: "countingPause" });

    // Step 6: Paper Verification
    timeline.set({}, { onStart: () => currentScene = scenes.verification })
      .to(textObjects.counting.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in" })
      .to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power3.inOut" })
      .to(paperBase.position, { y: 0.3, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(scannerBeam.scale, { y: 1.5, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(textObjects.verification.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, "<")
      .to(checks.verification.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2)
      .to({}, { duration: 3, id: "verificationPause" });
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
    if (stage === -1 || stage === 6) return; // Ignore clicks before demo starts or after it ends
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(currentScene.children.filter(obj => obj.isMesh));
    if (intersects.length > 0 || true) { // Click anywhere to advance
        switch (stage) {
            case 0: timeline.seek("proofPause"); stage = 1; break;
            case 1: timeline.seek("watermarkPause"); stage = 2; break;
            case 2: timeline.seek("castingPause"); stage = 3; break;
            case 3: timeline.seek("countingPause"); stage = 4; break;
            case 4: timeline.seek("verificationPause"); stage = 5; break;
            case 5: timeline.seek(timeline.duration()); stage = 6; break;
        }
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
