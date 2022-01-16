import * as THREE from 'three';
import { Object3D, PerspectiveCamera } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GUI} from 'dat.gui';
import {createEarth, createPlanet, getRotationMesh} from "./planets";
import { createSpace } from './space';
import { createSun } from './sun';
import { generateGUIControls } from './helper/gui';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

const renderer = new THREE.WebGL1Renderer({canvas});

const fov = 40;

const aspect = 2;
const near = 0.1;

const far = 1000;

let camera = new THREE.PerspectiveCamera(fov,aspect, near, far);






//camera.position.z = 2;
const controls = new OrbitControls(camera,renderer.domElement);

camera.position.set(20, 50, 30);
//camera.up.set(0, 0, 1);
//camera.lookAt(0, 0, 0);


controls.update();


const space = createSpace();

const solarSystem = new THREE.Object3D();
const mercuryOrbit = new THREE.Object3D();
const venusOrbit = new THREE.Object3D();
const earthOrbit = new THREE.Object3D();
const marsOrbit = new THREE.Object3D();
const jupiterOrbit = new THREE.Object3D();
const saturnOrbit = new THREE.Object3D();
const uranusOrbit = new THREE.Object3D();
const neptunusOrbit = new THREE.Object3D();

space.add(solarSystem)

const objectsSolarSystem : THREE.Object3D[] = [];

const sun = createSun(space);
const mercury = createPlanet("mercury",7,0.5,"2k_mercury.jpeg",2);
const venus = createPlanet("venus",10,0.7,"2k_venus_atmosphere.jpeg",2);
const earth = createEarth("earth",20,1,"2k_earth_daymap.jpeg",0.5,space);
const mars = createPlanet("mars",30,1,"2k_mars.jpeg",2);
const jupiter = createPlanet("jupiter",45,3,"2k_jupiter.jpeg",2);
const saturn = createPlanet("saturn",55,2,"2k_saturn.jpeg",2);
const uranus = createPlanet("uranus",65,1.5,"2k_uranus.jpeg",2);
const neptune = createPlanet("neptune",75,1.7,"2k_neptune.jpeg",2);

mercuryOrbit.userData["rotationSpeed"] = 2;
venusOrbit.userData["rotationSpeed"] = 1.5;
earthOrbit.userData["rotationSpeed"] = 1;
marsOrbit.userData["rotationSpeed"] = 0.7;
jupiterOrbit.userData["rotationSpeed"] = 0.5;
saturnOrbit.userData["rotationSpeed"] = 0.2;
uranusOrbit.userData["rotationSpeed"] = 0.1;
neptunusOrbit.userData["rotationSpeed"] = 0.04;

mercuryOrbit.add(mercury);
const mercuryRotation = getRotationMesh(mercury);
mercuryRotation.name = "mr";
const mercuryCamera = new PerspectiveCamera(fov,aspect,near,far);
mercuryCamera.position.set(7,0,2);
mercuryOrbit.add(mercuryRotation);
//mercury.add(mercuryCamera);
mercuryOrbit.add(mercuryCamera);
venusOrbit.add(venus);
venusOrbit.add(getRotationMesh(venus));
earthOrbit.add(earth);
earthOrbit.add(getRotationMesh(earth));
const earthCamera = new PerspectiveCamera(fov,aspect,near,far);
earthOrbit.add(earthCamera);
earthCamera.position.set(20,0,3);
marsOrbit.add(mars);
marsOrbit.add(getRotationMesh(mars));
jupiterOrbit.add(jupiter);
jupiterOrbit.add(getRotationMesh(jupiter));
saturnOrbit.add(saturn);
saturnOrbit.add(getRotationMesh(saturn));
uranusOrbit.add(uranus);
uranusOrbit.add(getRotationMesh(uranus));
neptunusOrbit.add(neptune);
neptunusOrbit.add(getRotationMesh(neptune));

solarSystem.add(sun);
solarSystem.add(mercuryOrbit);
solarSystem.add(venusOrbit);
solarSystem.add(earthOrbit);
solarSystem.add(marsOrbit);
solarSystem.add(jupiterOrbit);
solarSystem.add(saturnOrbit);
solarSystem.add(uranusOrbit);
solarSystem.add(neptunusOrbit);

objectsSolarSystem.push(sun);
objectsSolarSystem.push(mercuryOrbit);
objectsSolarSystem.push(mercury);
objectsSolarSystem.push(venusOrbit);
objectsSolarSystem.push(venus);
objectsSolarSystem.push(earthOrbit);
objectsSolarSystem.push(earth);
objectsSolarSystem.push(marsOrbit);
objectsSolarSystem.push(mars);
objectsSolarSystem.push(jupiterOrbit);
objectsSolarSystem.push(jupiter);
objectsSolarSystem.push(saturnOrbit);
objectsSolarSystem.push(saturn);
objectsSolarSystem.push(uranusOrbit);
objectsSolarSystem.push(uranus);
objectsSolarSystem.push(neptunusOrbit);
objectsSolarSystem.push(neptune);


const celestialBodies = new Array(mercuryOrbit,venusOrbit,earthOrbit,marsOrbit,jupiterOrbit,saturnOrbit,uranusOrbit,neptunusOrbit,space.getObjectByName("Sun") as THREE.Object3D,space.getObjectByName("space light") as THREE.Object3D);
//camera.removeFromParent();

//camera = mercuryOrbit.getObjectByName("mr")?.getObjectByName("planetCamera") as THREE.PerspectiveCamera;

camera = earthCamera;
//camera = mercuryCamera;
//controls.update();
/** GUI controls manegement */

generateGUIControls(celestialBodies);
//const gui = new GUI();
//const planetsControlFolder = gui.addFolder('Planets');
//const controller = planetsControlFolder.add(mercuryOrbit.userData,"rotationSpeed",0,4).name("Mercury rotation speed");

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
        obj.rotation.y = obj.userData["rotationSpeed"] !== 0 ? time*obj.userData["rotationSpeed"] : obj.rotation.y;
    });

    //camera.lookAt(mercuryOrbit.getObjectByName('mercury')?.position || 0);
    renderer.render(space, camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);