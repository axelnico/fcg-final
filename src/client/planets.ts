import * as THREE from "three";

// All planets use the same geometry. An sphere of radius 1
const radius = 1;
const widthSegments = 75;
const heightSegments = 75;
const sphereGeometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);


const fov = 40;

const aspect = 2;
const near = 0.1;

const far = 1000;


export const getRotationMesh = (planet: THREE.Mesh) => {
    const boxGeometry = new THREE.BoxGeometry(planet.position.x,0.25,0.25);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(boxGeometry,material);
    mesh.position.x = planet.position.x / 2;
    mesh.visible = false;
    const camera = new THREE.PerspectiveCamera(fov,aspect, near, far);
    camera.name = "planetCamera";
    camera.position.set(planet.position.x - 10,0.25,0.25)
    mesh.add(camera);
    return mesh;
}

export const createPlanet = (position: number, size: number, surface: string, rotationSpeed: number) => {
    const texture = new THREE.TextureLoader().load(surface);
    const planetMaterial = new THREE.MeshPhongMaterial({map: texture});
    const planetMesh = new THREE.Mesh(sphereGeometry,planetMaterial);
    planetMesh.position.x = position;
    planetMesh.scale.set(size,size,size);
    planetMesh.userData["rotationSpeed"] = rotationSpeed;
    return planetMesh;
}