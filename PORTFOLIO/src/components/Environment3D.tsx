import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// --- Particle System (Red/Blue flowing upwards) ---
function Particles({ count = 200 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions, speeds, and colors
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 40;
      const speed = 0.01 + Math.random() * 0.03;
      const isRed = Math.random() > 0.6; // More blue than red
      const color = isRed ? new THREE.Color('#ff0033') : new THREE.Color('#00d8ff');
      temp.push({ x, y, z, speed, color });
    }
    return temp;
  }, [count]);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      p.color.toArray(arr, i * 3);
    });
    return arr;
  }, [particles, count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      particle.y += particle.speed;
      if (particle.y > 50) {
        particle.y = -50;
        particle.x = (Math.random() - 0.5) * 60;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.position.x += Math.sin(particle.y * 2) * 0.01;
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 8, 8]}>
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshBasicMaterial vertexColors toneMapped={false} transparent opacity={0.5} />
    </instancedMesh>
  );
}

// --- Background Robotic Components ---
function RoboticComponents() {
  const servoRef = useRef<THREE.Mesh>(null);
  const gearRef = useRef<THREE.Group>(null);
  const pcbRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (servoRef.current) {
      servoRef.current.rotation.y += delta * 0.2;
    }
    if (gearRef.current) {
      gearRef.current.rotation.z -= delta * 0.1;
    }
    if (pcbRef.current) {
      pcbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group>
      {/* BACKGROUND LAYER (Far away, moves slowly with parallax) */}
      <group position={[0, -10, -35]}>
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          {/* Abstract PCB Grid Plane */}
          <mesh ref={pcbRef} position={[-5, 5, 0]} rotation={[0.2, 0.4, 0]}>
            <planeGeometry args={[30, 30, 10, 10]} />
            <meshStandardMaterial color="#020202" wireframe transparent opacity={0.15} />
          </mesh>
        </Float>
        
        {/* Massive distant structure */}
        <Box args={[10, 40, 2]} position={[15, 0, -10]} rotation={[0, -0.2, 0]}>
          <meshStandardMaterial color="#050505" roughness={0.9} metalness={0.5} />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(10, 40, 2)]} />
            <lineBasicMaterial color="#ff0033" transparent opacity={0.05} />
          </lineSegments>
        </Box>
      </group>

      {/* MIDDLE LAYER (Robotic arms, servos) */}
      <group position={[0, -5, -20]}>
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <Cylinder args={[1, 1, 4, 32]} position={[10, 5, 0]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.9} />
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(1, 1, 4, 32)]} />
              <lineBasicMaterial color="#00d8ff" transparent opacity={0.2} />
            </lineSegments>
          </Cylinder>
        </Float>
        
        <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
          <group ref={gearRef} position={[-12, -8, 2]}>
            <Cylinder args={[2, 2, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#030303" roughness={0.8} metalness={1} />
              <lineSegments>
                <edgesGeometry args={[new THREE.CylinderGeometry(2, 2, 0.5, 16)]} />
                <lineBasicMaterial color="#ff0033" transparent opacity={0.3} />
              </lineSegments>
            </Cylinder>
            <Cylinder args={[0.5, 0.5, 0.8, 16]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
          </group>
        </Float>
      </group>

      {/* FOREGROUND LAYER (Circuit traces, camera modules, mechanical joints) */}
      <group position={[0, 0, -10]}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
          <mesh ref={servoRef} position={[6, -15, 0]}>
            <boxGeometry args={[2, 3, 2]} />
            <meshStandardMaterial color="#050505" roughness={0.7} metalness={0.8} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(2, 3, 2)]} />
              <lineBasicMaterial color="#ff0033" transparent opacity={0.4} />
            </lineSegments>
            
            {/* Pulsing LED on servo */}
            <Sphere args={[0.1, 8, 8]} position={[1, 1, 1]}>
              <meshBasicMaterial color="#ff0033" />
              <pointLight color="#ff0033" intensity={2} distance={3} />
            </Sphere>
          </mesh>
        </Float>

        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.6}>
          <Cylinder args={[0.3, 0.3, 6, 8]} position={[-8, 10, -2]} rotation={[0, 0, Math.PI / 3]}>
            <meshStandardMaterial color="#080808" roughness={0.3} metalness={0.9} />
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.3, 0.3, 6, 8)]} />
              <lineBasicMaterial color="#00d8ff" transparent opacity={0.3} />
            </lineSegments>
          </Cylinder>
        </Float>
      </group>
    </group>
  );
}

// --- Parallax Camera Rig ---
function CameraRig() {
  const { camera, mouse } = useThree();
  const target = new THREE.Vector3();
  const [scrollY, setScrollY] = useState(0);

  // Sync scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Normalise scroll to a workable range (e.g. 0 to 1 based on document height)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      // Map scroll to Y offset. As we scroll down (percent 0->1), camera moves DOWN (y goes negative)
      setScrollY(-scrollPercent * 30); 
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Init
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useFrame((_state, delta) => {
    // Mouse Parallax (X and Y)
    target.x = mouse.x * 1.5;
    target.y = mouse.y * 1.5 + scrollY; // Combine mouse Y with Scroll Y
    
    // Lerp camera position for smooth parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.x, 3 * delta);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, target.y, 3 * delta);
    
    // Keep camera looking straight ahead but slightly shifted
    camera.lookAt(camera.position.x * 0.1, camera.position.y * 0.1, 0);
  });
  
  return null;
}

export const Environment3D: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#020305]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        {/* Dark Environment Fog - creates the depth/blur effect for far objects */}
        <fog attach="fog" args={['#020305', 10, 45]} />

        {/* Cinematic Lighting */}
        <ambientLight intensity={0.1} />
        
        {/* Main Tech Blue Light (Top Right) */}
        <pointLight position={[15, 20, 10]} color="#00d8ff" intensity={1.5} distance={60} />
        
        {/* Deep Neon Red Light (Bottom Left) */}
        <pointLight position={[-15, -15, 5]} color="#ff0033" intensity={2.5} distance={50} />
        
        {/* Violet Core Underglow */}
        <pointLight position={[0, -5, -25]} color="#5a00ff" intensity={3} distance={80} />

        {/* Scene Components */}
        <RoboticComponents />
        <Particles count={300} />
        
        {/* Camera Parallax */}
        <CameraRig />
      </Canvas>
      
      {/* Subtle scanline overlay for the cinematic tech feel */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};
