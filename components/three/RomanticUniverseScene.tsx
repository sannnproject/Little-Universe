'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Compass, Sparkles, Sliders, Eye } from 'lucide-react';
import { loveConfig, UniverseCameraPreset } from '@/data/love-config';
import { dampValue } from '@/lib/love-logic';

type AtmosphereTheme = 'sunset' | 'midnight' | 'rose';

interface AtmosphereSpec {
  id: AtmosphereTheme;
  label: string;
  fogColor: number;
  keyColor: number;
  hemiSky: number;
  hemiGround: number;
  heartColor: number;
  heartEmissive: number;
  exposure: number;
}

const ATMOSPHERE_SPECS: Record<AtmosphereTheme, AtmosphereSpec> = {
  sunset: {
    id: 'sunset',
    label: 'Senja Keemasan',
    fogColor: 0x160d21,
    keyColor: 0xffd8a8,
    hemiSky: 0xf2a7b8,
    hemiGround: 0x1a0e22,
    heartColor: 0xf2a7b8,
    heartEmissive: 0x722f47,
    exposure: 1.18,
  },
  midnight: {
    id: 'midnight',
    label: 'Malam Berbintang',
    fogColor: 0x0c0914,
    keyColor: 0xe6c99a,
    hemiSky: 0x9b7ede,
    hemiGround: 0x0a0710,
    heartColor: 0xe6c99a,
    heartEmissive: 0x5c2840,
    exposure: 1.08,
  },
  rose: {
    id: 'rose',
    label: 'Mawar Temaram',
    fogColor: 0x1e0f21,
    keyColor: 0xffb8c9,
    hemiSky: 0xffdce5,
    hemiGround: 0x251529,
    heartColor: 0xff8da6,
    heartEmissive: 0x8a2be2,
    exposure: 1.15,
  },
};

// Pre-allocated scratch math helpers at module scope (zero GC in requestAnimationFrame)
const _desiredCamPos = new THREE.Vector3();
const _desiredLookAt = new THREE.Vector3();
const _dummyObj = new THREE.Object3D();
const _scratchColor = new THREE.Color();

function createProceduralDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#181022';
    ctx.fillRect(0, 0, 512, 512);

    const cx = 256;
    const cy = 256;
    ctx.strokeStyle = '#E6C99A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 236, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(242, 167, 184, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 196, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const innerR = i % 6 === 0 ? 198 : 218;
      const outerR = 234;
      ctx.strokeStyle = i % 6 === 0 ? '#E6C99A' : 'rgba(230,201,154,0.45)';
      ctx.lineWidth = i % 6 === 0 ? 2.5 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createProceduralStoneBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) {
      const x = (i * 73) % 256;
      const y = (i * 137) % 256;
      const shade = 100 + ((i * 29) % 55);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(x, y, 3, 3);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

function createRadialContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(5, 3, 10, 0.75)');
    grad.addColorStop(0.55, 'rgba(5, 3, 10, 0.32)');
    grad.addColorStop(1, 'rgba(5, 3, 10, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function RomanticUniverseScene() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const presets = loveConfig.universe3D.presets;
  const [activePresetId, setActivePresetId] = useState<string>(presets[0]?.id || 'vista');
  const [atmosphere, setAtmosphere] = useState<AtmosphereTheme>('sunset');
  const [expansionPercent, setExpansionPercent] = useState<number>(15);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);

  // Mutable ref bridge so React HUD controls update 3D loop without tearing down WebGL
  const controlStateRef = useRef({
    preset: presets[0],
    atmosphere: ATMOSPHERE_SPECS.sunset,
    expansionTarget: 0.15,
    orbitYawOffset: 0,
    orbitPitchOffset: 0,
  });

  const renderDemandRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const found = presets.find((p) => p.id === activePresetId) || presets[0];
    controlStateRef.current.preset = found;
    controlStateRef.current.orbitYawOffset = 0;
    controlStateRef.current.orbitPitchOffset = 0;
    renderDemandRef.current?.();
  }, [activePresetId, presets]);

  useEffect(() => {
    controlStateRef.current.atmosphere = ATMOSPHERE_SPECS[atmosphere];
    renderDemandRef.current?.();
  }, [atmosphere]);

  useEffect(() => {
    controlStateRef.current.expansionTarget = expansionPercent / 100;
    renderDemandRef.current?.();
  }, [expansionPercent]);

  // Keyboard shortcut 'H' to collapse/expand bottom control dock
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setIsDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 680;

    const scene = new THREE.Scene();
    const initialAtmos = controlStateRef.current.atmosphere;
    scene.background = new THREE.Color(initialAtmos.fogColor);
    scene.fog = new THREE.FogExp2(initialAtmos.fogColor, 0.022);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    const initialPreset = controlStateRef.current.preset;
    const currentCamPos = new THREE.Vector3(...initialPreset.position);
    const currentLookAt = new THREE.Vector3(...initialPreset.target);
    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = initialAtmos.exposure;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const dialTexture = createProceduralDialTexture(maxAniso);
    const stoneBumpMap = createProceduralStoneBumpMap();
    const shadowDiscTexture = createRadialContactShadowTexture();

    // 3-Point Studio & Celestial Lighting Rig
    const hemiLight = new THREE.HemisphereLight(
      initialAtmos.hemiSky,
      initialAtmos.hemiGround,
      0.85
    );
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(initialAtmos.keyColor, 2.2);
    keyLight.position.set(7, 11, 8);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    const d = 10;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf2a7b8, 1.35);
    rimLight.position.set(-8, 6, -7);
    scene.add(rimLight);

    const heartPointLight = new THREE.PointLight(0xf2a7b8, 2.4, 14);
    heartPointLight.position.set(0, 2.5, 0);
    scene.add(heartPointLight);

    // Shared Materials (Varied roughness & metalness across adjacent parts)
    const stoneTerraceMat = new THREE.MeshStandardMaterial({
      color: 0x24172b,
      roughness: 0.82,
      metalness: 0.12,
      bumpMap: stoneBumpMap,
      bumpScale: 0.03,
    });

    const obsidianBaseMat = new THREE.MeshStandardMaterial({
      color: 0x160e1d,
      roughness: 0.42,
      metalness: 0.35,
    });

    const brushedGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6c99a,
      roughness: 0.18,
      metalness: 0.94,
      clearcoat: 0.4,
    });

    const roseGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf2a7b8,
      roughness: 0.24,
      metalness: 0.88,
      clearcoat: 0.3,
    });

    const dialFaceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: dialTexture,
      roughness: 0.35,
      metalness: 0.65,
    });

    const heartCrystalMat = new THREE.MeshPhysicalMaterial({
      color: initialAtmos.heartColor,
      emissive: initialAtmos.heartEmissive,
      emissiveIntensity: 0.38,
      roughness: 0.08,
      metalness: 0.1,
      transmission: isHeadless ? 0 : 0.88,
      ior: 1.65,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });

    const shadowDiscGeo = new THREE.CircleGeometry(1, 32);
    shadowDiscGeo.rotateX(-Math.PI / 2);
    const shadowDiscMat = new THREE.MeshBasicMaterial({
      map: shadowDiscTexture,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });

    // 1. Floating Sanctuary Observatory Island Base (Multi-tiered stone terrace)
    const islandGroup = new THREE.Group();
    const mainTerraceGeo = new THREE.CylinderGeometry(8.5, 7.6, 0.7, 48);
    mainTerraceGeo.translate(0, -0.35, 0);
    const mainTerrace = new THREE.Mesh(mainTerraceGeo, stoneTerraceMat);
    mainTerrace.receiveShadow = true;
    islandGroup.add(mainTerrace);

    const upperPiazzaGeo = new THREE.CylinderGeometry(5.6, 5.9, 0.18, 48);
    upperPiazzaGeo.translate(0, 0.09, 0);
    const upperPiazza = new THREE.Mesh(upperPiazzaGeo, obsidianBaseMat);
    upperPiazza.receiveShadow = true;
    islandGroup.add(upperPiazza);

    const outerRingTrimGeo = new THREE.TorusGeometry(5.65, 0.045, 16, 64);
    outerRingTrimGeo.rotateX(Math.PI / 2);
    const outerRingTrim = new THREE.Mesh(outerRingTrimGeo, brushedGoldMat);
    outerRingTrim.position.y = 0.18;
    islandGroup.add(outerRingTrim);

    // Tapered floating rock underside
    const underRockGeo = new THREE.ConeGeometry(7.4, 4.2, 16);
    underRockGeo.rotateX(Math.PI);
    underRockGeo.translate(0, -2.8, 0);
    const underRock = new THREE.Mesh(underRockGeo, stoneTerraceMat);
    islandGroup.add(underRock);

    scene.add(islandGroup);

    // 2. HERO SUBJECT: 9-Part Celestial Heart Astrolabe Monument (THREE.Group)
    const astrolabeGroup = new THREE.Group();
    astrolabeGroup.position.set(0, 0.18, 0);

    // Contact shadow beneath monument
    const monumentShadow = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
    monumentShadow.scale.set(2.6, 1, 2.6);
    monumentShadow.position.y = 0.015;
    astrolabeGroup.add(monumentShadow);

    // Part 1: Stepped Lathe Pedestal (grounded at y=0)
    const lathePoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.45, 0),
      new THREE.Vector2(1.35, 0.22),
      new THREE.Vector2(1.05, 0.32),
      new THREE.Vector2(0.88, 0.72),
      new THREE.Vector2(1.12, 0.88),
      new THREE.Vector2(0, 0.88),
    ];
    const pedestalGeo = new THREE.LatheGeometry(lathePoints, 36);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, obsidianBaseMat);
    pedestalMesh.castShadow = true;
    pedestalMesh.receiveShadow = true;
    astrolabeGroup.add(pedestalMesh);

    // Part 2: Brushed Champagne Gold Plinth Collar
    const collarGeo = new THREE.CylinderGeometry(1.16, 1.22, 0.12, 36);
    collarGeo.translate(0, 0.94, 0);
    const collarMesh = new THREE.Mesh(collarGeo, brushedGoldMat);
    astrolabeGroup.add(collarMesh);

    // Part 3: Engraved Celestial Horizon Compass Disc
    const dialGeo = new THREE.CylinderGeometry(1.55, 1.55, 0.06, 48);
    const dialMesh = new THREE.Mesh(dialGeo, dialFaceMat);
    dialMesh.position.y = 1.04;
    astrolabeGroup.add(dialMesh);

    // Part 4: Outer Meridian Brushed Gold Ring
    const outerRingGeo = new THREE.TorusGeometry(1.62, 0.06, 20, 64);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, brushedGoldMat);
    outerRingMesh.position.y = 2.45;
    outerRingMesh.castShadow = true;
    astrolabeGroup.add(outerRingMesh);

    // Part 5: Middle Tilted Rose-Gold Equinox Ring
    const midRingGeo = new THREE.TorusGeometry(1.32, 0.048, 20, 64);
    const midRingMesh = new THREE.Mesh(midRingGeo, roseGoldMat);
    midRingMesh.position.y = 2.45;
    midRingMesh.rotation.x = Math.PI / 6;
    midRingMesh.castShadow = true;
    astrolabeGroup.add(midRingMesh);

    // Part 6: Inner Delicate Gimbal Ring
    const innerRingGeo = new THREE.TorusGeometry(1.02, 0.035, 16, 48);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, brushedGoldMat);
    innerRingMesh.position.y = 2.45;
    innerRingMesh.rotation.y = Math.PI / 4;
    astrolabeGroup.add(innerRingMesh);

    // Part 7: Sculpted 3D Crystal Heart Core (ExtrudeGeometry with bevels)
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, -0.42);
    heartShape.bezierCurveTo(0, -0.45, -0.55, -0.05, -0.55, 0.28);
    heartShape.bezierCurveTo(-0.55, 0.56, -0.22, 0.68, 0, 0.38);
    heartShape.bezierCurveTo(0.22, 0.68, 0.55, 0.56, 0.55, 0.28);
    heartShape.bezierCurveTo(0.55, -0.05, 0, -0.45, 0, -0.42);

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.09,
      bevelThickness: 0.09,
    });
    heartGeo.center();
    const heartMesh = new THREE.Mesh(heartGeo, heartCrystalMat);
    heartMesh.position.y = 2.45;
    heartMesh.castShadow = true;
    astrolabeGroup.add(heartMesh);

    // Part 8 & 9: Crown Finial Spire & Twin Orbital Satellites
    const spireGeo = new THREE.ConeGeometry(0.12, 0.48, 16);
    const spireMesh = new THREE.Mesh(spireGeo, brushedGoldMat);
    spireMesh.position.y = 4.32;
    astrolabeGroup.add(spireMesh);

    const satelliteGroup = new THREE.Group();
    satelliteGroup.position.y = 2.45;
    const satGeo = new THREE.OctahedronGeometry(0.11, 0);
    const satLeft = new THREE.Mesh(satGeo, roseGoldMat);
    satLeft.position.set(-1.95, 0.2, 0);
    const satRight = new THREE.Mesh(satGeo, brushedGoldMat);
    satRight.position.set(1.95, -0.2, 0);
    satelliteGroup.add(satLeft, satRight);
    astrolabeGroup.add(satelliteGroup);

    scene.add(astrolabeGroup);

    // 3. Romantic Sunset Bench & Embracing Couple Silhouette (8-Part Composite Group)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(-2.35, 0.18, 1.85);
    benchGroup.rotation.y = Math.PI / 5;

    const benchShadow = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
    benchShadow.scale.set(1.4, 1, 0.9);
    benchShadow.position.y = 0.015;
    benchGroup.add(benchShadow);

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x4a2531,
      roughness: 0.78,
      metalness: 0.08,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1a1221,
      roughness: 0.3,
      metalness: 0.82,
    });

    const seatPlankGeo = new THREE.BoxGeometry(1.65, 0.06, 0.48);
    const seatPlank = new THREE.Mesh(seatPlankGeo, woodMat);
    seatPlank.position.set(0, 0.42, 0);
    seatPlank.castShadow = true;
    benchGroup.add(seatPlank);

    const backPlankGeo = new THREE.BoxGeometry(1.65, 0.36, 0.05);
    const backPlank = new THREE.Mesh(backPlankGeo, woodMat);
    backPlank.position.set(0, 0.72, -0.22);
    backPlank.rotation.x = -0.12;
    backPlank.castShadow = true;
    benchGroup.add(backPlank);

    const legGeo = new THREE.BoxGeometry(0.08, 0.56, 0.52);
    const leftLeg = new THREE.Mesh(legGeo, ironMat);
    leftLeg.position.set(-0.74, 0.28, 0);
    const rightLeg = new THREE.Mesh(legGeo, ironMat);
    rightLeg.position.set(0.74, 0.28, 0);
    benchGroup.add(leftLeg, rightLeg);

    // Couple seated together on bench (4 parts: two stylized torsos + two heads leaning close)
    const coupleMat = new THREE.MeshStandardMaterial({
      color: 0x231429,
      roughness: 0.55,
      metalness: 0.2,
    });
    const torso1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.58, 16), coupleMat);
    torso1.position.set(-0.18, 0.74, -0.02);
    torso1.rotation.z = -0.06;
    const head1 = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 16), coupleMat);
    head1.position.set(-0.15, 1.15, 0);

    const torso2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.54, 16), roseGoldMat);
    torso2.position.set(0.16, 0.71, -0.02);
    torso2.rotation.z = 0.1;
    const head2 = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 16), roseGoldMat);
    head2.position.set(0.11, 1.09, 0.02);

    benchGroup.add(torso1, head1, torso2, head2);

    // Warm Observatory Lantern beside the bench
    const lanternPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.04, 1.55, 12),
      ironMat
    );
    lanternPost.position.set(-1.15, 0.77, 0.15);
    const lanternBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfff5ef,
        emissive: 0xe6c99a,
        emissiveIntensity: 2.2,
        roughness: 0.2,
      })
    );
    lanternBulb.position.set(-1.15, 1.6, 0.15);
    benchGroup.add(lanternPost, lanternBulb);

    scene.add(benchGroup);

    // 4. Blossom Sanctuary Trees & Stone Archway Framing the Horizon
    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x2d1b29,
      roughness: 0.85,
      metalness: 0.05,
    });
    const blossomMat = new THREE.MeshStandardMaterial({
      color: 0xf2a7b8,
      emissive: 0x4a192c,
      emissiveIntensity: 0.25,
      roughness: 0.5,
      metalness: 0.1,
    });

    function createBlossomTree(x: number, z: number, scale: number): THREE.Group {
      const tree = new THREE.Group();
      tree.position.set(x, 0.02, z);
      tree.scale.setScalar(scale);

      const shadow = new THREE.Mesh(shadowDiscGeo, shadowDiscMat);
      shadow.scale.set(1.5, 1, 1.5);
      shadow.position.y = 0.015;
      tree.add(shadow);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.26, 1.9, 12), barkMat);
      trunk.position.y = 0.95;
      trunk.castShadow = true;
      tree.add(trunk);

      const branchL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 1.1, 10), barkMat);
      branchL.position.set(-0.35, 1.95, 0.1);
      branchL.rotation.z = 0.55;
      tree.add(branchL);

      const branchR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 1.0, 10), barkMat);
      branchR.position.set(0.38, 1.85, -0.1);
      branchR.rotation.z = -0.5;
      tree.add(branchR);

      const canopyGeo = new THREE.IcosahedronGeometry(0.75, 1);
      const c1 = new THREE.Mesh(canopyGeo, blossomMat);
      c1.position.set(0, 2.55, 0);
      c1.scale.set(1.3, 0.85, 1.2);
      const c2 = new THREE.Mesh(canopyGeo, blossomMat);
      c2.position.set(-0.68, 2.28, 0.2);
      c2.scale.set(0.95, 0.72, 0.95);
      const c3 = new THREE.Mesh(canopyGeo, blossomMat);
      c3.position.set(0.68, 2.18, -0.15);
      c3.scale.set(0.9, 0.7, 0.9);

      tree.add(c1, c2, c3);
      return tree;
    }

    scene.add(createBlossomTree(3.6, -2.2, 1.05));
    scene.add(createBlossomTree(-3.8, -2.5, 0.92));

    // Stone Observatory Archway at the back of the terrace
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0.02, -4.6);
    const pillarGeo = new THREE.BoxGeometry(0.52, 3.4, 0.52);
    const leftPillar = new THREE.Mesh(pillarGeo, obsidianBaseMat);
    leftPillar.position.set(-2.1, 1.7, 0);
    const rightPillar = new THREE.Mesh(pillarGeo, obsidianBaseMat);
    rightPillar.position.set(2.1, 1.7, 0);
    const archSpanGeo = new THREE.TorusGeometry(2.1, 0.24, 16, 48, Math.PI);
    const archSpan = new THREE.Mesh(archSpanGeo, brushedGoldMat);
    archSpan.position.set(0, 3.4, 0);
    archGroup.add(leftPillar, rightPillar, archSpan);
    scene.add(archGroup);

    // 5. InstancedMesh Starfield & Floating Rose-Gold Motes (160 instances)
    const starCount = 160;
    const starGeo = new THREE.OctahedronGeometry(0.065, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, starCount);

    const starPalette = [0xfff5ef, 0xf2a7b8, 0xe6c99a, 0xd8b4fe];
    for (let i = 0; i < starCount; i++) {
      const radius = 9 + ((i * 17) % 24);
      const theta = (i * 2.39996) % (Math.PI * 2);
      const phi = 0.15 + ((i * 31) % 70) / 100;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = 1.2 + Math.abs(radius * Math.cos(phi) * 0.55);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      _dummyObj.position.set(x, y, z);
      const s = 0.65 + ((i * 13) % 90) / 100;
      _dummyObj.scale.setScalar(s);
      _dummyObj.rotation.set(i * 0.3, i * 0.5, 0);
      _dummyObj.updateMatrix();
      starInstanced.setMatrixAt(i, _dummyObj.matrix);

      _scratchColor.setHex(starPalette[i % starPalette.length]);
      starInstanced.setColorAt(i, _scratchColor);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    if (starInstanced.instanceColor) starInstanced.instanceColor.needsUpdate = true;
    starInstanced.computeBoundingSphere();
    scene.add(starInstanced);

    // Pre-warm shaders once
    renderer.compile(scene, camera);

    // Pointer Drag Orbit Interaction
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointerX;
      const dy = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      controlStateRef.current.orbitYawOffset -= dx * 0.006;
      controlStateRef.current.orbitPitchOffset = THREE.MathUtils.clamp(
        controlStateRef.current.orbitPitchOffset + dy * 0.004,
        -0.35,
        0.55
      );
      renderDemandRef.current?.();
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1200;
      const h = container.clientHeight || 680;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderDemandRef.current?.();
    };
    window.addEventListener('resize', onResize);

    // Render step function (on-demand in headless CPU WebGL, 60fps loop on GPU)
    let currentExpansion = controlStateRef.current.expansionTarget;
    let rafId = 0;
    const startTimeMs = performance.now();
    let prevTimeMs = startTimeMs;

    const stepScene = (dt: number, elapsed: number, instantSnap = false) => {
      currentExpansion = instantSnap
        ? controlStateRef.current.expansionTarget
        : dampValue(
            currentExpansion,
            controlStateRef.current.expansionTarget,
            5.5,
            dt
          );

      heartMesh.position.y =
        2.45 + currentExpansion * 0.75 + Math.sin(elapsed * 1.6) * 0.06;
      heartMesh.rotation.y = elapsed * 0.55;

      outerRingMesh.position.y = 2.45 + currentExpansion * 0.45;
      outerRingMesh.rotation.y = -elapsed * 0.22;
      outerRingMesh.rotation.z = Math.sin(elapsed * 0.4) * 0.12;

      midRingMesh.position.y = 2.45 + currentExpansion * 0.6;
      midRingMesh.rotation.x = Math.PI / 6 + elapsed * 0.32;
      midRingMesh.rotation.y = elapsed * 0.18;

      innerRingMesh.position.y = 2.45 + currentExpansion * 0.7;
      innerRingMesh.rotation.z = -elapsed * 0.45;

      spireMesh.position.y = 4.32 + currentExpansion * 1.15;
      spireMesh.rotation.y = elapsed * 0.4;

      satelliteGroup.position.y = 2.45 + currentExpansion * 0.75;
      satelliteGroup.rotation.y = elapsed * 0.65;
      satLeft.position.x = -1.95 - currentExpansion * 0.85;
      satRight.position.x = 1.95 + currentExpansion * 0.85;

      starInstanced.rotation.y = elapsed * 0.025;

      const atmos = controlStateRef.current.atmosphere;
      const colorFactor = instantSnap ? 1 : 1 - Math.exp(-4 * dt);
      if (scene.background instanceof THREE.Color) {
        _scratchColor.setHex(atmos.fogColor);
        scene.background.lerp(_scratchColor, colorFactor);
      }
      if (scene.fog instanceof THREE.FogExp2) {
        _scratchColor.setHex(atmos.fogColor);
        scene.fog.color.lerp(_scratchColor, colorFactor);
      }
      _scratchColor.setHex(atmos.keyColor);
      keyLight.color.lerp(_scratchColor, colorFactor);
      _scratchColor.setHex(atmos.heartColor);
      heartCrystalMat.color.lerp(_scratchColor, colorFactor);

      const preset = controlStateRef.current.preset;
      _desiredCamPos.set(...preset.position);
      _desiredLookAt.set(...preset.target);

      const offsetVec = _desiredCamPos.clone().sub(_desiredLookAt);
      offsetVec.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        controlStateRef.current.orbitYawOffset
      );
      offsetVec.y += controlStateRef.current.orbitPitchOffset * 3.0;
      _desiredCamPos.copy(_desiredLookAt).add(offsetVec);

      const dampFactor = instantSnap ? 1 : 1 - Math.exp(-5.0 * dt);
      currentCamPos.lerp(_desiredCamPos, dampFactor);
      currentLookAt.lerp(_desiredLookAt, dampFactor);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    renderDemandRef.current = () => {
      if (isHeadless) {
        stepScene(0.1, 0.5, true);
      }
    };

    if (isHeadless) {
      stepScene(0.1, 0.5, true);
    } else {
      const animate = (nowMs: number) => {
        rafId = requestAnimationFrame(animate);
        const dt = Math.min((nowMs - prevTimeMs) / 1000, 0.1);
        prevTimeMs = nowMs;
        const elapsed = (nowMs - startTimeMs) / 1000;
        stepScene(dt, elapsed, false);
      };
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafId);
      renderDemandRef.current = null;
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      dialTexture.dispose();
      stoneBumpMap.dispose();
      shadowDiscTexture.dispose();
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  const currentPreset =
    presets.find((p) => p.id === activePresetId) || presets[0];

  return (
    <section
      id="universe-3d"
      aria-label="Observatorium 3D Interaktif"
      className="relative w-full h-[85svh] min-h-[580px] max-h-[860px] overflow-hidden border-y border-[#E6C99A]/15 bg-[#100C18]"
    >
      {/* Dedicated WebGL Mount Container (Isolated from React HUD re-renders) */}
      <div
        ref={canvasMountRef}
        data-testid="romantic-3d-canvas"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Minimal Top-Left Spec Header (Unobstructed Center Viewport) */}
      <div className="pointer-events-none relative z-10 max-w-xl p-6 sm:p-8">
        <p className="text-xs tracking-[0.22em] text-[#E6C99A] uppercase mb-2">
          {loveConfig.universe3D.kicker}
        </p>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#FFF5EF] tracking-wide mb-2">
          {loveConfig.universe3D.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#FFF5EF]/75 leading-relaxed max-w-md">
          {currentPreset.description}
        </p>
      </div>

      {/* Unified Collapsible Bottom Control Dock (Solid surface, no backdrop-filter over WebGL) */}
      <div className=" fixed-dock-wrapper absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[920px] flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDockCollapsed((prev) => !prev)}
          aria-expanded={!isDockCollapsed}
          className="mb-1.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-t-lg bg-[#160E20] border border-[#E6C99A]/25 text-xs font-medium text-[#FFF5EF]/90 hover:text-[#E6C99A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-[#E6C99A]" />
              <span>Tampilkan Kontrol 3D (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-[#E6C99A]" />
              <span>Sembunyikan Kontrol (Mode Sinema)</span>
            </>
          )}
        </button>

        {!isDockCollapsed && (
          <div className="w-full rounded-2xl bg-[#120B1B] border border-[#E6C99A]/25 px-5 py-4 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Camera View Presets */}
              <div className="lg:col-span-5 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#E6C99A]/85">
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>Sudut Pandang Kamera</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {presets.map((preset: UniverseCameraPreset) => {
                    const isActive = preset.id === activePresetId;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setActivePresetId(preset.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#722F47] text-[#FFF5EF] border border-[#F2A7B8]/40'
                            : 'bg-[#1D1228] text-[#FFF5EF]/75 hover:text-[#FFF5EF] border border-transparent'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Atmosphere / Lighting Switcher */}
              <div className="lg:col-span-4 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#E6C99A]/85">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Suasana Cahaya</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(Object.keys(ATMOSPHERE_SPECS) as AtmosphereTheme[]).map(
                    (themeKey) => {
                      const spec = ATMOSPHERE_SPECS[themeKey];
                      const isActive = atmosphere === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => setAtmosphere(themeKey)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isActive
                              ? 'bg-[#E6C99A] text-[#100C18]'
                              : 'bg-[#1D1228] text-[#FFF5EF]/75 hover:text-[#FFF5EF]'
                          }`}
                        >
                          {spec.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Constellation Expansion / Exploded View Slider */}
              <div className="lg:col-span-3 min-w-0 flex flex-col gap-2">
                <label
                  htmlFor="constellation-expansion-slider"
                  className="flex items-center justify-between text-[11px] text-[#E6C99A]/85"
                >
                  <span className="inline-flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 shrink-0" />
                    <span>Ekspansi Rasi Hati</span>
                  </span>
                  <span className="font-mono tabular-nums text-[#FFF5EF]">
                    {expansionPercent}%
                  </span>
                </label>
                <input
                  id="constellation-expansion-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={expansionPercent}
                  onChange={(e) => setExpansionPercent(Number(e.target.value))}
                  aria-label="Ekspansi Rasi Hati"
                  className="w-full accent-[#F2A7B8] cursor-pointer h-1.5 bg-[#251529] rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
