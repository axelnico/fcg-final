import * as THREE from "three";

// All planets, satellites and the sun use the same geometry. An sphere of radius 1
const radius = 1;
const widthSegments = 75;
const heightSegments = 75;
export const sphereGeometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);