"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface PaintColor {
  name: string;
  hex: string;
  metallic: number;
  roughness: number;
  clearcoat?: number;
}

const SEDAN_COLORS: PaintColor[] = [
  { name: "Pearl White Multi-Coat", hex: "#eef0f3", metallic: 0.7, roughness: 0.28 },
  { name: "Solid Black", hex: "#0b0c0e", metallic: 0.85, roughness: 0.2 },
  { name: "Midnight Silver Metallic", hex: "#3b414a", metallic: 0.9, roughness: 0.25 },
  { name: "Deep Blue Metallic", hex: "#0f2f6a", metallic: 0.85, roughness: 0.24 },
  { name: "Ultra Red", hex: "#9b0b18", metallic: 0.88, roughness: 0.22 },
  { name: "Quicksilver", hex: "#8c949d", metallic: 0.95, roughness: 0.2 },
];

const CYBERTRUCK_COLORS: PaintColor[] = [
  { name: "Stainless Steel Exoskeleton", hex: "#adb2b9", metallic: 0.96, roughness: 0.38 },
  { name: "Stealth Satin Black Wrap", hex: "#161719", metallic: 0.45, roughness: 0.58 },
  { name: "Ceramic Satin White Wrap", hex: "#dcdfe3", metallic: 0.4, roughness: 0.52 },
  { name: "Tactical Olive Green Wrap", hex: "#363f33", metallic: 0.42, roughness: 0.55 },
  { name: "Cyber Desert Gold Wrap", hex: "#8f7344", metallic: 0.75, roughness: 0.4 },
];

const SPACEX_FLIGHT_COLORS: PaintColor[] = [
  { name: "SpaceX Thruster Red Metallic", hex: "#9b0b18", metallic: 0.95, roughness: 0.18 },
  { name: "Falcon 9 Satin Carbon", hex: "#161719", metallic: 0.85, roughness: 0.3 },
  { name: "Starship Heatshield Steel", hex: "#adb2b9", metallic: 0.98, roughness: 0.2 },
  { name: "Orbital Deep Blue", hex: "#0c2856", metallic: 0.92, roughness: 0.22 },
  { name: "Liquid Quicksilver", hex: "#d8dce2", metallic: 0.95, roughness: 0.18 },
];

const SEMI_COLORS: PaintColor[] = [
  { name: "Polar Fleet White", hex: "#eef1f4", metallic: 0.6, roughness: 0.3 },
  { name: "Stealth Commercial Black", hex: "#0c0d10", metallic: 0.85, roughness: 0.25 },
  { name: "Midnight Silver Metallic", hex: "#3f444d", metallic: 0.9, roughness: 0.22 },
  { name: "Fleet Ultramarine Blue", hex: "#0b2b64", metallic: 0.85, roughness: 0.26 },
  { name: "Tesla Commercial Red", hex: "#a30e1c", metallic: 0.88, roughness: 0.2 },
];

// Map vehicle slugs to authentic dedicated GLB assets
const MODEL_GLB_MAP: Record<string, string> = {
  "tesla-semi": "/models/tesla-semi.glb", // Dedicated Tesla Semi tractor truck!
  cybertruck: "/models/cybertruck.glb",
  "model-3": "/models/model-3.glb",
  "model-y": "/models/model-y.glb",
  "model-s": "/models/model-s.glb",
  "model-s-plaid": "/models/model-s.glb",
  "original-roadster": "/models/roadster.glb",
  "roadster-2": "/models/roadster.glb",
  "roadster-flying": "/models/roadster.glb",
  cybercab: "/models/cybercab.glb",
  "model-x": "/models/model-y.glb",
};

interface Tesla3DViewerProps {
  slug: string;
  name: string;
}

