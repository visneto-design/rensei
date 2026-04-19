// Water filter funnel — simplified thin-walled for 3D printing
// Conical funnel with mounting cylinder at wide end (threads to be engraved),
// internal filter attachment cylinder, and nozzle at narrow end.
// Print orientation: mounting cylinder down (flat on bed), nozzle pointing up.

// TODO: rensei/modeling has a CJS interop bug — import * as modeling
// doesn't resolve @jscad/modeling properties. Using direct import for now.
import jscad from '@jscad/modeling'
const { polygon } = jscad.primitives
const { align, mirrorZ } = jscad.transforms
const extrudeRotate = jscad.extrusions.extrudeRotate

export function main() {
    const holeRadius = 7
    const wall = 2

    // Nozzle / beccuccio (narrow end, pointing down when installed)
    const nozzleTipRadius = 9
    const nozzleBaseRadius = 12
    const nozzleLength = 12

    // Mounting cylinder: 56mm inner diameter, thin wall
    const cylinderInnerRadius = 28 // 56mm inner ⌀
    const cylinderWall = 2
    const cylinderOuterRadius = cylinderInnerRadius + cylinderWall // 30mm outer
    const cylinderHeight = 8

    // Filter attachment cylinder: inside funnel, opposite direction of nozzle
    // 23mm outer diameter, 10mm tall, extends upward into mounting cylinder
    const filterOuterRadius = 11.5 // 23mm / 2
    const filterWall = 2
    const filterInnerRadius = filterOuterRadius - filterWall // 9.5mm
    const filterHeight = 10

    // Heights (nozzle tip = 0)
    const nozzleBottom = 0
    const funnelBottom = nozzleLength
    const funnelTop = funnelBottom + 8
    const cylinderTop = funnelTop + cylinderHeight
    const filterTop = funnelBottom + filterHeight

    // Where the funnel inner slope hits the filter outer wall
    const funnelAtFilter = funnelTop - ((cylinderInnerRadius - filterOuterRadius) / (cylinderInnerRadius - (nozzleBaseRadius - wall))) * (funnelTop - funnelBottom)

    const pts: [number, number][] = []

    // === OUTER SURFACE (bottom → top) ===
    pts.push([nozzleTipRadius, nozzleBottom])
    pts.push([nozzleBaseRadius, funnelBottom])
    pts.push([cylinderOuterRadius, funnelTop])
    pts.push([cylinderOuterRadius, cylinderTop])

    // === CYLINDER TOP ===
    pts.push([cylinderInnerRadius, cylinderTop])

    // === INNER SURFACE (top → bottom) ===
    pts.push([cylinderInnerRadius, funnelTop])
    pts.push([filterOuterRadius, funnelAtFilter])

    // Filter cylinder
    pts.push([filterOuterRadius, filterTop])
    pts.push([filterInnerRadius, filterTop])
    pts.push([filterInnerRadius, funnelBottom])

    // Funnel floor to nozzle hole
    pts.push([holeRadius, funnelBottom])
    pts.push([holeRadius, nozzleBottom])

    const body = extrudeRotate({ segments: 64 }, polygon({ points: pts }))

    // Print nozzle-down: the funnel cone overhang is gradual (conical)
    // and FDM handles it fine. The filter cylinder builds naturally
    // upward from the funnel floor — no cantilever.
    return align(
        { modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0] },
        body,
    )
}
