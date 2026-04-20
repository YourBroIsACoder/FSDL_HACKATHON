import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

function DCBox({ boxData }) {
  const meshRef = useRef()
  const matRef = useRef()
  
  // y pos goes down as level increases
  const targetY = -boxData.level * 2;
  const targetX = boxData.xOffset * 1.5;
  const initX = targetX; 
  
  // Start slightly higher to animate falling down
  useEffect(() => {
     if(meshRef.current) {
        if(boxData.level > 0) {
           meshRef.current.position.y = targetY + 2;
           meshRef.current.scale.setScalar(0.1);
        } else {
           meshRef.current.position.y = targetY;
        }
     }
  }, [boxData.id]);

  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 10 * delta;
        meshRef.current.position.x += (targetX - meshRef.current.position.x) * 10 * delta;
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 5);
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2 + boxData.level) * 0.05;
    }
  })

  // Width is based on number of elements
  const boxWidth = boxData.width * 1.4;

  return (
    <group position={[targetX, targetY, 0]}>
      <mesh ref={meshRef}>
        {/* glowing slab */}
        <boxGeometry args={[boxWidth, 0.8, 1]} />
        <meshStandardMaterial 
          ref={matRef} 
          color={PALETTE.voidBlack}
          emissive={PALETTE.plasmaTeal}
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
        
        <Html position={[0, 0, 0.6]} center className="pointer-events-none">
          <div style={{ 
            color: '#fff', 
            fontFamily: 'JetBrains Mono', 
            fontSize: '16px', 
            fontWeight: 'bold',
            letterSpacing: '2px',
            whiteSpace: 'nowrap',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textShadow: `0 0 10px ${PALETTE.plasmaTeal}`
          }}>
            [ {boxData.arr.join(', ')} ]
          </div>
        </Html>
      </mesh>
    </group>
  )
}

export default function DivConqScene() {
  const dcBoxes = useAppStore(s => s.dcBoxes)

  // Initialize if empty
  const boxesToRender = dcBoxes.length > 0 ? dcBoxes : [{ id: 'root', level: 0, xOffset: 0, width: 8, arr: [8,3,5,4,7,1,2,6] }];

  return (
    <group position={[0, 4, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 10]} intensity={1.5} />
      
      {boxesToRender.map(b => (
        <DCBox key={b.id} boxData={b} />
      ))}
    </group>
  )
}
