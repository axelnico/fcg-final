import * as THREE from "three";

const radius = 1;
const widthSegments = 75;
const heightSegments = 75;
const sphereGeometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);

export const createSun = (scene: THREE.Scene) => {
    const sunTexture = new THREE.TextureLoader().load("2k_sun.jpeg");
    const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
    const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);
    sunMesh.scale.set(5,5,5);
    {
        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.PointLight(color, intensity);
        scene.add(light);
    }
    sunMesh.userData["rotationSpeed"] = 1;
    return sunMesh;
}