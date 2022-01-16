import * as THREE from "three";

export const SUN_DISTANCE = 0;
export const SUN_SIZE = 5;


const radius = 1;
const widthSegments = 75;
const heightSegments = 75;
const sphereGeometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);


export const createSun = (space: THREE.Scene) => {
    const sunTexture = new THREE.TextureLoader().load("2k_sun.jpeg");
    const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
    const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);
    sunMesh.scale.set(5,5,5);
    {
        const color = 0xFFFFFF;
        const intensity = 2;
        const light = new THREE.PointLight(color, intensity);
        light.name = "Sun";
        space.add(light);
    }
    //sunMesh.name = "Sun";
    sunMesh.type = "sun";
    sunMesh.userData["rotationSpeed"] = 1;
    return sunMesh;
}