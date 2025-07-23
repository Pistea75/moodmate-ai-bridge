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
  const heartRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time + delta);
    
    if (robotRef.current) {
      // Gentle floating animation
      robotRef.current.position.y = Math.sin(time * 2) * 0.05;
      
      // Expression-based subtle movements
      switch (expression) {
        case 'excited':
          robotRef.current.rotation.y = Math.sin(time * 4) * 0.1;
          break;
        case 'caring':
          robotRef.current.rotation.x = Math.sin(time * 1.5) * 0.02;
          break;
        default:
          robotRef.current.rotation.y = Math.sin(time * 1.2) * 0.05;
      }
    }

    // Heart pulse animation for excited/caring states
    if (heartRef.current && (expression === 'excited' || expression === 'caring')) {
      const scale = 1 + Math.sin(time * 4) * 0.1;
      heartRef.current.scale.set(scale, scale, scale);
    }
  });

  const getHelmetColor = () => {
    return '#4c5a7a'; // Dark blue-purple from the image
  };

  const getFaceExpression = () => {
    const faceGeometry = new THREE.PlaneGeometry(0.4, 0.3);
    const faceMaterial = new THREE.MeshBasicMaterial({ 
      color: '#4c5a7a',
      transparent: true
    });

    switch (expression) {
      case 'excited':
        return { eyes: '♥ ♥', mouth: '◡', color: '#ff6b8a' };
      case 'caring':
        return { eyes: '◕ ◕', mouth: '◡', color: '#4c5a7a' };
      case 'thoughtful':
        return { eyes: '~ ~', mouth: '◡', color: '#4c5a7a' };
      default:
        return { eyes: '◡ ◡', mouth: '◡', color: '#4c5a7a' };
    }
  };

  const face = getFaceExpression();

  return (
    <group ref={robotRef} position={[0, 0, 0]}>
      {/* Main body - rounded and soft */}
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.4, 0.6, 4, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Helmet/Head - larger rounded helmet */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Helmet visor - dark blue oval */}
      <mesh position={[0, 0.15, 0.35]} rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
        <meshStandardMaterial color={getHelmetColor()} roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Face - cute expression inside visor */}
      <group position={[0, 0.15, 0.45]}>
        {/* Eyes */}
        <Text
          position={[-0.08, 0.05, 0]}
          fontSize={0.06}
          color={face.color}
          anchorX="center"
          anchorY="middle"
        >
          {face.eyes.split(' ')[0]}
        </Text>
        <Text
          position={[0.08, 0.05, 0]}
          fontSize={0.06}
          color={face.color}
          anchorX="center"
          anchorY="middle"
        >
          {face.eyes.split(' ')[1]}
        </Text>
        
        {/* Mouth */}
        <Text
          position={[0, -0.05, 0]}
          fontSize={0.08}
          color={face.color}
          anchorX="center"
          anchorY="middle"
        >
          {face.mouth}
        </Text>
      </group>

      {/* Medical heart with cross on chest */}
      <group ref={heartRef} position={[0, -0.1, 0.41]}>
        {/* Heart shape */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ff6b8a" roughness={0.6} />
        </mesh>
        <mesh position={[-0.08, 0.06, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ff6b8a" roughness={0.6} />
        </mesh>
        <mesh position={[0.08, 0.06, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ff6b8a" roughness={0.6} />
        </mesh>
        
        {/* Medical cross on heart */}
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.08, 0.03, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.03, 0.08, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Cute rounded arms */}
      <mesh position={[-0.35, -0.1, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0.35, -0.1, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Cute rounded feet */}
      <mesh position={[-0.15, -0.7, 0.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[0.15, -0.7, 0.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Optional scarf for caring/cold weather expression */}
      {expression === 'caring' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.05, 0]} rotation={[0, 0.2, 0]}>
            <torusGeometry args={[0.4, 0.04, 8, 16]} />
            <meshStandardMaterial color="#ff6b8a" roughness={0.7} />
          </mesh>
          {/* Scarf ends */}
          <mesh position={[-0.3, -0.1, 0.2]} rotation={[0.3, -0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.2, 8]} />
            <meshStandardMaterial color="#ff6b8a" roughness={0.7} />
          </mesh>
        </group>
      )}
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