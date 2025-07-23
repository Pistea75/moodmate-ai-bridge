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
  const antennaRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time + delta);
    
    if (robotRef.current) {
      // Gentle floating animation
      robotRef.current.position.y = Math.sin(time * 2) * 0.1;
      
      // Expression-based rotations
      switch (expression) {
        case 'excited':
          robotRef.current.rotation.y = Math.sin(time * 4) * 0.2;
          break;
        case 'caring':
          robotRef.current.rotation.x = Math.sin(time * 1.5) * 0.05;
          break;
        case 'thoughtful':
          robotRef.current.rotation.y = Math.sin(time * 0.8) * 0.1;
          break;
        default:
          robotRef.current.rotation.y = Math.sin(time * 1.2) * 0.1;
      }
    }

    // Antenna animation
    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(time * 3) * 0.3;
    }

    // Arm animations
    if (leftArmRef.current && rightArmRef.current) {
      if (expression === 'excited') {
        leftArmRef.current.rotation.z = Math.sin(time * 6) * 0.5 - 0.3;
        rightArmRef.current.rotation.z = Math.sin(time * 6 + Math.PI) * 0.5 + 0.3;
      } else {
        leftArmRef.current.rotation.z = Math.sin(time * 2) * 0.1 - 0.2;
        rightArmRef.current.rotation.z = Math.sin(time * 2 + Math.PI) * 0.1 + 0.2;
      }
    }
  });

  const getBodyColor = () => {
    switch (expression) {
      case 'excited': return '#22c55e'; // green
      case 'caring': return '#3b82f6';   // blue
      case 'thoughtful': return '#8b5cf6'; // purple
      default: return 'hsl(var(--primary))'; // primary
    }
  };

  const getEyeText = () => {
    switch (expression) {
      case 'excited': return '★ ★';
      case 'caring': return '◕ ◕';
      case 'thoughtful': return '◐ ◑';
      default: return '• •';
    }
  };

  return (
    <group ref={robotRef} position={[0, 0, 0]}>
      {/* Body - Main cylinder */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1.2, 16]} />
        <meshStandardMaterial color={getBodyColor()} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Head - Sphere */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#f8f9fa" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Screen/Face */}
      <mesh position={[0, 0.3, 0.36]}>
        <planeGeometry args={[0.5, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Eyes - Text on screen */}
      <Text
        position={[0, 0.3, 0.37]}
        fontSize={0.15}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.woff"
      >
        {getEyeText()}
      </Text>

      {/* Antenna */}
      <group ref={antennaRef} position={[0, 0.65, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        {/* Antenna tip */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.5, 0, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.5, 0, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Medical Cross on chest */}
      <group position={[0, -0.3, 0.51]}>
        <mesh>
          <boxGeometry args={[0.15, 0.05, 0.02]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.05, 0.15, 0.02]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Body details - horizontal lines */}
      <mesh position={[0, -0.7, 0.51]}>
        <boxGeometry args={[0.3, 0.03, 0.01]} />
        <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
      </mesh>
      <mesh position={[0, -0.85, 0.51]}>
        <boxGeometry args={[0.2, 0.02, 0.01]} />
        <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>
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