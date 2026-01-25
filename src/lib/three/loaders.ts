/**
 * Configured GLTF/GLB loader with KTX2 texture support
 * 
 * Uses CDN-hosted basis transcoder for KTX2 texture decompression.
 * Falls back gracefully if transcoder fails to load.
 */

import { useGLTF } from '@react-three/drei';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { useEffect } from 'react';

// CDN paths for decoders (avoids bundling large WASM files)
const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
const BASIS_TRANSCODER_PATH = 'https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/libs/basis/';

// Singleton loaders (reused across components)
let dracoLoader: DRACOLoader | null = null;
let ktx2Loader: KTX2Loader | null = null;

/**
 * Get or create the Draco loader singleton
 */
export function getDracoLoader(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    dracoLoader.setDecoderConfig({ type: 'js' }); // Use JS decoder for better compatibility
  }
  return dracoLoader;
}

/**
 * Get or create the KTX2 loader singleton
 * Requires WebGL renderer for transcoder detection
 */
export function getKTX2Loader(gl: THREE.WebGLRenderer): KTX2Loader {
  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(BASIS_TRANSCODER_PATH);
    ktx2Loader.detectSupport(gl);
  }
  return ktx2Loader;
}

/**
 * Configure a GLTFLoader with Draco and KTX2 support
 */
export function configureGLTFLoader(loader: GLTFLoader, gl: THREE.WebGLRenderer): void {
  loader.setDRACOLoader(getDracoLoader());
  loader.setKTX2Loader(getKTX2Loader(gl));
}

/**
 * Hook to load a GLTF/GLB with full optimization support
 * 
 * @param path - Path to the GLB file
 * @returns GLTF result with scene, nodes, materials, etc.
 * 
 * @example
 * ```tsx
 * function Model() {
 *   const { scene } = useConfiguredGLTF('/models/optimized/capsule.glb');
 *   return <primitive object={scene} />;
 * }
 * ```
 */
export function useConfiguredGLTF(path: string) {
  const { gl } = useThree();
  
  // Configure the loader with Draco and KTX2 support
  const gltf = useLoader(GLTFLoader, path, (loader) => {
    configureGLTFLoader(loader, gl);
  });
  
  return gltf;
}

/**
 * Preload a GLTF/GLB file for faster loading
 * Call this in a parent component or at module level
 */
export function preloadGLTF(path: string): void {
  useGLTF.preload(path);
}

/**
 * Hook to preload multiple models
 */
export function usePreloadModels(paths: string[]): void {
  useEffect(() => {
    paths.forEach(path => {
      useGLTF.preload(path);
    });
  }, [paths]);
}

// Type augmentation for THREE namespace
import type * as THREE from 'three';

