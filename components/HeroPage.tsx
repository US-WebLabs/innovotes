import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BillClause, AlertType, AlertMessage } from '../types';

interface HeroPageProps {
  clauses: BillClause[];
  onNavigateToProposals: () => void;
  addAlert: (message: string, type: AlertType) => void;
}

const HeroPage: React.FC<HeroPageProps> = ({ clauses, onNavigateToProposals, addAlert }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedClause, setSelectedClause] = useState<BillClause | null>(null);
  const [clauseVoteStatus, setClauseVoteStatus] = useState<Record<string, 'for' | 'against'>>({});

  const interactableObjects = useRef<THREE.Mesh[]>([]); // To store meshes for raycasting

  // Debounce function
  const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise(resolve => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => resolve(func(...args)), waitFor);
      });
  };
  
  // Debounced addAlert
  const debouncedAddAlert = useCallback(debounce(addAlert, 500), [addAlert]);


  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a2a, 10, 30); // Dark blue fog

    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xaaaaff, 0.5); // Bluish tint
    directionalLight.position.set(-5, 3, 2);
    scene.add(directionalLight);


    // Central "Bill" representation
    const billGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 16);
    const billMaterial = new THREE.MeshPhongMaterial({ color: 0x334155, emissive: 0x1e293b, shininess: 50 });
    const billMesh = new THREE.Mesh(billGeometry, billMaterial);
    billMesh.position.y = -0.5; // Slightly lower
    scene.add(billMesh);

    // Clause objects
    interactableObjects.current = []; // Clear previous objects
    clauses.forEach(clause => {
      const isVoted = clauseVoteStatus[clause.id];
      let clauseColor = 0x059669; // Default: Emerald
      if (isVoted === 'for') clauseColor = 0x22c55e; // Green
      if (isVoted === 'against') clauseColor = 0xef4444; // Red

      const clauseGeometry = new THREE.SphereGeometry(0.5, 32, 16);
      const clauseMaterial = new THREE.MeshPhongMaterial({ color: clauseColor, emissive: isVoted ? clauseColor : 0x111827, opacity: 0.9, transparent: true });
      const clauseMesh = new THREE.Mesh(clauseGeometry, clauseMaterial);
      clauseMesh.position.set(...clause.position);
      clauseMesh.userData = { id: clause.id, type: 'clause' }; // For identification
      scene.add(clauseMesh);
      interactableObjects.current.push(clauseMesh);
    });

    // Raycaster for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if (!currentMount) return;
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects.current);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object as THREE.Mesh;
        if (clickedObject.userData.type === 'clause') {
          const foundClause = clauses.find(c => c.id === clickedObject.userData.id);
          setSelectedClause(foundClause || null);
          
          // Visual feedback on click
           interactableObjects.current.forEach(obj => {
            (obj.material as THREE.MeshPhongMaterial).emissive.setHex(clauseVoteStatus[obj.userData.id] ? (obj.material as THREE.MeshPhongMaterial).color.getHex() : 0x111827);
          });
          if (foundClause && !clauseVoteStatus[foundClause.id]) {
             (clickedObject.material as THREE.MeshPhongMaterial).emissive.setHex(0xffff00); // Yellow highlight if not voted
          }
        }
      } else {
        setSelectedClause(null); // Clicked on empty space
      }
    };
    currentMount.addEventListener('click', onMouseClick);
    
    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate clauses subtly
      interactableObjects.current.forEach((obj, index) => {
        obj.position.y = clauses[index].position[1] + Math.sin(elapsedTime * 0.5 + index) * 0.2;
        obj.rotation.y += 0.005;
      });
      billMesh.rotation.y += 0.002;


      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeEventListener('click', onMouseClick);
      if (renderer.domElement.parentElement === currentMount) {
         currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose geometries and materials if necessary
      billGeometry.dispose();
      billMaterial.dispose();
      clauses.forEach(() => { // Assuming same geometry for all clauses
        const clauseGeom = interactableObjects.current[0]?.geometry;
        if(clauseGeom) clauseGeom.dispose();
      });
      interactableObjects.current.forEach(obj => (obj.material as THREE.Material).dispose());
    };
  }, [clauses, clauseVoteStatus]); // Re-run effect if clauses or their vote status change

  const handleClauseVote = (clauseId: string, vote: 'for' | 'against') => {
    setClauseVoteStatus(prev => ({ ...prev, [clauseId]: vote }));
    const clause = clauses.find(c => c.id === clauseId);
    debouncedAddAlert(`You voted '${vote}' for "${clause?.title}". (This is a demo vote)`, AlertType.INFO);
    setSelectedClause(null); // Close overlay after voting
  };

  return (
    <div className="hero min-h-screen bg-base-200 relative">
      <div ref={mountRef} className="absolute inset-0 z-0"></div>
      <div className="hero-content text-center text-neutral-content relative z-10 flex flex-col justify-between h-full py-8">
        <div className="max-w-md mt-auto"> {/* Pushes title down for better visibility */}
          <h1 className="mb-2 text-5xl font-bold text-shadow">Innovotes: The People's Bill</h1>
          <p className="mb-5 text-lg text-shadow-sm">
            Explore the key elements of the "Big Beautiful Bill." Click on a sphere to learn more and cast a symbolic vote.
          </p>
        </div>
        
        <button onClick={onNavigateToProposals} className="btn btn-primary btn-lg mt-auto mb-8">
          View All Official Proposals
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {selectedClause && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20" onClick={() => setSelectedClause(null)}>
          <div className="card w-96 bg-base-100 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="card-body">
              <h2 className="card-title">{selectedClause.title}</h2>
              <p>{selectedClause.summary}</p>
              {!clauseVoteStatus[selectedClause.id] ? (
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-success" onClick={() => handleClauseVote(selectedClause.id, 'for')}>Vote For</button>
                  <button className="btn btn-error" onClick={() => handleClauseVote(selectedClause.id, 'against')}>Vote Against</button>
                </div>
              ) : (
                <p className="mt-4 font-semibold">You voted: <span className={`uppercase ${clauseVoteStatus[selectedClause.id] === 'for' ? 'text-success' : 'text-error'}`}>{clauseVoteStatus[selectedClause.id]}</span></p>
              )}
               <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setSelectedClause(null)}>✕</button>
            </div>
          </div>
        </div>
      )}
       <style>{`
        .text-shadow { text-shadow: 0px 2px 4px rgba(0,0,0,0.5); }
        .text-shadow-sm { text-shadow: 0px 1px 2px rgba(0,0,0,0.4); }
      `}</style>
    </div>
  );
};

export default HeroPage;
