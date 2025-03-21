// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);
camera.position.set(0, 10, 20);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Voter (Holographic Figure)
const voterGeometry = new THREE.SphereGeometry(0.8, 32, 32); // Head
const voterMaterial = new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.6, shininess: 100 });
const voter = new THREE.Mesh(voterGeometry, voterMaterial);
voter.position.set(-15, 1.5, 0);
scene.add(voter);
const voterBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2, 32), voterMaterial);
voterBody.position.set(-15, 0, 0);
scene.add(voterBody);
const beginOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.8 })
);
beginOrb.position.set(-14, 1, 0);
scene.add(beginOrb);

// Stage 1: Proof of Person (Metallic ID Card)
const idCard = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 3.5),
    new THREE.MeshPhongMaterial({ color: 0x4682b4, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.9 })
);
idCard.position.set(-10, 0, 0);
scene.add(idCard);
const idChip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff })
);
idChip.position.set(-10, 0.1, 0);
scene.add(idChip);

// Stage 2: Watermarked Document (Glossy Ballot)
const ballot = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.05, 3),
    new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x00bfff, shininess: 50, transparent: true, opacity: 0.9 })
);
ballot.position.set(-5, 0, 0);
scene.add(ballot);
const watermark = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.1, 16, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.7 })
);
watermark.position.set(-5, 0.1, 0);
scene.add(watermark);

// Stage 3: Secure Vote Casting (Futuristic Terminal)
const votingMachine = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 2, 32, 1, true),
    new THREE.MeshPhongMaterial({ color: 0x4682b4, metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.6 })
);
votingMachine.position.set(0, 0, 0);
votingMachine.rotation.x = Math.PI / 2;
scene.add(votingMachine);
const votePanel = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.8 })
);
votePanel.position.set(0, 1.1, 0);
scene.add(votePanel);

// Stage 4: Secure Vote Counting (Crystalline Vault)
const vault = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2, 1),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.7, shininess: 100 })
);
vault.position.set(8, 0, 0);
scene.add(vault);
const tallyDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
);
tallyDisplay.position.set(8, 2, 0.1);
scene.add(tallyDisplay);

// Stage 5: Paper Verification (Glossy Stack)
const paperStack = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 1.5),
    new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x00bfff, shininess: 30, transparent: true, opacity: 0.9 })
);
paperStack.position.set(14, 0, 0);
scene.add(paperStack);
const verifyBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 3, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 })
);
verifyBeam.position.set(14, 0, 0);
verifyBeam.rotation.z = Math.PI / 2;
verifyBeam.visible = false;
scene.add(verifyBeam);

// Checkmarks
const checkGeometry = new THREE.BufferGeometry();
const checkVertices = new Float32Array([
    -0.5, 0, 0, 0, 1, 0, 0.5, 0, 0
]);
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

// Animation State
let stage = -1;
let animTime = 0;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (stage >= 0) animTime += 0.02;

    // Stage 0: Voter Initiation
    if (stage === 0 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(-15, 5, 10), 0.05);
        beginOrb.scale.set(1 + Math.sin(animTime * 2) * 0.2, 1 + Math.sin(animTime * 2) * 0.2, 1 + Math.sin(animTime * 2) * 0.2);
        voter.rotation.y += 0.02;
    } else if (stage === 0 && animTime >= 2) {
        stage = 1;
        animTime = 0;
        checks[0].scale.set(1, 1, 1);
    }

    // Stage 1: Proof of Person
    if (stage === 1 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(-10, 5, 10), 0.05);
        idCard.rotation.y += 0.03;
        idChip.rotation.z += 0.1;
        idCard.scale.set(1 + Math.sin(animTime) * 0.05, 1, 1 + Math.sin(animTime) * 0.05);
    } else if (stage === 1 && animTime >= 2) {
        stage = 2;
        animTime = 0;
        checks[1].scale.set(1, 1, 1);
    }

    // Stage 2: Watermarked Document
    if (stage === 2 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(-5, 5, 10), 0.05);
        watermark.rotation.z += 0.05;
        ballot.position.y = Math.sin(animTime) * 0.2;
    } else if (stage === 2 && animTime >= 2) {
        stage = 3;
        animTime = 0;
        checks[2].scale.set(1, 1, 1);
    }

    // Stage 3: Secure Vote Casting
    if (stage === 3 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(0, 5, 10), 0.05);
        votingMachine.rotation.y += 0.01;
        votePanel.scale.set(1 + Math.sin(animTime * 2) * 0.1, 1 + Math.sin(animTime * 2) * 0.1, 1);
    } else if (stage === 3 && animTime >= 2) {
        stage = 4;
        animTime = 0;
        checks[3].scale.set(1, 1, 1);
    }

    // Stage 4: Secure Vote Counting
    if (stage === 4 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(8, 5, 10), 0.05);
        vault.rotation.y += 0.02;
        tallyDisplay.scale.set(1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1, 1);
    } else if (stage === 4 && animTime >= 2) {
        stage = 5;
        animTime = 0;
        checks[4].scale.set(1, 1, 1);
    }

    // Stage 5: Paper Verification
    if (stage === 5 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(14, 5, 10), 0.05);
        paperStack.position.y = Math.sin(animTime) * 0.1;
        verifyBeam.visible = true;
        verifyBeam.scale.y = 1 + Math.sin(animTime * 2) * 0.5;
    } else if (stage === 5 && animTime >= 2) {
        stage = 6;
        animTime = 0;
        verifyBeam.visible = false;
    }

    renderer.render(scene, camera);
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
        intersects[0].object.scale.set(1.1, 1.1, 1.1);
    } else {
        document.body.style.cursor = 'default';
        [voter, idCard, ballot, votingMachine, vault, paperStack].forEach(obj => obj.scale.set(1, 1, 1));
    }
});

renderer.domElement.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([voter, idCard, ballot, votingMachine, vault, paperStack]);
    if (intersects.length > 0) {
        const target = intersects[0].object;
        if (target === voter) stage = 0;
        else if (target === idCard) stage = 1;
        else if (target === ballot) stage = 2;
        else if (target === votingMachine) stage = 3;
        else if (target === vault) stage = 4;
        else if (target === paperStack) stage = 5;
        animTime = 0;
    }
});

document.getElementById('start-button').addEventListener('click', () => {
    if (stage === -1 || stage === 6) {
        stage = 0;
        animTime = 0;
        checks.forEach(check => check.scale.set(0, 0, 0));
        camera.position.set(0, 10, 20);
    }
});

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
