import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function LandingBrodiRobot() {
  const robotRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const blushRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  const [blinkTimer, setBlinkTimer] = useState(0);

  useFrame((state, delta) => {
    setTime(time + delta);
    setBlinkTimer(blinkTimer + delta);
    
    if (robotRef.current) {
      // Gentle floating animation (idle)
      robotRef.current.position.y = Math.sin(time * 1.5) * 0.15;
      
      // Gentle side-to-side sway
      robotRef.current.rotation.z = Math.sin(time * 0.8) * 0.08;
      
      // Celebration jump every 8 seconds
      const jumpCycle = Math.sin(time * 0.785); // ~8 second cycle
      if (jumpCycle > 0.95) {
        robotRef.current.position.y += Math.sin(time * 15) * 0.3;
      }
    }

    // Blinking animation
    if (eyesRef.current && blinkTimer > 3) {
      const blinkPhase = (blinkTimer - 3) * 8;
      const eyeScale = blinkPhase < 0.5 ? 1 - blinkPhase * 2 : (blinkPhase - 0.5) * 2;
      eyesRef.current.children.forEach((eye: any) => {
        eye.scale.y = Math.max(0.1, Math.min(1, eyeScale));
      });
      
      if (blinkTimer > 3.5) {
        setBlinkTimer(0);
      }
    }

    // Subtle blush animation
    if (blushRef.current) {
      const intensity = 0.6 + Math.sin(time * 2) * 0.3;
      blushRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.opacity = intensity;
        }
      });
    }
  });

  return (
    <group ref={robotRef} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Main teardrop-shaped head */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
        <meshStandardMaterial 
          color="#8b7cc8" 
          roughness={0.3} 
          metalness={0.1}
        />
      </mesh>

      {/* Rounded sitting body */}
      <group position={[0, -0.4, 0]}>
        {/* Main body blob */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.7]} />
          <meshStandardMaterial 
            color="#8b7cc8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>

        {/* Folded arms/hands */}
        <mesh position={[-0.2, 0.1, 0.3]} rotation={[0.3, -0.3, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color="#8b7cc8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0.2, 0.1, 0.3]} rotation={[0.3, 0.3, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            color="#8b7cc8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>

        {/* Sitting legs/feet */}
        <mesh position={[-0.15, -0.2, 0.2]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="#8b7cc8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0.15, -0.2, 0.2]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="#8b7cc8" 
            roughness={0.3} 
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Face elements */}
      <group position={[0, 0.15, 0.55]}>
        {/* Eyebrows */}
        <mesh position={[-0.12, 0.08, 0]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
          <meshStandardMaterial color="#5a4a7a" />
        </mesh>
        <mesh position={[0.12, 0.08, 0]} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[0.02, 0.08, 4, 8]} />
          <meshStandardMaterial color="#5a4a7a" />
        </mesh>

        {/* Eyes */}
        <group ref={eyesRef}>
          <mesh position={[-0.1, 0.02, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
          <mesh position={[0.1, 0.02, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#2a2a2a" />
          </mesh>
        </group>

        {/* Eye highlights */}
        <mesh position={[-0.08, 0.04, 0.01]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0.04, 0.01]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Mouth - simple curved smile */}
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI * 0.12]} />
          <meshStandardMaterial color="#5a4a7a" />
        </mesh>

        {/* Blush cheeks */}
        <group ref={blushRef}>
          <mesh position={[-0.18, -0.02, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial 
              color="#ff9bb5" 
              transparent 
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0.18, -0.02, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial 
              color="#ff9bb5" 
              transparent 
              opacity={0.8}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}