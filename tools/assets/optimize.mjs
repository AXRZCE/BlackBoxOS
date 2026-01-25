#!/usr/bin/env node
/**
 * BLACKBOX OS Asset Optimization Pipeline
 * 
 * Optimizes GLB files using gltf-transform:
 * - Deduplicates data
 * - Prunes unused nodes
 * - Welds vertices
 * - Compresses with Draco
 * - Generates budget report
 * 
 * Usage: node tools/assets/optimize.mjs [--input <path>] [--output <path>]
 */

import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import {
  dedup,
  prune,
  weld,
  quantize,
  draco,
} from '@gltf-transform/functions';
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, basename, extname } from 'path';

// Configuration
const INPUT_DIR = process.argv.includes('--input') 
  ? process.argv[process.argv.indexOf('--input') + 1]
  : 'public/models/raw';
const OUTPUT_DIR = process.argv.includes('--output')
  ? process.argv[process.argv.indexOf('--output') + 1]
  : 'public/models/optimized';

// Budget targets
const BUDGET = {
  maxFileSizeMB: 2.5,
  maxTriangles: 100000,
  warnFileSizeMB: 1.5,
  warnTriangles: 50000,
};

async function getModelStats(document) {
  let triangles = 0;
  let vertices = 0;
  
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const indices = prim.getIndices();
      const position = prim.getAttribute('POSITION');
      
      if (indices) {
        triangles += indices.getCount() / 3;
      } else if (position) {
        triangles += position.getCount() / 3;
      }
      
      if (position) {
        vertices += position.getCount();
      }
    }
  }
  
  return { triangles: Math.round(triangles), vertices };
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function optimizeModel(inputPath, outputPath) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  
  console.log(`\n📦 Processing: ${basename(inputPath)}`);
  
  // Read input
  const document = await io.read(inputPath);
  const inputStats = await getModelStats(document);
  const inputSize = statSync(inputPath).size;
  
  console.log(`   Input: ${formatBytes(inputSize)}, ${inputStats.triangles} triangles`);
  
  // Apply optimizations
  await document.transform(
    dedup(),
    prune(),
    weld({ tolerance: 0.0001 }),
    quantize(),
    draco({ quantizePosition: 14, quantizeNormal: 10 }),
  );
  
  // Write output
  await io.write(outputPath, document);
  
  const outputSize = statSync(outputPath).size;
  const outputStats = await getModelStats(document);
  const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
  
  console.log(`   Output: ${formatBytes(outputSize)}, ${outputStats.triangles} triangles`);
  console.log(`   Reduction: ${reduction}%`);
  
  // Budget check
  const sizeMB = outputSize / (1024 * 1024);
  const warnings = [];
  
  if (sizeMB > BUDGET.maxFileSizeMB) {
    warnings.push(`❌ OVER BUDGET: File size ${sizeMB.toFixed(2)}MB > ${BUDGET.maxFileSizeMB}MB`);
  } else if (sizeMB > BUDGET.warnFileSizeMB) {
    warnings.push(`⚠️  File size ${sizeMB.toFixed(2)}MB approaching limit`);
  }
  
  if (outputStats.triangles > BUDGET.maxTriangles) {
    warnings.push(`❌ OVER BUDGET: ${outputStats.triangles} triangles > ${BUDGET.maxTriangles}`);
  } else if (outputStats.triangles > BUDGET.warnTriangles) {
    warnings.push(`⚠️  ${outputStats.triangles} triangles approaching limit`);
  }
  
  warnings.forEach(w => console.log(`   ${w}`));
  
  return {
    name: basename(inputPath),
    inputSize,
    outputSize,
    reduction: parseFloat(reduction),
    triangles: outputStats.triangles,
    vertices: outputStats.vertices,
    warnings,
  };
}

async function main() {
  console.log('🔧 BLACKBOX OS Asset Optimization Pipeline\n');
  console.log(`Input:  ${INPUT_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Find all GLB files
  if (!existsSync(INPUT_DIR)) {
    console.log(`\n⚠️  Input directory not found: ${INPUT_DIR}`);
    console.log('   Create the directory and add GLB files to optimize.');
    return;
  }
  
  const files = readdirSync(INPUT_DIR).filter(f => 
    extname(f).toLowerCase() === '.glb' || extname(f).toLowerCase() === '.gltf'
  );
  
  if (files.length === 0) {
    console.log(`\n⚠️  No GLB/GLTF files found in ${INPUT_DIR}`);
    console.log('   Add models to optimize.');
    return;
  }
  
  console.log(`\nFound ${files.length} model(s) to optimize...\n`);
  
  const results = [];
  for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const outputPath = join(OUTPUT_DIR, file);
    
    try {
      const result = await optimizeModel(inputPath, outputPath);
      results.push(result);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      results.push({ name: file, error: err.message });
    }
  }
  
  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 BUDGET REPORT');
  console.log('='.repeat(60));
  
  const totalInput = results.reduce((sum, r) => sum + (r.inputSize || 0), 0);
  const totalOutput = results.reduce((sum, r) => sum + (r.outputSize || 0), 0);
  const totalTriangles = results.reduce((sum, r) => sum + (r.triangles || 0), 0);
  
  console.log(`\nTotal input:  ${formatBytes(totalInput)}`);
  console.log(`Total output: ${formatBytes(totalOutput)}`);
  console.log(`Total reduction: ${((1 - totalOutput / totalInput) * 100).toFixed(1)}%`);
  console.log(`Total triangles: ${totalTriangles.toLocaleString()}`);
  
  // Save report as JSON
  const reportPath = join(OUTPUT_DIR, 'budget-report.json');
  writeFileSync(reportPath, JSON.stringify({ 
    generated: new Date().toISOString(),
    budget: BUDGET,
    models: results,
    totals: { inputSize: totalInput, outputSize: totalOutput, triangles: totalTriangles }
  }, null, 2));
  
  console.log(`\n✅ Report saved to: ${reportPath}`);
}

main().catch(console.error);

