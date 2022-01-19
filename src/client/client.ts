import * as THREE from 'three';
import { Object3D, PerspectiveCamera } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GUI} from 'dat.gui';
import {CelestialBody, createEarth, createMoon, createPlanet, createSaturn, createSaturnRing, getMoonRotationMesh, getRotationMesh, MERCURY_DISTANCE, MERCURY_SIZE, Orbit, Planet, Space, Sun} from "./planets";
import { createSpace } from './space';
import { createSun } from './sun';
import { generateGUIControls, generateGUIControls2 } from './helper/gui';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

export const renderer = new THREE.WebGL1Renderer({canvas});

const fov = 40;

const aspect = 2;
const near = 0.1;

const far = 1000;

let camera = new THREE.PerspectiveCamera(fov,aspect, near, far);
camera.name = "main camera";





//camera.position.z = 2;


camera.position.set(20, 50, 30);
//camera.up.set(0, 0, 1);
//camera.lookAt(0, 0, 0);



//const space = createSpace();


const space2 = new Space();



//const solarSystem = new THREE.Object3D();

const solarSystem2 = new CelestialBody();

//const sun = createSun(space);

const sun2 = new Sun(space2,1.2);



const mercury2 = new Planet("mercury",MERCURY_SIZE,"2k_mercury.jpeg",2,0x92a3b3);

const venus2 =  new Planet("venus",0.7,"2k_venus_atmosphere.jpeg",2,0xdaa969);


//const earth = createEarth("earth",20,1,"2k_earth_daymap.jpeg",0.5,space);
//const moon = createMoon(4,0.2,"2k_moon.jpg",3);
const mars2 = new Planet("mars",1,"2k_mars.jpeg",2,0xea622b);
const jupiter2 = new Planet("jupiter",3,"2k_jupiter.jpeg",2,0xebb672);
const uranus2 = new Planet("uranus",1.5,"2k_uranus.jpeg",2,0x6dc8db);
const neptune2 = new Planet("neptune",1.7,"2k_neptune.jpeg",2,0x05457f);

let fakeCamera = camera.clone();
//const mercuryOrbit = new THREE.Object3D();
const mercuryOrbit2 = new Orbit(mercury2,2,MERCURY_DISTANCE,camera,fakeCamera);
const venusOrbit2 = new Orbit(venus2,1.5,10,camera,fakeCamera);
const marsOrbit2 = new Orbit(mars2,0.7,30,camera,fakeCamera);
const jupiterOrbit2 = new Orbit(jupiter2,0.5,45,camera,fakeCamera);
const uranusOrbit2 = new Orbit(uranus2,0.1,65,camera,fakeCamera);
const neptunusOrbit2 = new Orbit(neptune2,0.04,75,camera,fakeCamera);


//const venusOrbit = new THREE.Object3D();
//const earthOrbit = new THREE.Object3D();
//const moonOrbit = new THREE.Object3D();
//moonOrbit.position.x = 2;
//earthOrbit.add(moonOrbit);
//const marsOrbit = new THREE.Object3D();
//const jupiterOrbit = new THREE.Object3D();
//const saturnOrbit = new THREE.Object3D();
//const uranusOrbit = new THREE.Object3D();
//const neptunusOrbit = new THREE.Object3D();

//space.add(solarSystem)

space2.addCelestialBody(solarSystem2);

//const objectsSolarSystem : THREE.Object3D[] = [];
const objectsSolarSystem2 : CelestialBody[] = [];

//const sun = createSun(space);
//const mercury = createPlanet("mercury",7,0.5,"2k_mercury.jpeg",2);
//const venus = createPlanet("venus",10,0.7,"2k_venus_atmosphere.jpeg",2);
//const earth = createEarth("earth",20,1,"2k_earth_daymap.jpeg",0.5,space);
//const moon = createMoon(4,0.2,"2k_moon.jpg",3);
//const mars = createPlanet("mars",30,1,"2k_mars.jpeg",2);
//const jupiter = createPlanet("jupiter",45,3,"2k_jupiter.jpeg",2);
//const saturn = createSaturn("saturn",55,2,"2k_saturn.jpeg",2);
//const uranus = createPlanet("uranus",65,1.5,"2k_uranus.jpeg",2);
//const neptune = createPlanet("neptune",75,1.7,"2k_neptune.jpeg",2);


//earth.add(moonOrbit);
//mercuryOrbit.userData["rotationSpeed"] = 2;
//venusOrbit.userData["rotationSpeed"] = 1.5;
//earthOrbit.userData["rotationSpeed"] = 1;
//moonOrbit.userData["rotationSpeed"] = 1;
//marsOrbit.userData["rotationSpeed"] = 0.7;
//jupiterOrbit.userData["rotationSpeed"] = 0.5;
//saturnOrbit.userData["rotationSpeed"] = 0.2;
//uranusOrbit.userData["rotationSpeed"] = 0.1;
//neptunusOrbit.userData["rotationSpeed"] = 0.04;

//mercuryOrbit.add(mercury);
//const mercuryRotation = getRotationMesh(mercury);
//mercuryRotation.name = "mr";
//const mercuryCamera = new PerspectiveCamera(fov,aspect,near,far);
//mercuryCamera.position.set(7,0,2);
//mercury.add(mercuryCamera);
//mercuryOrbit.add(mercuryCamera);
//venusOrbit.add(venus);
//venusOrbit.add(getRotationMesh(venus));
//moonOrbit.add(moon);
//const moonRotation = getMoonRotationMesh(moon);
//moonOrbit.add(moonRotation);
//earthOrbit.add(earth);
//earthOrbit.add(getRotationMesh(earth));
//earthOrbit.add(moonOrbit);
//const earthCamera = new PerspectiveCamera(fov,aspect,near,far);
//camera.position.set(22,0,3);
//camera.lookAt(20, 10, 3);
//earth.add(camera);
//const earth2 = earth.getObjectByName("earth");
//let fakeCamera = camera.clone();
export let controls = new OrbitControls(fakeCamera,renderer.domElement);
//controls.enablePan = false;
//controls.enableDamping = false;

