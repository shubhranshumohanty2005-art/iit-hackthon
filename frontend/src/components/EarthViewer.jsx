import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { asteroidsAPI, watchlistAPI } from '../services/api';
import './EarthViewer.css';

const EarthViewer = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing Earth...');
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [showClouds, setShowClouds] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showAsteroids, setShowAsteroids] = useState(true);
  const [mapStyle, setMapStyle] = useState('blue-marble');
  const [viewLocation, setViewLocation] = useState('custom');
  const [asteroidData, setAsteroidData] = useState([]);
  const [hoveredAsteroid, setHoveredAsteroid] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [riskFilter, setRiskFilter] = useState('all');
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  // UI Refs for high-frequency updates
  const timeDisplayRef = useRef(null);
  const dateDisplayRef = useRef(null);
  const sunPositionRef = useRef(null);
  const earthRotationRef = useRef(null);
  const viewAngleRef = useRef(null);
  const speedValueRef = useRef(null);

  // Three.js Refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const earthRef = useRef(null);
  const cloudsRef = useRef(null);
  const atmosphereRef = useRef(null);
  const sunLightRef = useRef(null);
  const starsRef = useRef(null);
  const asteroidsGroupRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const frameIdRef = useRef(null);
  const simulatedTimeRef = useRef(new Date());
  const earthRotationOffsetRef = useRef(0);
  
  const mapTextures = {
    'blue-marble': 'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
    'natural': 'https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg',
    'night': 'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg',
    'topology': 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png'
  };

  useEffect(() => {
    fetchAsteroids();
  }, []);

  const fetchAsteroids = async () => {
    try {
      console.log('🚀 Fetching asteroids from backend...');
      setLoadingText('Fetching Asteroid Data...');
      const response = await asteroidsAPI.getAll();
      console.log('📡 API Response:', response);
      console.log('📊 Response data structure:', response.data);
      
      if (response.data && response.data.near_earth_objects) {
        const asteroids = response.data.near_earth_objects;
        console.log('✅ Asteroids received:', asteroids.length, 'asteroids');
        console.log('🔍 First asteroid sample:', asteroids[0]);
        
        setAsteroidData(asteroids);
        
        // Check for critical asteroids and create alerts
        checkForCriticalAsteroids(asteroids);
        
        if (asteroidsGroupRef.current) {
          console.log('🎨 Rendering asteroids to scene...');
          updateAsteroidsVisualization(asteroids);
        } else {
          console.warn('⚠️ Asteroids group ref not ready, will render when scene initializes');
        }
      } else {
        console.warn('⚠️ No asteroid data in response:', response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch asteroids:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  const checkForCriticalAsteroids = (asteroids) => {
    const criticalAsteroids = asteroids.filter(
      a => a.risk_analysis?.level === 'CRITICAL' || a.risk_analysis?.level === 'HIGH'
    );
    
    if (criticalAsteroids.length > 0) {
      const newAlerts = criticalAsteroids.map(asteroid => ({
        id: asteroid.id,
        name: asteroid.name,
        risk: asteroid.risk_analysis?.level,
        message: `${asteroid.risk_analysis?.level} RISK: ${asteroid.name} detected`,
        timestamp: new Date().toISOString()
      }));
      
      setAlerts(newAlerts);
      
      // Play alert sound if enabled
      if (soundEnabled && newAlerts.length > 0) {
        playAlertSound();
      }
    }
  };

  const playAlertSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const getFilteredAsteroids = () => {
    if (riskFilter === 'all') return asteroidData;
    return asteroidData.filter(a => a.risk_analysis?.level === riskFilter.toUpperCase());
  };

  const handleAsteroidClick = (asteroidData) => {
    setSelectedAsteroid(asteroidData);
    setShowDetailsModal(true);
  };

  const handleAddToWatchlist = async () => {
    if (!selectedAsteroid) return;
    
    setAddingToWatchlist(true);
    try {
      await watchlistAPI.addToWatchlist(selectedAsteroid.id);
      
      // Show success alert
      setAlerts(prev => [...prev, {
        id: `success-${Date.now()}`,
        name: selectedAsteroid.name,
        risk: 'INFO',
        message: `Successfully added ${selectedAsteroid.name} to watchlist`,
        timestamp: new Date().toISOString()
      }]);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => !a.id.startsWith('success-')));
      }, 3000);
      
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      alert(error.response?.data?.message || 'Failed to add to watchlist. It may already be in your watchlist.');
    } finally {
      setAddingToWatchlist(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialization
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 3.5;
    controls.maxDistance = 30;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x888888);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(50, 0, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Create objects
    createRealisticEarth(scene);
    createRealisticClouds(scene);
    createAtmosphere(scene);
    createStars(scene);
    
    // Asteroids Group
    const asteroidsGroup = new THREE.Group();
    scene.add(asteroidsGroup);
    asteroidsGroupRef.current = asteroidsGroup;

    // Event Listeners
    const onWindowResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    const onMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onClick = (event) => {
      if (raycasterRef.current && asteroidsGroupRef.current && cameraRef.current) {
        const mouse = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );
        raycasterRef.current.setFromCamera(mouse, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(asteroidsGroupRef.current.children);
        
        if (intersects.length > 0) {
          handleAsteroidClick(intersects[0].object.userData);
        }
      }
    };

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Start Animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, []);

  // Update asteroids when data changes
  useEffect(() => {
    if (asteroidData.length > 0 && asteroidsGroupRef.current) {
      updateAsteroidsVisualization(getFilteredAsteroids());
    }
  }, [asteroidData, riskFilter]);

  // Creation Functions
  const createRealisticEarth = (scene) => {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    setLoadingText('Loading Earth Texture...');
    
    textureLoader.load(
      mapTextures['blue-marble'],
      (texture) => {
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          specular: new THREE.Color(0x333333),
          shininess: 5,
        });

        textureLoader.load(mapTextures['topology'], (normalMap) => {
          if (earthRef.current) {
             earthRef.current.material.normalMap = normalMap;
             earthRef.current.material.normalScale = new THREE.Vector2(0.85, 0.85);
             earthRef.current.material.needsUpdate = true;
          }
        });

        const earth = new THREE.Mesh(geometry, material);
        earth.receiveShadow = true;
        earth.castShadow = true;
        scene.add(earth);
        earthRef.current = earth;
        setLoading(false);
      },
      (xhr) => {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        if (!isNaN(percent)) setLoadingText(`Loading Earth: ${percent}%`);
      },
      (err) => {
        console.error("Texture load failed", err);
        setLoading(false);
      }
    );
  };

  const createRealisticClouds = (scene) => {
    const geometry = new THREE.SphereGeometry(2.01, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load('https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg', (texture) => {
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            opacity: 0.15,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const clouds = new THREE.Mesh(geometry, material);
        scene.add(clouds);
        cloudsRef.current = clouds;
    });
  };

  const createAtmosphere = (scene) => {
    const geometry = new THREE.SphereGeometry(2.15, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphere = new THREE.Mesh(geometry, material);
    scene.add(atmosphere);
    atmosphereRef.current = atmosphere;
  };

  const createStars = (scene) => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true });
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
      vertices.push((Math.random() - 0.5) * 300);
      vertices.push((Math.random() - 0.5) * 300);
      vertices.push((Math.random() - 0.5) * 300);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    starsRef.current = stars;
  };

  const updateAsteroidsVisualization = (asteroids) => {
    console.log('🎨 updateAsteroidsVisualization called with', asteroids.length, 'asteroids');
    
    if (!asteroidsGroupRef.current) {
      console.error('❌ Asteroids group ref is null!');
      return;
    }
    
    console.log('🧹 Clearing existing asteroids...');
    // Clear existing
    while(asteroidsGroupRef.current.children.length > 0){ 
      asteroidsGroupRef.current.remove(asteroidsGroupRef.current.children[0]); 
    }

    console.log('🌟 Creating asteroid meshes...');
    let renderedCount = 0;
    
    asteroids.forEach((asteroid, index) => {
      // Determine color based on risk
      let color = 0x00ff00; // Low risk (green)
      const riskLevel = asteroid.risk_analysis?.level || 'LOW';
      
      if (riskLevel === 'CRITICAL') color = 0xff0000;
      else if (riskLevel === 'HIGH') color = 0xffa500;
      else if (riskLevel === 'MEDIUM') color = 0xffff00;

      // Create asteroid mesh
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: color });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Orbital parameters
      const distance = 4 + Math.random() * 8; // Orbital radius
      const inclination = (Math.random() - 0.5) * Math.PI * 0.5; // Orbital tilt
      const startAngle = Math.random() * Math.PI * 2; // Starting position
      const orbitalSpeed = (0.0001 + Math.random() * 0.0003) * (10 / distance); // Faster when closer
      
      // Store orbital data in userData
      mesh.userData = { 
        id: asteroid.id,
        name: asteroid.name,
        risk: riskLevel,
        missDistance: asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 'Unknown',
        // Orbital parameters
        orbitalRadius: distance,
        orbitalInclination: inclination,
        orbitalAngle: startAngle,
        orbitalSpeed: orbitalSpeed
      };
      
      // Set initial position based on orbital parameters
      mesh.position.x = distance * Math.cos(startAngle) * Math.cos(inclination);
      mesh.position.y = distance * Math.sin(inclination) * Math.sin(startAngle);
      mesh.position.z = distance * Math.sin(startAngle) * Math.cos(inclination);
      
      asteroidsGroupRef.current.add(mesh);
      renderedCount++;
      
      if (index < 3) {
        console.log(`  Asteroid ${index + 1}:`, asteroid.name, 'at position', mesh.position, 'color:', color.toString(16));
      }
    });
    
    console.log('✅ Rendered', renderedCount, 'asteroids to scene');
    console.log('📍 Asteroids group children count:', asteroidsGroupRef.current.children.length);
    console.log('👁️ Asteroids group visible:', asteroidsGroupRef.current.visible);
  };

  // Animation Loop
  const animate = () => {
    frameIdRef.current = requestAnimationFrame(animate);

    if (!earthRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    // Update Controls
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // Update Time
    const now = new Date();
    const deltaMs = 16 * timeMultiplier;
    simulatedTimeRef.current = new Date(simulatedTimeRef.current.getTime() + deltaMs);

    updateUI(simulatedTimeRef.current);
    updatePhysics(simulatedTimeRef.current);

    // Raycasting for hover effect
    if (raycasterRef.current && asteroidsGroupRef.current) {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(asteroidsGroupRef.current.children);
      
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        setHoveredAsteroid(intersects[0].object.userData);
      } else {
        document.body.style.cursor = 'default';
        setHoveredAsteroid(null);
      }
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const updateUI = (time) => {
    if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = time.toLocaleTimeString();
    }
    if (dateDisplayRef.current) {
        dateDisplayRef.current.textContent = time.toLocaleDateString();
    }
  };

  const updatePhysics = (time) => {
      // Rotate Earth based on time
      const dayProgress = (time.getUTCHours() * 3600 + time.getUTCMinutes() * 60 + time.getUTCSeconds()) / 86400;
      const earthRotation = (dayProgress * 360 + earthRotationOffsetRef.current) % 360;
      
      if (earthRef.current) {
          earthRef.current.rotation.y = (earthRotation * Math.PI) / 180;
      }
      
      if (cloudsRef.current) {
          cloudsRef.current.rotation.y = (earthRef.current?.rotation.y || 0) + 0.01;
          cloudsRef.current.rotation.x = earthRef.current?.rotation.x || 0;
      }

      // Animate asteroids in orbit
      if (asteroidsGroupRef.current && asteroidsGroupRef.current.children.length > 0) {
        asteroidsGroupRef.current.children.forEach(asteroid => {
          if (asteroid.userData.orbitalRadius) {
            // Update orbital angle
            asteroid.userData.orbitalAngle += asteroid.userData.orbitalSpeed * timeMultiplier;
            
            // Calculate new position based on orbital mechanics
            const angle = asteroid.userData.orbitalAngle;
            const radius = asteroid.userData.orbitalRadius;
            const inclination = asteroid.userData.orbitalInclination;
            
            asteroid.position.x = radius * Math.cos(angle) * Math.cos(inclination);
            asteroid.position.y = radius * Math.sin(inclination) * Math.sin(angle);
            asteroid.position.z = radius * Math.sin(angle) * Math.cos(inclination);
          }
        });
      }

      // Sun position
      const sunAngle = dayProgress * Math.PI * 2;
      if (sunLightRef.current) {
          sunLightRef.current.position.x = Math.cos(sunAngle) * 50;
          sunLightRef.current.position.z = Math.sin(sunAngle) * 50;
      }
      
      // Update info refs
      if (earthRotationRef.current) earthRotationRef.current.textContent = earthRotation.toFixed(1) + '°';
      if (sunPositionRef.current) sunPositionRef.current.textContent = (sunAngle * 180 / Math.PI).toFixed(1) + '°';
      if (viewAngleRef.current && earthRef.current) viewAngleRef.current.textContent = (earthRef.current.rotation.x * 180 / Math.PI).toFixed(1) + '°';
  };

  // Event Handlers
  const handleMapStyleChange = (e) => {
      const style = e.target.value;
      setMapStyle(style);
      setLoading(true);
      setLoadingText(`Switching to ${style}...`);
      
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(mapTextures[style], (texture) => {
          if (earthRef.current) {
              earthRef.current.material.map = texture;
              earthRef.current.material.needsUpdate = true;
          }
          setLoading(false);
      });
  };

  const handleViewChange = (e) => {
      const val = e.target.value;
      setViewLocation(val);
      if (val === 'custom') return;
      
      const [lat, lon] = val.split(',').map(Number);
      
      if (cameraRef.current && controlsRef.current) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const r = 8;

        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));

        cameraRef.current.position.set(x, y, z);
        controlsRef.current.update();
      }
  };

  return (
    <div 
        className="earth-viewer-container" 
        ref={containerRef}
    >
      {loading && (
        <div className="earth-loading">
          <div className="earth-loading-spinner"></div>
          <div className="earth-loading-text">{loadingText}</div>
        </div>
      )}

      {hoveredAsteroid && (
        <div className="earth-tooltip" style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          padding: '10px 20px',
          borderRadius: '8px',
          color: 'white',
          border: '1px solid #3b82f6',
          zIndex: 100,
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#60a5fa' }}>{hoveredAsteroid.name}</h3>
          <div style={{ fontSize: '12px' }}>Risk: <span style={{ 
            color: hoveredAsteroid.risk === 'CRITICAL' ? '#ef4444' : 
                   hoveredAsteroid.risk === 'HIGH' ? '#f59e0b' : '#22c55e' 
          }}>{hoveredAsteroid.risk}</span></div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Dictance: {Math.round(hoveredAsteroid.missDistance).toLocaleString()} km</div>
        </div>
      )}

      {/* Alert Notifications */}
      {alerts.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '30px',
          maxWidth: '400px',
          zIndex: 100
        }}>
          {alerts.map((alert, index) => (
            <div key={alert.id} style={{
              background: alert.risk === 'CRITICAL' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(245, 158, 11, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '15px 20px',
              borderRadius: '12px',
              marginBottom: '10px',
              border: `2px solid ${alert.risk === 'CRITICAL' ? '#dc2626' : '#f59e0b'}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              animation: 'slideInRight 0.3s ease-out',
              color: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '5px',
                    opacity: 0.9
                  }}>
                    ⚠️ {alert.risk} RISK ALERT
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
                    {alert.name}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '10px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="earth-ui-overlay">
        <h2>🌍 Real-Time Earth</h2>
        <div className="earth-time-display" ref={timeDisplayRef}>00:00:00</div>
        <div className="earth-date-display" ref={dateDisplayRef}>Loading...</div>

        <div className="earth-info-section">
          <div className="earth-info-row">
            <span className="earth-info-label">Sun Position</span>
            <span className="earth-info-value" ref={sunPositionRef}>0°</span>
          </div>
          <div className="earth-info-row">
            <span className="earth-info-label">Earth Rotation</span>
            <span className="earth-info-value" ref={earthRotationRef}>0°</span>
          </div>
          <div className="earth-info-row">
            <span className="earth-info-label">View Angle</span>
            <span className="earth-info-value" ref={viewAngleRef}>0°</span>
          </div>
          <div className="earth-info-row">
            <span className="earth-info-label">Asteroids</span>
            <span className="earth-info-value">{asteroidData.length}</span>
          </div>
        </div>

        <div className="earth-control-group">
          <label>Time Speed: {timeMultiplier}x</label>
          <input 
            type="range" 
            className="earth-range"
            min="1" 
            max="3600" 
            value={timeMultiplier} 
            step="10"
            onChange={(e) => setTimeMultiplier(parseFloat(e.target.value))}
          />
        </div>

        <div className="earth-control-group">
          <label>Map Style</label>
          <select className="earth-select" value={mapStyle} onChange={handleMapStyleChange}>
            <option value="blue-marble">Blue Marble (Satellite)</option>
            <option value="natural">Natural Earth</option>
            <option value="night">Night Lights</option>
            <option value="topology">Topographic</option>
          </select>
        </div>

        <div className="earth-control-group">
          <label>View Location</label>
          <select className="earth-select" value={viewLocation} onChange={handleViewChange}>
            <option value="custom">Current View</option>
            <option value="0,0,0">Earth from Space</option>
            <option value="40.7128,-74.0060">New York City, USA</option>
            <option value="51.5074,-0.1278">London, UK</option>
            <option value="35.6762,139.6503">Tokyo, Japan</option>
          </select>
        </div>

        <div className="earth-control-group">
          <label>Risk Filter</label>
          <select className="earth-select" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="all">All Asteroids ({asteroidData.length})</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>
        </div>

        <div className="earth-toggle-container">
          <button 
            className={`earth-toggle-btn ${showClouds ? 'active' : ''}`}
            onClick={() => {
                setShowClouds(!showClouds);
                if (cloudsRef.current) cloudsRef.current.visible = !showClouds;
            }}
          >
            Clouds
          </button>
          <button 
            className={`earth-toggle-btn ${showAtmosphere ? 'active' : ''}`}
            onClick={() => {
                setShowAtmosphere(!showAtmosphere);
                if (atmosphereRef.current) atmosphereRef.current.visible = !showAtmosphere;
            }}
          >
            Atm
          </button>
          <button 
            className={`earth-toggle-btn ${showAsteroids ? 'active' : ''}`}
            onClick={() => {
                setShowAsteroids(!showAsteroids);
                if (asteroidsGroupRef.current) asteroidsGroupRef.current.visible = !showAsteroids;
            }}
          >
            Asteroids
          </button>
        </div>

        {/* Alert Sound Control - Separated for visibility */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
          marginTop: '15px', 
          paddingTop: '15px' 
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '12px', 
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Alert Settings
          </label>
          <button 
            className={`earth-toggle-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{ 
              width: '100%',
              fontSize: '14px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>{soundEnabled ? '🔊' : '🔇'}</span>
            <span>Alert Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
        
        <button 
            className="earth-btn"
            onClick={() => {
                simulatedTimeRef.current = new Date();
                setTimeMultiplier(1);
                earthRotationOffsetRef.current = 0;
            }}
        >
            Reset to Real Time
        </button>
      </div>

      <div className="earth-sun-indicator">
        <div className="earth-sun-icon"></div>
        <div className="earth-sun-label">Sun Position</div>
      </div>

      {/* Asteroid Details Modal */}
      {showDetailsModal && selectedAsteroid && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }} onClick={() => setShowDetailsModal(false)}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            border: '2px solid rgba(96, 165, 250, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            color: 'white'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#60a5fa', fontSize: '24px' }}>
                {selectedAsteroid.name}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '20px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '20px',
                background: selectedAsteroid.risk === 'CRITICAL' ? '#dc2626' :
                           selectedAsteroid.risk === 'HIGH' ? '#f59e0b' :
                           selectedAsteroid.risk === 'MEDIUM' ? '#fbbf24' : '#22c55e',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {selectedAsteroid.risk} RISK
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Asteroid ID</div>
                <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{selectedAsteroid.id}</div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Miss Distance</div>
                <div style={{ fontSize: '14px' }}>
                  {typeof selectedAsteroid.missDistance === 'number' 
                    ? `${Math.round(selectedAsteroid.missDistance).toLocaleString()} km`
                    : selectedAsteroid.missDistance}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAddToWatchlist}
                disabled={addingToWatchlist}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: addingToWatchlist ? '#64748b' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: addingToWatchlist ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {addingToWatchlist ? '⏳ Adding...' : '⭐ Add to Watchlist'}
              </button>
              <button
                onClick={() => window.open(`/asteroid/${selectedAsteroid.id}`, '_blank')}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                📊 Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthViewer;
