import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Heart, Sparkles, CheckCircle, MessageCircle } from 'lucide-react';
import * as THREE from 'three';

interface Brodi3DCharacterProps {
  message: string;
  type: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
  onDismiss: () => void;
  onEngaged: () => void;
  onActionCompleted?: () => void;
  showActions?: boolean;
}

function BrodiRobot({ expression }: { expression: 'happy' | 'excited' | 'caring' | 'thoughtful' }) {
  const robotRef = useRef<THREE.Group>(null);
  const blushRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time + delta);
    
    if (robotRef.current) {
      // Gentle floating animation
      robotRef.current.position.y = Math.sin(time * 2) * 0.08;
      
      // Gentle side-to-side sway
      robotRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
    }

    // Subtle blush animation for excited/caring states
    if (blushRef.current && (expression === 'excited' || expression === 'caring')) {
      const intensity = 0.7 + Math.sin(time * 3) * 0.3;
      blushRef.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.opacity = intensity;
        }
      });
    }
  });

  const getFaceExpression = () => {
    switch (expression) {
      case 'excited':
        return { 
          eyeType: 'happy', 
          mouthCurve: 0.15,
          blushVisible: true 
        };
      case 'caring':
        return { 
          eyeType: 'soft', 
          mouthCurve: 0.1,
          blushVisible: true 
        };
      case 'thoughtful':
        return { 
          eyeType: 'peaceful', 
          mouthCurve: 0.08,
          blushVisible: false 
        };
      default:
        return { 
          eyeType: 'normal', 
          mouthCurve: 0.12,
          blushVisible: false 
        };
    }
  };

  const face = getFaceExpression();

  return (
    <group ref={robotRef} position={[0, 0, 0]}>
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
        <mesh position={[-0.1, 0.02, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        <mesh position={[0.1, 0.02, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        {/* Eye highlights for different expressions */}
        {face.eyeType === 'happy' && (
          <>
            <mesh position={[-0.08, 0.04, 0.01]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.12, 0.04, 0.01]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </>
        )}

        {/* Mouth - simple curved smile */}
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI * face.mouthCurve]} />
          <meshStandardMaterial color="#5a4a7a" />
        </mesh>

        {/* Blush cheeks */}
        {face.blushVisible && (
          <group ref={blushRef}>
            <mesh position={[-0.18, -0.02, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial 
                color="#ff9bb5" 
                transparent 
                opacity={0.7}
              />
            </mesh>
            <mesh position={[0.18, -0.02, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshStandardMaterial 
                color="#ff9bb5" 
                transparent 
                opacity={0.7}
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

export function Brodi3DCharacter({ 
  message, 
  type, 
  onDismiss, 
  onEngaged, 
  onActionCompleted,
  showActions = true 
}: Brodi3DCharacterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expression, setExpression] = useState<'happy' | 'excited' | 'caring' | 'thoughtful'>('happy');

  useEffect(() => {
    setIsVisible(true);
    
    // Set expression based on interaction type
    switch (type) {
      case 'celebration':
        setExpression('excited');
        break;
      case 'mood_reminder':
        setExpression('caring');
        break;
      case 'nudge':
        setExpression('thoughtful');
        break;
      default:
        setExpression('happy');
    }
  }, [type]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleEngage = () => {
    onEngaged();
    if (onActionCompleted) {
      onActionCompleted();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'celebration':
        return <Sparkles className="h-6 w-6 text-yellow-500" />;
      case 'mood_reminder':
        return <Heart className="h-6 w-6 text-red-400" />;
      case 'task_reminder':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <MessageCircle className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className={`
      fixed bottom-0 right-0 z-50 transition-all duration-500 transform
      ${isVisible ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-8 translate-y-8 opacity-0'}
    `}>
      {/* 3D Brodi Character */}
      <div className="absolute bottom-0 right-0 w-32 h-40">
        <Canvas
          camera={{ position: [2, 2, 4], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[2, 2, 2]} intensity={0.5} color="#fbbf24" />
          
          {/* 3D Brodi Robot */}
          <BrodiRobot expression={expression} />
        </Canvas>
      </div>
      
      {/* Speech bubble */}
      <div className="absolute bottom-20 right-6 w-80">
        <Card className="shadow-xl border-primary/20 bg-card/95 backdrop-blur-sm relative">
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card rotate-45 border-r border-b border-primary/20"></div>
          
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-primary">Brodi</span>
                  {getIcon()}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="ml-auto h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {message}
                </p>
                
                {showActions && (
                  <div className="flex gap-2">
                    {type === 'mood_reminder' && (
                      <Button
                        size="sm"
                        onClick={handleEngage}
                        className="text-xs"
                      >
                        Log Mood
                      </Button>
                    )}
                    {type === 'task_reminder' && (
                      <Button
                        size="sm"
                        onClick={handleEngage}
                        className="text-xs"
                      >
                        View Tasks
                      </Button>
                    )}
                    {type === 'celebration' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEngage}
                        className="text-xs"
                      >
                        Thanks! 😊
                      </Button>
                    )}
                    {(type === 'nudge' || type === 'random') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEngage}
                        className="text-xs"
                      >
                        Tell me more
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}