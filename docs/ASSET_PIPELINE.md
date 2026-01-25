# BLACKBOX OS Asset Pipeline

## Overview

This document describes the asset optimization pipeline for 3D models in BLACKBOX OS. All GLB/GLTF models should be processed through this pipeline before deployment.

## Quick Start

```bash
# 1. Place raw models in the input directory
cp your-model.glb public/models/raw/

# 2. Run the optimization script
node tools/assets/optimize.mjs

# 3. Optimized models appear in public/models/optimized/
```

## Budget Targets

| Metric | Warning | Maximum |
|--------|---------|---------|
| File size per model | 1.5 MB | 2.5 MB |
| Triangles per model | 50,000 | 100,000 |
| Total initial load | - | 8-12 MB |
| Total visible triangles | - | 250,000 |

## Pipeline Steps

The optimization script applies these transforms in order:

1. **Dedup** - Remove duplicate accessors, textures, materials
2. **Prune** - Remove unused nodes, meshes, materials
3. **Weld** - Merge vertices within tolerance (0.0001)
4. **Quantize** - Reduce precision of vertex attributes
5. **Draco** - Compress geometry with Draco encoder

### Draco Settings

- Position quantization: 14 bits
- Normal quantization: 10 bits

## Directory Structure

```
public/models/
├── raw/           # Source models (not deployed)
├── optimized/     # Processed models (deployed)
│   └── budget-report.json
```

## Texture Guidelines

| Use Case | Max Resolution | Format |
|----------|---------------|--------|
| Diffuse/Albedo | 1024x1024 | KTX2 (BC7/ASTC) |
| Normal maps | 1024x1024 | KTX2 (BC5) |
| Roughness/Metal | 512x512 | KTX2 (BC4) |
| Environment | 512x512 | KTX2 |

## Manual Optimization Tips

### Before running the pipeline:

1. **Clean up in Blender/Maya**
   - Remove hidden objects
   - Apply modifiers
   - Delete unused materials
   - Merge by distance (0.0001m)

2. **Texture prep**
   - Resize to power-of-2 dimensions
   - Use PNG for source, let pipeline compress
   - Combine maps where possible (ORM packing)

3. **Geometry**
   - Decimate high-poly meshes
   - Use LODs for complex models
   - Avoid n-gons (triangulate)

### CLI Commands

```bash
# Optimize single file
node tools/assets/optimize.mjs --input ./my-model.glb --output ./optimized.glb

# Optimize entire directory (default)
node tools/assets/optimize.mjs

# Using gltf-transform CLI directly
npx gltf-transform optimize input.glb output.glb --compress draco
```

## Troubleshooting

### "File too large after optimization"

1. Check texture resolutions (resize to 1024 max)
2. Simplify geometry in modeling software
3. Remove embedded animations if not needed

### "Too many triangles"

1. Use Blender's Decimate modifier
2. Remove internal/hidden geometry
3. Consider LOD system for complex models

### "Draco compression failed"

1. Ensure model has valid geometry
2. Check for degenerate triangles
3. Try without Draco: remove `draco()` from pipeline

## Integration with Projects

Update `src/data/projects.ts` to reference optimized models:

```typescript
{
  id: 'project-1',
  title: 'Neural Interface',
  // ...
  modelPath: '/models/optimized/neural-interface.glb',
}
```

## CI/CD Integration

Add to your build process:

```yaml
# .github/workflows/build.yml
- name: Optimize 3D Assets
  run: node tools/assets/optimize.mjs
```

## Resources

- [gltf-transform documentation](https://gltf-transform.dev/)
- [Draco compression](https://google.github.io/draco/)
- [KTX2 textures](https://www.khronos.org/ktx/)

