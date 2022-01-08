import * as THREE from 'three';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

const renderer = new THREE.WebGL1Renderer({canvas});

const fov = 40;

const aspect = 2;
const near = 0.1;

const far = 1000;

const camera = new THREE.PerspectiveCamera(fov,aspect, near, far);

//camera.position.z = 2;

camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

{
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
}

const loader = new THREE.TextureLoader();


loader.load("2k_stars_milky_way.jpeg",function(texture) {
    scene.background = texture;
})



const objectsSolarSystem : THREE.Mesh[] = [];

const radius = 1;
const widthSegments = 75;
const heightSegments = 75;
const sphereGeometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);


const texture = new THREE.TextureLoader().load("2k_sun.jpeg");

const sunMaterial = new THREE.MeshBasicMaterial({map: texture});

const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);

sunMesh.scale.set(5,5,5);
scene.add(sunMesh);
objectsSolarSystem.push(sunMesh);



function resizeRendererToDisplaySize(renderer: THREE.WebGL1Renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}


function render(time: number) {
    time *= 0.001;  // convert time to seconds
   
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    const canvas = renderer.domElement;

    //camera.aspect = canvas.clientWidth / canvas.clientHeight;

    //camera.updateProjectionMatrix();

    //cube.rotation.x = time;
    //cube.rotation.y = time;

    objectsSolarSystem.forEach((obj) => {
        obj.rotation.y = time;
    });
   
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);