// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Postprocessing
const composer = new THREE.EffectComposer(renderer);
const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8, // Strength
    0.4, // Radius
    0.85 // Threshold
);
composer.addPass(bloomPass);

camera.position.set(0, 10, 20);

// Physics World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Voter (Simulated GLTF Placeholder)
const voter = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.6, shininess: 100 })
);
voter.position.set(-15, 1.5, 0);
scene.add(voter);
const beginOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff })
);
beginOrb.position.set(-14, 1, 0);
scene.add(beginOrb);

// Stage 1: Proof of Person
const idCard = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 3.5),
    new THREE.MeshStandardMaterial({ color: 0x4682b4, metalness: 0.9, roughness: 0.1 })
);
idCard.position.set(-10, 0, 0);
scene.add(idCard);
const idChip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff })
);
idChip.position.set(-10, 0.1, 0);
scene.add(idChip);

// Stage 2: Watermarked Document (Physics-enabled)
const ballotBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 0.025, 1.5))
});
ballotBody.position.set(-5, 2, 0);
world.addBody(ballotBody);
const ballot = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.05, 3),
    new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x00bfff, shininess: 50 })
);
ballot.position.copy(ballotBody.position);
scene.add(ballot);
const watermark = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.1, 16, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.7 })
);
watermark.position.set(-5, 0.1, 0);
scene.add(watermark);

// Stage 3: Secure Vote Casting
const votingMachine = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 2, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x4682b4, metalness: 0.7, roughness: 0.3 })
);
votingMachine.position.set(0, 0, 0);
votingMachine.rotation.x = Math.PI / 2;
scene.add(votingMachine);
const votePanel = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00bfff })
);
votePanel.position.set(0, 1.1, 0);
scene.add(votePanel);

// Stage 4: Secure Vote Counting
const vault = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 1),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.7, shininess: 100 })
);
vault.position.set(8, 0, 0);
scene.add(vault);
const tallyDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.8),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
);
tallyDisplay.position.set(8, 2, 0.1);
scene.add(tallyDisplay);

// Stage 5: Paper Verification (Physics-enabled)
const paperStackBody = new CANNON.Body({
    mass: 0, // Static
    shape: new CANNON.Box(new CANNON.Vec3(1, 0.25, 0.75))
});
paperStackBody.position.set(14, 0, 0);
world.addBody(paperStackBody);
const paperStack = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1.5),
    new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x00bfff, shininess: 30 })
);
paperStack.position.copy(paperStackBody.position);
scene.add(paperStack);

// Checkmarks
const checkGeometry = new THREE.BufferGeometry();
const checkVertices = new Float32Array([-0.5, 0, 0, 0, 1, 0, 0.5, 0, 0]);
checkGeometry.setAttribute('position', new THREE.BufferAttribute(checkVertices, 3));
const checkMaterial = new THREE.LineBasicMaterial({ color: 0x00bfff, linewidth: 5 });
const checks = [];
const checkPositions = [-10, -5, 0, 8, 14];
for (let i = 0; i < 5; i++) {
    const check = new THREE.Line(checkGeometry, checkMaterial);
    check.position.set(checkPositions[i], 2.5, 0);
    check.scale.set(0, 0, 0);
    checks.push(check);
    scene.add(check);
}

// Animation Timeline with GSAP
function playDemo() {
    const tl = gsap.timeline({ onComplete: () => stage = 6 });

    // Stage 0: Voter Initiation
    tl.to(camera.position, { x: -15, y: 5, z: 10, duration: 2, ease: "power2.inOut" })
      .to(beginOrb.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1, yoyo: true, repeat: 1 }, 0)
      .to(checks[0].scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }, 2);

    // Stage 1: Proof of Person
    tl.to(camera.position, { x: -10, y: 5, z: 10, duration: 2, ease: "power2.inOut" })
      .to(idCard.rotation, { y: "+=6.28", duration: 2, ease: "power2.inOut" }, "<")
      .to(idChip.rotation, { z: "+=12.56", duration: 2, ease: "power2.inOut" }, "<")
      .to(checks[1].scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Stage 2: Watermarked Document
    tl.to(camera.position, { x: -5, y: 5, z: 10, duration: 2, ease: "power2.inOut" })
      .to(ballotBody.position, { y: 0, duration: 2, ease: "bounce.out" }, "<")
      .to(watermark.rotation, { z: "+=6.28", duration: 2, ease: "power2.inOut" }, "<")
      .to(checks[2].scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Stage 3: Secure Vote Casting
    tl.to(camera.position, { x: 0, y: 5, z: 10, duration: 2, ease: "power2.inOut" })
      .to(votingMachine.rotation, { y: "+=3.14", duration: 2, ease: "power2.inOut" }, "<")
      .to(votePanel.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(checks[3].scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Stage 4: Secure Vote Counting
    tl.to(camera.position, { x: 8, y: 5, z: 10, duration: 2, ease: "power2.inOut" })
      .to(vault.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(tallyDisplay.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(checks[4].scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" });

    // Stage 5: Paper Verification
    tl.to(camera.position, { x: 14, y: 5, z: 10, duration: 2, ease: "power2.inOut" })
      .to(paperStack.position, { y: 0.2, duration: 1, yoyo: true, repeat: 1 }, "<")
      .to(checks[4].scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out" }); // Reuse check for simplicity
}

// Animation Loop
let stage = -1;
function animate() {
    requestAnimationFrame(animate);

    // Physics Step
    world.step(1 / 60);
    ballot.position.copy(ballotBody.position);
    ballot.quaternion.copy(ballotBody.quaternion);
    paperStack.position.copy(paperStackBody.position);
    paperStack.quaternion.copy(paperStackBody.quaternion);

    composer.render();
}
animate();

// Interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([voter, idCard, ballot, votingMachine, vault, paperStack]);
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        gsap.to(intersects[0].object.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3 });
    } else {
        document.body.style.cursor = 'default';
        [voter, idCard, ballot, votingMachine, vault, paperStack].forEach(obj =>
            gsap.to(obj.scale, { x: 1, y: 1, z: 1, duration: 0.3 })
        );
    }
});

renderer.domElement.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([voter, idCard, ballot, votingMachine, vault, paperStack]);
    if (intersects.length > 0) {
        const target = intersects[0].object;
        gsap.killTweensOf(camera.position);
        if (target === voter) gsap.to(camera.position, { x: -15, y: 5, z: 10, duration: 1 });
        else if (target === idCard) gsap.to(camera.position, { x: -10, y: 5, z: 10, duration: 1 });
        else if (target === ballot) gsap.to(camera.position, { x: -5, y: 5, z: 10, duration: 1 });
        else if (target === votingMachine) gsap.to(camera.position, { x: 0, y: 5, z: 10, duration: 1 });
        else if (target === vault) gsap.to(camera.position, { x: 8, y: 5, z: 10, duration: 1 });
        else if (target === paperStack) gsap.to(camera.position, { x: 14, y: 5, z: 10, duration: 1 });
    }
});

document.getElementById('start-button').addEventListener('click', () => {
    if (stage === -1 || stage === 6) {
        stage = 0;
        checks.forEach(check => check.scale.set(0, 0, 0));
        camera.position.set(0, 10, 20);
        playDemo();
    }
});

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
