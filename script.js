// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Stage 1: Proof of Person
const idGeometry = new THREE.PlaneGeometry(2, 3);
const idMaterial = new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
const idCard = new THREE.Mesh(idGeometry, idMaterial);
idCard.position.set(-12, 0, 0);
scene.add(idCard);

const scanBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 5, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 })
);
scanBeam.position.set(-12, 0, 0);
scanBeam.rotation.z = Math.PI / 2;
scanBeam.visible = false;
scene.add(scanBeam);

// Stage 2: Specialized Watermarked Document
const ballotGeometry = new THREE.PlaneGeometry(2, 3);
const ballotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
const ballot = new THREE.Mesh(ballotGeometry, ballotMaterial);
ballot.position.set(-6, 0, 0);
scene.add(ballot);

const watermark = new THREE.Mesh(
    new THREE.CircleGeometry(1, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 })
);
watermark.position.set(-6, 0, 0.1);
scene.add(watermark);

// Stage 3: Secure Vote Casting
const votingMachine = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.4 })
);
votingMachine.position.set(0, 0, 0);
scene.add(votingMachine);

const voteTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 6, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.3 })
);
voteTube.position.set(3, 0, 0);
voteTube.rotation.z = Math.PI / 2;
scene.add(voteTube);

// Stage 4: Secure Vote Counting
const vault = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshPhongMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 })
);
vault.position.set(9, 0, 0);
scene.add(vault);

const tallyBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })
);
tallyBoard.position.set(9, 2, 0.1);
scene.add(tallyBoard);

// Stage 5: Paper Verification
const paperStack = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
);
paperStack.position.set(15, -0.5, 0);
scene.add(paperStack);

const verifyBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 3, 32),
    new THREE.MeshBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.5 })
);
verifyBeam.position.set(15, 0, 0);
verifyBeam.rotation.z = Math.PI / 2;
verifyBeam.visible = false;
scene.add(verifyBeam);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.02;

    // Stage 1: ID Card Spin
    idCard.rotation.y += 0.02;
    scanBeam.scale.y = 1 + Math.sin(time) * 0.5;

    // Stage 2: Watermark Pulse
    watermark.scale.set(1 + Math.sin(time) * 0.1, 1 + Math.sin(time) * 0.1, 1);

    // Stage 3: Voting Machine Glow
    votingMachine.rotation.y += 0.01;

    // Stage 4: Vault Pulse
    vault.scale.set(1 + Math.sin(time) * 0.05, 1 + Math.sin(time) * 0.05, 1 + Math.sin(time) * 0.05);

    // Stage 5: Paper Stack Shuffle
    paperStack.position.y = -0.5 + Math.sin(time) * 0.1;

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Demo Vote Journey
document.getElementById('vote-button').addEventListener('click', () => {
    const demoBallot = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x00bfff })
    );
    demoBallot.position.set(-12, 0, 0);
    scene.add(demoBallot);

    let stage = 0;
    const voteAnim = () => {
        if (stage === 0 && demoBallot.position.x < -6) {
            demoBallot.position.x += 0.1; // Move to Watermark
        } else if (stage === 0) {
            stage = 1;
            watermark.scale.set(1.5, 1.5, 1);
            setTimeout(() => watermark.scale.set(1, 1, 1), 300);
        } else if (stage === 1 && demoBallot.position.x < 0) {
            demoBallot.position.x += 0.1; // Move to Casting
        } else if (stage === 1) {
            stage = 2;
            votingMachine.scale.set(1.2, 1.2, 1.2);
            setTimeout(() => votingMachine.scale.set(1, 1, 1), 300);
        } else if (stage === 2 && demoBallot.position.x < 9) {
            demoBallot.position.x += 0.1; // Move to Counting
        } else if (stage === 2) {
            stage = 3;
            vault.scale.set(1.2, 1.2, 1.2);
            setTimeout(() => vault.scale.set(1, 1, 1), 300);
        } else if (stage === 3 && demoBallot.position.x < 15) {
            demoBallot.position.x += 0.1; // Move to Verification
        } else if (stage === 3) {
            stage = 4;
            verifyBeam.visible = true;
            setTimeout(() => {
                verifyBeam.visible = false;
                scene.remove(demoBallot);
            }, 500);
        }
        if (stage < 4) requestAnimationFrame(voteAnim);
    };
    voteAnim();
});

// Interactivity
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([idCard, ballot, votingMachine, vault, paperStack]);
    scanBeam.visible = intersects.some(i => i.object === idCard);
    verifyBeam.visible = intersects.some(i => i.object === paperStack);
});

renderer.domElement.addEventListener('click', () => {
    const intersects = raycaster.intersectObjects([idCard, ballot, votingMachine, vault, paperStack]);
    if (intersects.length > 0) {
        const target = intersects[0].object.position.clone();
        target.z += 5; // Zoom in
        camera.position.lerp(target, 0.1);
    }
});

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
