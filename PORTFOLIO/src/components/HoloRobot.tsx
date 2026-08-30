import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Float, MeshDistortMaterial, Center } from '@react-three/drei';
import * as THREE from 'three';

export const HoloRobot: React.FC = () => {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Gentle floating and bobbing
    if (headRef.current) {
      headRef.current.position.y = Math.sin(t * 2) * 0.1 + 1.2;
      headRef.current.rotation.y = t * 0.2;
    }
    
    if (bodyRef.current) {
      bodyRef.current.rotation.y = -t * 0.1;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = Math.sin(t * 0.5) * 0.2 + Math.PI / 2;
      outerRingRef.current.rotation.z = t * 0.5;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = Math.cos(t * 0.5) * 0.2 + Math.PI / 2;
      innerRingRef.current.rotation.z = -t * 0.8;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Central Holographic Glow */}
      <pointLight position={[0, 1, 0]} color="#00d8ff" intensity={50} distance={10} decay={2} />
      <pointLight position={[0, 1, 0]} color="#ff0033" intensity={20} distance={5} decay={2} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Center>
          {/* Head */}
          <Sphere ref={headRef} args={[0.5, 32, 32]} position={[0, 1.2, 0]}>
            <MeshDistortMaterial 
              color="#00d8ff"
              wireframe
              emissive="#00d8ff"
              emissiveIntensity={2}
              transparent
              opacity={0.8}
              distort={0.2}
              speed={2}
            />
          </Sphere>

          {/* Eyes (Glowing solid spheres inside head) */}
          <group position={[0, 1.2, 0.4]}>
            <Sphere args={[0.08, 16, 16]} position={[-0.2, 0, 0]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
            </Sphere>
            <Sphere args={[0.08, 16, 16]} position={[0.2, 0, 0]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
            </Sphere>
          </group>

          {/* Body */}
          <group ref={bodyRef}>
            <Sphere args={[0.8, 24, 24]} position={[0, 0, 0]} scale={[1, 1.2, 0.8]}>
              <meshStandardMaterial 
                color="#00d8ff"
                wireframe
                emissive="#0055ff"
                emissiveIntensity={1}
                transparent
                opacity={0.4}
              />
            </Sphere>
            
            {/* Inner Core */}
            <Sphere args={[0.4, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial 
                color="#ff0033"
                wireframe
                emissive="#ff0033"
                emissiveIntensity={2}
                transparent
                opacity={0.6}
              />
            </Sphere>
          </group>
        </Center>
      </Float>

      {/* Orbiting Rings Base */}
      <group position={[0, -1.2, 0]}>
        <Cylinder ref={outerRingRef} args={[1.5, 1.5, 0.02, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={1} wireframe />
        </Cylinder>
        <Cylinder ref={innerRingRef} args={[1.2, 1.2, 0.05, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={0.5} transparent opacity={0.5} />
        </Cylinder>
        
        {/* Hologram Projector Light */}
        <pointLight position={[0, 0.5, 0]} color="#00d8ff" intensity={30} distance={3} decay={2} />
        <Cylinder args={[0.2, 0.5, 0.2, 32]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </Cylinder>
      </group>
    </group>
  );
};