export const Tesla3DViewer: React.FC<Tesla3DViewerProps> = ({ slug, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeColor, setActiveColor] = useState<PaintColor>(() => {
    if (slug === "cybertruck") return CYBERTRUCK_COLORS[0];
    if (slug === "tesla-semi") return SEMI_COLORS[0];
    if (slug === "roadster-flying") return SPACEX_FLIGHT_COLORS[0];
    return SEDAN_COLORS[4]; // Default Ultra Red
  });
  const [showHint, setShowHint] = useState(true);

  // References for Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const paintMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const colors =
    slug === "cybertruck"
      ? CYBERTRUCK_COLORS
      : slug === "tesla-semi"
      ? SEMI_COLORS
      : slug === "roadster-flying"
      ? SPACEX_FLIGHT_COLORS
      : SEDAN_COLORS;
  const glbPath = MODEL_GLB_MAP[slug] || "/models/model-3.glb";

  // Hide hint on interaction or after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3800);
    return () => clearTimeout(timer);
  }, []);

  // Update paint materials when activeColor changes
  useEffect(() => {
    if (paintMaterialsRef.current.length > 0) {
      paintMaterialsRef.current.forEach((mat) => {
        mat.color.set(activeColor.hex);
        mat.metalness = activeColor.metallic;
        mat.roughness = activeColor.roughness;
        mat.needsUpdate = true;
      });
    }
  }, [activeColor]);

  // Update auto-rotate in controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let isDisposed = false;
    let animationFrameId: number;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#07080a");
    sceneRef.current = scene;

    // CAMERA
    const isSemi = slug === "tesla-semi";
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const initialCamDist = isSemi ? 6.5 : 4.8;
    const initialCamHeight = isSemi ? 2.3 : 1.8;
    camera.position.set(initialCamDist, initialCamHeight, initialCamDist);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.9;
    controls.minDistance = isSemi ? 4.2 : 3.2;
    controls.maxDistance = isSemi ? 14.0 : 9.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't allow camera under floor
    controls.target.set(0, isSemi ? 1.15 : 0.65, 0);
    controls.update();
    controlsRef.current = controls;

    // LIGHTING SETUP (Studio Showroom)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key overhead light
    const overheadLight = new THREE.DirectionalLight(0xffffff, 2.2);
    overheadLight.position.set(2, 7, 3);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.width = 1024;
    overheadLight.shadow.mapSize.height = 1024;
    overheadLight.shadow.bias = -0.0001;
    scene.add(overheadLight);

    // Front headlights highlight
    const frontLight = new THREE.DirectionalLight(0xdbeafe, 1.8);
    frontLight.position.set(0, 2.5, 6);
    scene.add(frontLight);

    // Soft rim backlight
    const rimLight = new THREE.DirectionalLight(0xef4444, 0.8);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    // Cool side kicker
    const kickerLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    kickerLight.position.set(5, 2, -2);
    scene.add(kickerLight);

    // FLOOR / SHOWROOM STAGE
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.65,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Circular glowing podium ring under vehicle
    const ringGeo = new THREE.RingGeometry(2.35, 2.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe82127,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    scene.add(ring);

    // Outer subtle ring
    const ring2Geo = new THREE.RingGeometry(3.3, 3.32, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.005;
    scene.add(ring2);

    // LOAD 3D GLB MODEL
    paintMaterialsRef.current = [];
    setIsLoading(true);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      glbPath,
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;
        modelRef.current = model;

        // Auto-compute bounding box to center and scale car
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center model at origin
        model.position.x -= center.x;
        model.position.y -= box.min.y; // Sit flat on the floor
        model.position.z -= center.z;

        // Normalize size if necessary (target semi length ~5.6m, passenger car ~4.4m)
        const targetDim = slug === "tesla-semi" ? 5.6 : 4.4;
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const scale = targetDim / maxDim;
          model.scale.set(scale, scale, scale);
        }

        // Collect and configure paint materials
        const isSemi = slug === "tesla-semi";
        const isRoadster =
          slug === "roadster-2" || slug === "roadster-flying" || slug === "original-roadster";
        const isModelS = slug === "model-s" || slug === "model-s-plaid";

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
              const matName = (mat.name || "").toLowerCase();
              const nodeName = (mesh.name || "").toLowerCase();

              // Identify exterior car body paint meshes
              const isPaint =
                matName.includes("paint") ||
                matName.includes("steel") ||
                matName.includes("exterior") ||
                matName.includes("body") ||
                (isSemi &&
                  (matName === "white" ||
                    matName.includes("bake") ||
                    nodeName.includes("plane") ||
                    nodeName.includes("bumper"))) ||
                ((isRoadster || isModelS) &&
                  (matName.includes("material.001") ||
                    matName.includes("car") ||
                    nodeName.includes("body"))) ||
                nodeName.includes("exterior_paint") ||
                nodeName.includes("exterior_steel") ||
                nodeName.includes("body");

              if (isPaint) {
                // Clone material so each mesh can be tinted safely
                const paintMat = mat.clone() as THREE.MeshStandardMaterial;
                paintMat.color = new THREE.Color(activeColor.hex);
                paintMat.metalness = activeColor.metallic;
                paintMat.roughness = activeColor.roughness;
                mesh.material = paintMat;
                paintMaterialsRef.current.push(paintMat);
              }

              // Enhance glass transparency and reflections
              if (
                matName.includes("glass") ||
                nodeName.includes("glass") ||
                (isSemi && (matName.includes("glass") || nodeName.includes("window")))
              ) {
                mat.transparent = true;
                mat.opacity = 0.55;
                mat.roughness = 0.08;
                mat.metalness = 0.95;
              }

              // Headlight and Taillight emissive bloom
              if (
                matName.includes("headlight_led") ||
                matName.includes("signature_led") ||
                (isSemi && matName.includes("lights"))
              ) {
                mat.emissive = new THREE.Color(0xdbeafe);
                mat.emissiveIntensity = 2.5;
              }
              if (matName.includes("taillight_led")) {
                mat.emissive = new THREE.Color(0xe82127);
                mat.emissiveIntensity = 2.0;
              }
            }
          }
        });

        if (slug === "roadster-flying") {
          model.position.y += 0.35;
          model.userData.baseY = model.position.y;

          // Glowing blue SpaceX cold-gas thruster plume light underneath
          const thrusterLight = new THREE.PointLight(0x38bdf8, 5, 4);
          thrusterLight.position.set(0, 0.15, 0);
          scene.add(thrusterLight);
        }

        scene.add(model);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error("GLTF Load error:", error);
        setIsLoading(false);
      }
    );

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // ANIMATION LOOP WITH HOVER LEVITATION
    const startTime = performance.now();
    const isFlying = slug === "roadster-flying";

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Levitating hover physics for the Flying Tesla Roadster
      if (isFlying && modelRef.current) {
        const baseY = modelRef.current.userData.baseY ?? 0.35;
        modelRef.current.position.y = baseY + Math.sin(elapsed * 2.2) * 0.045;
        modelRef.current.rotation.z = Math.sin(elapsed * 1.6) * 0.012;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    return () => {
      isDisposed = true;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      dracoLoader.dispose();
      controls.dispose();
      renderer.dispose();

      // Dispose all meshes and materials in scene
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    };
  }, [glbPath]);

  // Camera presets
  const setCameraPreset = (view: "front" | "side" | "rear" | "top") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const isSemi = slug === "tesla-semi";

    controls.target.set(0, isSemi ? 1.15 : 0.65, 0);
    const d = isSemi ? 6.5 : 5.2;
    const h = isSemi ? 2.0 : 1.4;

    if (view === "front") camera.position.set(0, h, d);
    else if (view === "side") camera.position.set(d, h, 0);
    else if (view === "rear") camera.position.set(0, h, -d);
    else if (view === "top") camera.position.set(0.1, isSemi ? 8.5 : 6.2, 0.1);
    controls.update();
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "460px",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid var(--line-strong)",
        background: "radial-gradient(ellipse at center, #12141a 0%, #060709 100%)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* TOP HEADER CONTROLS */}
      <div
        style={{
          position: "absolute",
          top: "14px",
          left: "14px",
          right: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(10, 11, 14, 0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "6px 12px",
            borderRadius: "20px",
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 8px #34d399",
            }}
          ></span>
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Real-time 3D Studio
          </span>
          <span className="dim" style={{ fontSize: "11px" }}>· {name}</span>
        </div>

        <div style={{ display: "flex", gap: "6px", pointerEvents: "auto" }}>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="btn btn-quiet btn-sm"
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              background: autoRotate ? "rgba(232,33,39,0.18)" : "rgba(10,11,14,0.75)",
              borderColor: autoRotate ? "rgba(232,33,39,0.4)" : "rgba(255,255,255,0.12)",
              color: autoRotate ? "#ff6b6b" : "var(--text)",
            }}
            title="Toggle turntable auto-spin"
          >
            {autoRotate ? "❚❚ Pause Spin" : "▶ Auto Spin"}
          </button>
          <button
            onClick={() => setCameraPreset("front")}
            className="btn btn-quiet btn-sm"
            style={{ padding: "5px 10px", fontSize: "11px", background: "rgba(10,11,14,0.75)" }}
            title="Reset to front angle"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* CAMERA PRESETS (FLOATING CHIPS) */}
      <div
        style={{
          position: "absolute",
          top: "54px",
          right: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          pointerEvents: "auto",
        }}
      >
        <button
          onClick={() => setCameraPreset("front")}
          style={{
            background: "rgba(10,11,14,0.65)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            color: "#8b9199",
            padding: "4px 8px",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          Front 3/4
        </button>
        <button
          onClick={() => setCameraPreset("side")}
          style={{
            background: "rgba(10,11,14,0.65)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            color: "#8b9199",
            padding: "4px 8px",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setCameraPreset("rear")}
          style={{
            background: "rgba(10,11,14,0.65)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            color: "#8b9199",
            padding: "4px 8px",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          Rear
        </button>
        <button
          onClick={() => setCameraPreset("top")}
          style={{
            background: "rgba(10,11,14,0.65)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "6px",
            color: "#8b9199",
            padding: "4px 8px",
            fontSize: "10px",
            cursor: "pointer",
          }}
        >
          Aero Top
        </button>
      </div>

      {/* BOTTOM COLOR SELECTOR SWATCHES */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "14px",
          right: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(10, 11, 14, 0.8)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "12px",
          padding: "10px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#8b9199" }}>
            Exterior Paint:
          </span>
          <strong style={{ fontSize: "12.5px", color: "#fff" }}>{activeColor.name}</strong>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {colors.map((c) => {
            const isSelected = activeColor.name === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setActiveColor(c)}
                title={c.name}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: c.hex,
                  border: isSelected ? "2px solid #fff" : "1px solid rgba(255,255,255,0.25)",
                  boxShadow: isSelected ? "0 0 10px rgba(255,255,255,0.5)" : "none",
                  cursor: "pointer",
                  transform: isSelected ? "scale(1.18)" : "scale(1)",
                  transition: "all 0.18s ease",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* DRAG INTERACTION HINT */}
      {showHint && !isLoading && (
        <div
          style={{
            position: "absolute",
            bottom: "68px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "11px",
            color: "#9ca3af",
            pointerEvents: "none",
            animation: "pulse 2s infinite",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          ⟲ Drag to inspect 360° · Scroll to zoom
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(7, 8, 10, 0.88)",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid rgba(232,33,39,0.2)",
              borderTopColor: "#e82127",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          ></div>
          <div style={{ fontSize: "12.5px", fontWeight: 500, letterSpacing: "0.04em" }}>
            Loading 3D Tesla {name}… {loadProgress > 0 && `${loadProgress}%`}
          </div>
          <style jsx>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
