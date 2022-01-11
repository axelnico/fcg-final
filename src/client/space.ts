import * as THREE from "three";

export const createSpace = () => {
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    loader.load("2k_stars_milky_way.jpeg",function(texture) {
        scene.background = texture;
    })
    const spaceLight = new THREE.AmbientLight(0xFFFFFF,0);
    spaceLight.name = "space light";
    scene.add(spaceLight);
    return scene;
}