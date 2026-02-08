import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  calculateOrbitPoints,
  calculateEarthOrbit,
  scaleDistance,
  parseOrbitalData,
  getAsteroidPosition
} from '../utils/orbitalCalculations';
import './OrbitVisualization.css';

// Sun component
const Sun = () => {
  return (
    <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#FDB813"
        emissive="#FDB813"
        emissiveIntensity={2}
      />
      <Html distanceFactor={10}>
        <div className="orbit-label">☀️ Sun</div>
      </Html>
    </Sphere>
  );
};

// Earth component
const Earth = ({ orbitPoints }) => {
  const meshRef = useRef();
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime((t) => (t + delta * 0.1) % 1);
  });

  const index = Math.floor(time * orbitPoints.length);
  const position = orbitPoints[index] || { x: 1, y: 0, z: 0 };

  return (
    <Sphere
      ref={meshRef}
      args={[0.3, 32, 32]}
      position={[scaleDistance(position.x), position.y, scaleDistance(position.z)]}
    >
      <meshStandardMaterial color="#4A90E2" />
      <Html distanceFactor={10}>
        <div className="orbit-label">🌍 Earth</div>
      </Html>
    </Sphere>
  );
};

// Asteroid component
const Asteroid = ({ orbitPoints, name }) => {
  const meshRef = useRef();
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime((t) => (t + delta * 0.15) % 1);
  });

  const index = Math.floor(time * orbitPoints.length);
  const position = orbitPoints[index] || { x: 1.5, y: 0, z: 0 };

  return (
    <Sphere
      ref={meshRef}
      args={[0.15, 16, 16]}
      position={[scaleDistance(position.x), position.y, scaleDistance(position.z)]}
    >
      <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
      <Html distanceFactor={10}>
        <div className="orbit-label asteroid-label">☄️ {name}</div>
      </Html>
    </Sphere>
  );
};

// Orbit path component
const OrbitPath = ({ points, color = '#6366F1' }) => {
  const scaledPoints = points.map(p => 
    new THREE.Vector3(scaleDistance(p.x), p.y, scaleDistance(p.z))
  );

  return (
    <Line
      points={scaledPoints}
      color={color}
      lineWidth={2}
      opacity={0.6}
      transparent
    />
  );
};

// Main 3D scene
const Scene = ({ asteroidData, asteroidName }) => {
  const earthOrbit = calculateEarthOrbit(100);
  const orbitalParams = parseOrbitalData(asteroidData);
  const asteroidOrbit = calculateOrbitPoints(
    orbitalParams.semiMajorAxis,
    orbitalParams.eccentricity,
    100
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      <pointLight position={[20, 20, 20]} intensity={0.5} />

      {/* Celestial bodies */}
      <Sun />
      <Earth orbitPoints={earthOrbit} />
      <Asteroid orbitPoints={asteroidOrbit} name={asteroidName} />

      {/* Orbit paths */}
      <OrbitPath points={earthOrbit} color="#4A90E2" />
      <OrbitPath points={asteroidOrbit} color="#E74C3C" />

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
};

// Main component
const OrbitVisualization = ({ asteroid }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!asteroid) return null;

  const asteroidName = asteroid.name?.replace(/[()]/g, '') || 'Asteroid';
  const orbitalData = asteroid.orbital_data;

  return (
    <div className="orbit-visualization-container">
      <div className="orbit-header">
        <h2>🌌 3D Orbital Visualization</h2>
        <button
          className="toggle-btn"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? 'Hide' : 'Show'} 3D View
        </button>
      </div>

      {isVisible && (
        <>
          <div className="orbit-canvas-wrapper">
            <Canvas
              camera={{ position: [20, 15, 20], fov: 50 }}
              style={{ background: '#000000' }}
            >
              <Scene asteroidData={orbitalData} asteroidName={asteroidName} />
            </Canvas>
          </div>

          <div className="orbit-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#FDB813' }}></span>
              <span>Sun</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#4A90E2' }}></span>
              <span>Earth Orbit</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#E74C3C' }}></span>
              <span>Asteroid Orbit</span>
            </div>
          </div>

          <div className="orbit-controls-info">
            <p>🖱️ <strong>Controls:</strong> Drag to rotate • Scroll to zoom • Right-click to pan</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OrbitVisualization;
