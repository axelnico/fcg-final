import * as THREE from "three";

export const createSpace = (scene: THREE.Scene) => {
    const loader = new THREE.TextureLoader();
    loader.load("2k_stars_milky_way.jpeg",function(texture) {
        scene.background = texture;
    })
}