controls.update();
//earthOrbit.add(earthCamera);
//earthCamera.position.set(20,0,3);
//marsOrbit.add(mars);
//marsOrbit.add(getRotationMesh(mars));
//jupiterOrbit.add(jupiter);
//jupiterOrbit.add(getRotationMesh(jupiter));
//saturnOrbit.add(saturn);
//saturnOrbit.add(getRotationMesh(saturn));
//saturnOrbit.add(createSaturnRing(saturn));
//uranusOrbit.add(uranus);
//uranusOrbit.add(getRotationMesh(uranus));
//neptunusOrbit.add(neptune);
//neptunusOrbit.add(getRotationMesh(neptune));

//solarSystem.add(sun);
//solarSystem.add(mercuryOrbit);
//solarSystem.add(venusOrbit);
//solarSystem.add(earthOrbit);
//solarSystem.add(marsOrbit);
//solarSystem.add(jupiterOrbit);
//solarSystem.add(saturnOrbit);
//solarSystem.add(uranusOrbit);
//solarSystem.add(neptunusOrbit);

solarSystem2.add(sun2);
solarSystem2.add(mercuryOrbit2);
solarSystem2.add(venusOrbit2);
//solarSystem2.add(earthOrbit2);
solarSystem2.add(marsOrbit2);
solarSystem2.add(jupiterOrbit2);
//solarSystem2.add(saturnOrbit);
solarSystem2.add(uranusOrbit2);
solarSystem2.add(neptunusOrbit2);

// objectsSolarSystem.push(sun);
// objectsSolarSystem.push(mercuryOrbit);
// objectsSolarSystem.push(mercury);
// objectsSolarSystem.push(venusOrbit);
// objectsSolarSystem.push(venus);
// objectsSolarSystem.push(earthOrbit);
// objectsSolarSystem.push(earth2 as THREE.Mesh);
// objectsSolarSystem.push(moon);
// objectsSolarSystem.push(moonOrbit);
// objectsSolarSystem.push(marsOrbit);
// objectsSolarSystem.push(mars);
// objectsSolarSystem.push(jupiterOrbit);
// objectsSolarSystem.push(jupiter);
// objectsSolarSystem.push(saturnOrbit);
// objectsSolarSystem.push(saturn);
// objectsSolarSystem.push(uranusOrbit);
// objectsSolarSystem.push(uranus);
// objectsSolarSystem.push(neptunusOrbit);
// objectsSolarSystem.push(neptune);

objectsSolarSystem2.push(sun2);
objectsSolarSystem2.push(mercuryOrbit2);
objectsSolarSystem2.push(mercury2);
objectsSolarSystem2.push(venusOrbit2);
objectsSolarSystem2.push(venus2);
objectsSolarSystem2.push(marsOrbit2);
objectsSolarSystem2.push(mars2);
objectsSolarSystem2.push(jupiterOrbit2);
objectsSolarSystem2.push(jupiter2);
objectsSolarSystem2.push(uranusOrbit2);
objectsSolarSystem2.push(uranus2);
objectsSolarSystem2.push(neptunusOrbit2);
objectsSolarSystem2.push(neptune2);


//const celestialBodies = new Array(mercuryOrbit,venusOrbit,earthOrbit,marsOrbit,jupiterOrbit,saturnOrbit,uranusOrbit,neptunusOrbit,space.getObjectByName("Sun") as THREE.Object3D,space.getObjectByName("space light") as THREE.Object3D);
const celestialBodies2:CelestialBody[] = [];
celestialBodies2.push(mercuryOrbit2);
celestialBodies2.push(venusOrbit2);
celestialBodies2.push(marsOrbit2);
celestialBodies2.push(jupiterOrbit2);
celestialBodies2.push(uranusOrbit2);
celestialBodies2.push(neptunusOrbit2);
celestialBodies2.push(sun2);
celestialBodies2.push(space2);


//camera.removeFromParent();

//camera = mercuryOrbit.getObjectByName("mr")?.getObjectByName("planetCamera") as THREE.PerspectiveCamera;


//fakeCamera = earthCamera;


//camera = mercuryCamera;
//controls.update();
//controls.reset();
/** GUI controls manegement */

//generateGUIControls(celestialBodies);
generateGUIControls2(celestialBodies2);
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
    camera.copy(fakeCamera);
    //camera.aspect = canvas.clientWidth / canvas.clientHeight;

    //camera.updateProjectionMatrix();

    //cube.rotation.x = time;
    //cube.rotation.y = time;

    //objectsSolarSystem.forEach((obj) => {
    //    obj.rotation.y = obj.userData["rotationSpeed"] !== 0 ? time*obj.userData["rotationSpeed"] : obj.rotation.y;
    //});

    objectsSolarSystem2.forEach((obj) => {
        obj.rotationY = obj.rotationSpeed !== 0 ? time*obj.rotationSpeed : obj.rotationY;
    });

    //camera.lookAt(mercuryOrbit.getObjectByName('mercury')?.position || 0);
    //renderer.render(space, camera);
    renderer.render(space2.getObject(), camera);
   
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);