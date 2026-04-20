import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/dsStore'
import { PALETTE } from '../../config/assets'

function SortRod({ value, index, total, isHighlighted }) {
  const meshRef = useRef()
  const matRef = useRef()
  
  // Heights and position
  const targetX = index * 1.5 - (total * 1.5) / 2 + 0.75;
  const targetY = value * 0.5; // Base height scaling on value

  // Physics animation via lerp
  useFrame((state, delta) => {
     if(meshRef.current) {
        meshRef.current.position.x += (targetX - meshRef.current.position.x) * 10 * delta;
     }

     if(matRef.current) {
         const targetEmissive = isHighlighted ? PALETTE.moltenOrange : PALETTE.plasmaTeal;
         const targetIntensity = isHighlighted ? 2.0 : 0.8;
         matRef.current.emissive.lerp(new THREE.Color(targetEmissive), delta * 15);
         matRef.current.emissiveIntensity += (targetIntensity - matRef.current.emissiveIntensity) * delta * 10;
     }
  })

  return (
    <group position={[targetX, 0, 0]}> {/* We let the group handle X smoothly via the ref below if needed, but we do it on mesh for simplicity */}
      <mesh ref={meshRef} position={[0, targetY/2, 0]}>
         <cylinderGeometry args={[0.5, 0.5, targetY, 32]} />
         <meshStandardMaterial 
            ref={matRef} 
            color={PALETTE.voidBlack}
            emissive={PALETTE.plasmaTeal}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
         />
         <Html position={[0, targetY/2 + 0.5, 0]} center className="pointer-events-none">
            <div style={{
                color: '#fff',
                fontFamily: 'JetBrains Mono',
                fontSize: '20px',
                fontWeight: 'bold',
                textShadow: `0 0 10px ${isHighlighted ? PALETTE.moltenOrange : PALETTE.plasmaTeal}`
            }}>
                {value}
            </div>
         </Html>
      </mesh>
    </group>
  )
}

export default function SortingScene() {
   const sortArray = useAppStore(s => s.sortArray)
   const sortHighlights = useAppStore(s => s.sortHighlights)

   return (
       <group position={[0, -2, 0]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 10, 5]} intensity={1.5} />
          <pointLight position={[0, -1, 4]} intensity={2} color={PALETTE.plasmaTeal} />

          {sortArray.map((val, idx) => (
              <SortRod 
                 key={`rod-${val}`} 
                 value={val}
                 index={idx}
                 total={sortArray.length}
                 isHighlighted={sortHighlights.includes(idx)}
              />
          ))}
       </group>
   )
}
