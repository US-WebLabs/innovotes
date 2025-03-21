// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);
camera.position.set(0, 10, 20);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Voter
const voterGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const voterMaterial = new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.7 });
const voter = new THREE.Mesh(voterGeometry, voterMaterial);
voter.position.set(-15, 1, 0);
scene.add(voter);

// Stage Objects
const idCard = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 3),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
);
idCard.position.set(-10, 0, 0);
scene.add(idCard);

const ballot = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 3),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
);
ballot.position.set(-5, 0, 0);
scene.add(ballot);

const votingMachine = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.4 })
);
votingMachine.position.set(0, 0, 0);
scene.add(votingMachine);

const vault = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 })
);
vault.position.set(8, 0, 0);
scene.add(vault);

const paperStack = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
);
paperStack.position.set(14, -0.5, 0);
scene.add(paperStack);

// Checkmarks
const checkGeometry = new THREE.BufferGeometry();
const checkVertices = new Float32Array([
    -0.5, 0, 0, 0, 1, 0, 0.5, 0, 0 // Simple check shape
]);
checkGeometry.setAttribute('position', new THREE.BufferAttribute(checkVertices, 3));
const checkMaterial = new THREE.LineBasicMaterial({ color: 0x00bfff, linewidth: 5 });
const checks = [];
const checkPositions = [-10, -5, 0, 8, 14];
for (let i = 0; i < 5; i++) {
    const check = new THREE.Line(checkGeometry, checkMaterial);
    check.position.set(checkPositions[i], 2, 0);
    check.scale.set(0, 0, 0); // Start hidden
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
        voter.scale.set(1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1);
    } else if (stage === 0 && animTime >= 2) {
        stage = 1;
        animTime = 0;
        checks[0].scale.set(1, 1, 1);
    }

    // Stage 1: Proof of Person
    if (stage === 1 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(-10, 5, 10), 0.05);
        idCard.rotation.y += 0.05;
        idCard.scale.set(1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1);
    } else if (stage === 1 && animTime >= 2) {
        stage = 2;
        animTime = 0;
        checks[1].scale.set(1, 1, 1);
    }

    // Stage 2: Watermarked Document
    if (stage === 2 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(-5, 5, 10), 0.05);
        ballot.scale.set(1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1);
    } else if (stage === 2 && animTime >= 2) {
        stage = 3;
        animTime = 0;
        checks[2].scale.set(1, 1, 1);
    }

    // Stage 3: Secure Vote Casting
    if (stage === 3 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(0, 5, 10), 0.05);
        votingMachine.rotation.y += 0.02;
        votingMachine.scale.set(1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1);
    } else if (stage === 3 && animTime >= 2) {
        stage = 4;
        animTime = 0;
        checks[3].scale.set(1, 1, 1);
    }

    // Stage 4: Secure Vote Counting
    if (stage === 4 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(8, 5, 10), 0.05);
        vault.scale.set(1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1, 1 + Math.sin(animTime) * 0.1);
    } else if (stage === 4 && animTime >= 2) {
        stage = 5;
        animTime = 0;
        checks[4].scale.set(1, 1, 1);
    }

    // Stage 5: Paper Verification
    if (stage === 5 && animTime < 2) {
        camera.position.lerp(new THREE.Vector3(14, 5, 10), 0.05);
        paperStack.position.y = -0.5 + Math.sin(animTime) * 0.1;
    } else if (stage === 5 && animTime >= 2) {
        stage = 6; // End
        animTime = 0;
    }

    renderer.render(scene, camera);
}
animate();

// Start Demo
document.getElementById('start-button').addEventListener('click', () => {
    if (stage === -1 || stage === 6) {
        stage = 0;
        animTime = 0;
        checks.forEach(check => check.scale.set(0, 0, 0)); // Reset checkmarks
        camera.position.set(0, 10, 20); // Reset camera
    }
});

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
    } else {
        document.body.style.cursor = 'default';
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

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
