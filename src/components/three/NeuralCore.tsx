import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState, useCallback } from 'react'
import { Color, BufferAttribute, AdditiveBlending } from 'three'
import type { Group, Mesh, Points } from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useTheme } from '../../hooks/useTheme'

const PARTICLE_COUNT = 600

function CoreSystem({
  reduced,
  isDark,
  onClick,
}: {
  reduced: boolean
  isDark: boolean
  onClick: () => void
}) {
  const group = useRef<Group>(null)
  const outerMesh = useRef<Mesh>(null)
  const innerMesh = useRef<Mesh>(null)
  const particlesRef = useRef<Points>(null)
  const pointer = useRef({ x: 0, y: 0 })

  // Animation state tracking (0: normal, 0..1: burst, 1..2: circular loop, 2..3: reform)
  const animTime = useRef(0)
  const isAnimating = useRef(false)
  const scaleRef = useRef(1)

  // Pre-generate particle initial directions and ring orbital angles in Cyberpunk AI Reactor palette
  const particleData = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const burstDirs = new Float32Array(PARTICLE_COUNT * 3)
    const ringAngles = new Float32Array(PARTICLE_COUNT)
    const speeds = new Float32Array(PARTICLE_COUNT)

    const torusCyan = new Color(isDark ? '#00B8D9' : '#006B8F')
    const primaryLiquid = new Color(isDark ? '#00D4E8' : '#008FA8')
    const secondaryLiquid = new Color(isDark ? '#008FA8' : '#006B7F')
    const highlightCyan = new Color(isDark ? '#67F3FF' : '#42D9E8')
    const toxicGreen = new Color(isDark ? '#39FF88' : '#6BFF4A')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const dirX = Math.sin(phi) * Math.cos(theta)
      const dirY = Math.sin(phi) * Math.sin(theta)
      const dirZ = Math.cos(phi)

      burstDirs[i * 3] = dirX
      burstDirs[i * 3 + 1] = dirY
      burstDirs[i * 3 + 2] = dirZ

      speeds[i] = 2.5 + Math.random() * 3.5
      ringAngles[i] = Math.random() * Math.PI * 2

      const rand = Math.random()
      // ~8% toxic green accents, rest cyan / electric blue energy
      const c =
        rand > 0.92
          ? toxicGreen
          : rand > 0.65
          ? highlightCyan
          : rand > 0.4
          ? primaryLiquid
          : rand > 0.2
          ? secondaryLiquid
          : torusCyan

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    return { positions, colors, burstDirs, ringAngles, speeds }
  }, [isDark])

  const posAttrRef = useRef<BufferAttribute>(null)

  // Start explosion sequence when clicked
  const handleTrigger = useCallback(() => {
    onClick()
    animTime.current = 0
    isAnimating.current = true
  }, [onClick])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const targetX = state.pointer.x * 0.35
    const targetY = state.pointer.y * 0.22
    pointer.current.x += (targetX - pointer.current.x) * 0.05
    pointer.current.y += (targetY - pointer.current.y) * 0.05

    // Continuous Y-axis revolution
    if (group.current) {
      group.current.rotation.y += delta * (reduced ? 0.15 : 0.95)
      group.current.rotation.x = 0.22 + pointer.current.y
    }

    if (innerMesh.current && !reduced) {
      innerMesh.current.rotation.x = t * 0.8
      innerMesh.current.rotation.z = t * 0.5
    }

    // Interactive Particle Burst -> Loop -> Reform animation loop
    if (isAnimating.current && posAttrRef.current) {
      animTime.current += delta * 1.35
      const currentT = animTime.current
      const pos = posAttrRef.current.array as Float32Array

      // Phase 1: Burst (0.0 to 0.4s)
      if (currentT < 0.4) {
        const progress = currentT / 0.4
        scaleRef.current = Math.max(0, 1 - progress * 1.2)

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const speed = particleData.speeds[i]
          const dx = particleData.burstDirs[i * 3]
          const dy = particleData.burstDirs[i * 3 + 1]
          const dz = particleData.burstDirs[i * 3 + 2]

          pos[i * 3] = dx * speed * progress
          pos[i * 3 + 1] = dy * speed * progress
          pos[i * 3 + 2] = dz * speed * progress
        }
      }
      // Phase 2: Gather into Circular Ring Loop (0.4 to 1.2s)
      else if (currentT < 1.2) {
        const progress = (currentT - 0.4) / 0.8
        const easeP = Math.sin((progress * Math.PI) / 2)
        scaleRef.current = 0

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const speed = particleData.speeds[i]
          const dx = particleData.burstDirs[i * 3]
          const dy = particleData.burstDirs[i * 3 + 1]
          const dz = particleData.burstDirs[i * 3 + 2]

          const bX = dx * speed
          const bY = dy * speed
          const bZ = dz * speed

          const ringA = particleData.ringAngles[i] + currentT * 2.0
          const ringRadius = 2.2 + (i % 5) * 0.12
          const rX = Math.cos(ringA) * ringRadius
          const rY = Math.sin(ringA * 2) * 0.25
          const rZ = Math.sin(ringA) * ringRadius

          pos[i * 3] = bX + (rX - bX) * easeP
          pos[i * 3 + 1] = bY + (rY - bY) * easeP
          pos[i * 3 + 2] = bZ + (rZ - bZ) * easeP
        }
      }
      // Phase 3: Gather & Reform back to center (1.2 to 1.8s)
      else if (currentT < 1.8) {
        const progress = (currentT - 1.2) / 0.6
        const easeP = progress * progress
        scaleRef.current = Math.min(1, (progress - 0.3) * 1.4)

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const ringA = particleData.ringAngles[i] + currentT * 2.0
          const ringRadius = 2.2 + (i % 5) * 0.12
          const rX = Math.cos(ringA) * ringRadius
          const rY = Math.sin(ringA * 2) * 0.25
          const rZ = Math.sin(ringA) * ringRadius

          pos[i * 3] = rX * (1 - easeP)
          pos[i * 3 + 1] = rY * (1 - easeP)
          pos[i * 3 + 2] = rZ * (1 - easeP)
        }
      }
      // Phase 4: Re-formed completely back to original revolving state
      else {
        isAnimating.current = false
        scaleRef.current = 1
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
          pos[i] = 0
        }
      }

      posAttrRef.current.needsUpdate = true
    }

    if (outerMesh.current) {
      const curScale = outerMesh.current.scale.x
      const targetScale = Math.max(0.001, scaleRef.current)
      outerMesh.current.scale.setScalar(curScale + (targetScale - curScale) * 0.2)
    }
  })

  return (
    <group ref={group}>
      <Float speed={reduced ? 0 : 1.4} rotationIntensity={reduced ? 0 : 0.35} floatIntensity={reduced ? 0 : 0.6}>
        <group
          ref={outerMesh}
          onClick={handleTrigger}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          {/* Smoky Translucent Glass Orb Shell */}
          <mesh>
            <icosahedronGeometry args={[1.35, 3]} />
            <meshPhysicalMaterial
              color={isDark ? '#080D16' : '#D8E1EA'}
              transmission={0.96}
              opacity={1}
              transparent={true}
              roughness={0.03}
              ior={1.46}
              thickness={1.5}
              envMapIntensity={1.5}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>

          {/* Electric Orange Torus — Machinery / Core */}
          <mesh ref={innerMesh} scale={0.62}>
            <torusKnotGeometry args={[0.55, 0.16, 180, 24]} />
            <meshStandardMaterial
              color="#ff5500"
              emissive="#ff3300"
              emissiveIntensity={isDark ? 0.5 : 0.25}
              roughness={0.14}
              metalness={0.3}
              envMapIntensity={2}
            />
          </mesh>
        </group>

        {/* Dynamic Burst & Reform Particles System with Toxic Green Accents */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              ref={posAttrRef}
              attach="attributes-position"
              args={[particleData.positions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[particleData.colors, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            vertexColors
            transparent
            opacity={0.9}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </Float>
    </group>
  )
}

function AmbientField({ isDark }: { isDark: boolean }) {
  const attr = useMemo(() => {
    const count = 140
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const r = 2.4 + Math.random() * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return new BufferAttribute(arr, 3)
  }, [])

  const ref = useRef<Points>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={attr} />
      </bufferGeometry>
      {/* Subtle Toxic Green Energy Accent Dots — toneMapped off for accurate HDR signal color */}
      <meshBasicMaterial color={isDark ? '#39FF88' : '#6BFF4A'} toneMapped={false} />
    </points>
  )
}

export function NeuralCore() {
  const reduced = usePrefersReducedMotion()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [hudStatus, setHudStatus] = useState('Click to detonate & reform')

  const handleBurst = useCallback(() => {
    setHudStatus('Bursting → Circular Loop → Re-forming…')
    setTimeout(() => {
      setHudStatus('Click to detonate & reform')
    }, 2200)
  }, [])

  return (
    <div className="neural-core" aria-hidden="true">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 5.2], fov: 35 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={isDark ? 1.0 : 1.25} />
        <spotLight position={[6, 8, 4]} intensity={25} angle={0.4} penumbra={0.8} color="#e0f2fe" />
        <pointLight position={[-4, -2, 3]} intensity={isDark ? 14 : 10} color={isDark ? '#00B8D9' : '#006B8F'} />
        <pointLight position={[4, 3, -2]} intensity={isDark ? 8 : 6} color={isDark ? '#39FF88' : '#6BFF4A'} />
        <Suspense fallback={null}>
          <CoreSystem reduced={reduced} isDark={isDark} onClick={handleBurst} />
          {!reduced ? <AmbientField isDark={isDark} /> : null}
          <Environment preset="city" />
        </Suspense>
        <ContactShadows position={[0, -1.85, 0]} opacity={isDark ? 0.45 : 0.28} scale={8} blur={2.6} far={3.2} color={isDark ? '#080D16' : '#243B53'} />
      </Canvas>

      <div className="glass hero-hud">
        <p>Neural Core</p>
        <strong>Earth Revolution · Interactive 3D</strong>
        <span>{hudStatus}</span>
      </div>
    </div>
  )
}
