import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus, Cylinder, Sphere, Float, Center, Trail, Box } from '@react-three/drei';
import * as THREE from 'three';

export const TechCore: React.FC = () => {
  const innerRingRef = useRef<THREE.Group>(null);
  const middleRingRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const dashRingRef = useRef<THREE.Group>(null);
  const corePulseRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth idle rotation for the entire core
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
      groupRef.current.rotation.x = Math.cos(t * 0.2) * 0.2 + Math.PI / 6;
    }
    
    // Rotate rings independently
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = t * 1.2;
    }
    
    if (middleRingRef.current) {
      middleRingRef.current.rotation.y = -t * 0.5;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = t * 0.2;
    }
    
    if (dashRingRef.current) {
      dashRingRef.current.rotation.y = -t * 0.8;
    }

    // Pulse core
    if (corePulseRef.current) {
      const scale = 1 + Math.sin(t * 4) * 0.05;
      corePulseRef.current.scale.set(scale, scale, scale);
      
      const material = corePulseRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 4 + Math.sin(t * 8) * 2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Intense Core Lights */}
      <pointLight position={[0, 0, 0]} color="#00ffff" intensity={150} distance={20} decay={2} />
      <pointLight position={[0, 0, 0]} color="#ff0033" intensity={50} distance={15} decay={2} />
      <ambientLight intensity={0.2} color="#0055ff" />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <Center>
          
          {/* 1. The Central Neural Core (Glassy/Metallic) */}
          <Sphere ref={corePulseRef} args={[0.3, 32, 32]}>
            <meshPhysicalMaterial 
              color="#ffffff" 
              emissive="#00ffff" 
              emissiveIntensity={4} 
              transparent 
              opacity={0.9}
              roughness={0.1}
              metalness={0.8}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Sphere>
          
          {/* Inner protective glass sphere */}
          <Sphere args={[0.45, 32, 32]}>
            <meshPhysicalMaterial 
              color="#002255" 
              transparent 
              opacity={0.2} 
              roughness={0}
              metalness={1}
              transmission={0.9}
              ior={1.5}
            />
          </Sphere>

          {/* 2. Inner Ring */}
          <group ref={innerRingRef}>
            <Torus args={[0.8, 0.03, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={2} metalness={0.8} roughness={0.2} />
            </Torus>
            {/* Small computing nodes on inner ring */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <mesh key={i} position={[0.8 * Math.cos(i * Math.PI / 4), 0, 0.8 * Math.sin(i * Math.PI / 4)]}>
                <boxGeometry args={[0.08, 0.08, 0.08]} />
                <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={5} />
              </mesh>
            ))}
          </group>

          {/* 3. Middle Ring (Wide Metallic) */}
          <group ref={middleRingRef}>
            <Cylinder args={[1.2, 1.2, 0.1, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshPhysicalMaterial 
                color="#111111" 
                metalness={1}
                roughness={0.3}
                clearcoat={0.5}
              />
            </Cylinder>
            <Torus args={[1.2, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={3} />
            </Torus>
          </group>

          {/* 4. Dashed/Segmented Processor Ring */}
          <group ref={dashRingRef}>
            {Array.from({ length: 16 }).map((_, i) => (
              <mesh key={i} rotation={[0, (i * Math.PI * 2) / 16, 0]} position={[0, 0, 0]}>
                <Box args={[0.15, 0.05, 0.3]} position={[1.5, 0, 0]}>
                  <meshPhysicalMaterial color="#222" metalness={0.9} roughness={0.4} emissive="#0055ff" emissiveIntensity={0.5} />
                </Box>
                <Box args={[0.05, 0.06, 0.1]} position={[1.5, 0, 0]}>
                  <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={4} />
                </Box>
              </mesh>
            ))}
          </group>

          {/* 5. Outer Thin Orbiting Data Ring with Trails */}
          <group ref={outerRingRef}>
            <Torus args={[2.2, 0.005, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#0055ff" emissive="#0055ff" emissiveIntensity={2} />
            </Torus>
            {/* Orbiting data packets */}
            <Trail width={0.2} color="#00ffff" length={15} decay={2}>
              <Sphere args={[0.04, 16, 16]} position={[2.2, 0, 0]}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={10} />
              </Sphere>
            </Trail>
            <Trail width={0.2} color="#ff0033" length={15} decay={2}>
              <Sphere args={[0.04, 16, 16]} position={[-2.2, 0, 0]}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={10} />
              </Sphere>
            </Trail>
          </group>

        </Center>
      </Float>
    </group>
  );
};
