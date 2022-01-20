import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {CelestialBody, Earth, MERCURY_DISTANCE, MERCURY_SIZE, Orbit, Planet, PlanetRing, Satellite, Space, Sun} from "./planets";
import { generateGUIControls } from './helper/gui';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

export const renderer = new THREE.WebGL1Renderer({canvas});


//** Camera */
const fov = 40;
const aspect = 2;
const near = 0.1;
const far = 1000;
let camera = new THREE.PerspectiveCamera(fov,aspect, near, far);
camera.name = "main camera";
camera.position.set(20, 50, 30);
let fakeCamera = camera.clone(); // used for camera on planets, because Orbit controls needs camera to have no parent


//** Main objects */
const space = new Space();
const solarSystem = new CelestialBody();
space.addCelestialBody(solarSystem);

//** Sun */
const sun = new Sun(space,1.2);

//** Planets */
const mercury = new Planet("mercury",MERCURY_SIZE,"2k_mercury.jpeg",2,0x92a3b3);
const venus =  new Planet("venus",0.7,"2k_venus_atmosphere.jpeg",2,0xdaa969);
const earth =  new Earth("earth",1,0.5,0x2186e4,space,sun);
const moon = new Satellite("moon",0.2,"2k_moon.jpg",3);
const mars = new Planet("mars",1,"2k_mars.jpeg",2,0xea622b);
const jupiter = new Planet("jupiter",3,"2k_jupiter.jpeg",2,0xebb672);
const saturn = new Planet("saturn",2,"2k_saturn.jpeg",2,0xecb673);
const uranus = new Planet("uranus",1.5,"2k_uranus.jpeg",2,0x6dc8db);
const neptune = new Planet("neptune",1.7,"2k_neptune.jpeg",2,0x05457f);


//** Planets orbits */
const mercuryOrbit = new Orbit(mercury,2,MERCURY_DISTANCE,camera,fakeCamera);
const venusOrbit = new Orbit(venus,1.5,10,camera,fakeCamera);
const earthOrbit = new Orbit(earth,1,20,camera,fakeCamera);
const moonOrbit = new Orbit(moon,2,4,camera,fakeCamera);
const marsOrbit = new Orbit(mars,0.7,30,camera,fakeCamera);
const jupiterOrbit = new Orbit(jupiter,0.5,45,camera,fakeCamera);
const saturnOrbit = new Orbit(saturn,0.2,55,camera,fakeCamera);
const uranusOrbit = new Orbit(uranus,0.1,65,camera,fakeCamera);
const neptunusOrbit = new Orbit(neptune,0.04,75,camera,fakeCamera);

const saturnRing = new PlanetRing(saturnOrbit,"2k_saturn_ring_alpha.png");

//** Contains all rotating objects */
const objectsSolarSystem : CelestialBody[] = [];


earthOrbit.addSatellite(moonOrbit);
saturnOrbit.add(saturnRing);
// Controls zoom and movement of the camera
export let controls = new OrbitControls(fakeCamera,renderer.domElement);
controls.update();

//** Add objets to solar system */
solarSystem.add(sun);
solarSystem.add(mercuryOrbit);
solarSystem.add(venusOrbit);
solarSystem.add(earthOrbit);
solarSystem.add(marsOrbit);
solarSystem.add(jupiterOrbit);
solarSystem.add(saturnOrbit);
solarSystem.add(uranusOrbit);
solarSystem.add(neptunusOrbit);


//** Add objets that rotate */
objectsSolarSystem.push(sun);
objectsSolarSystem.push(mercuryOrbit);
objectsSolarSystem.push(mercury);
objectsSolarSystem.push(venusOrbit);
objectsSolarSystem.push(venus);
objectsSolarSystem.push(earthOrbit);
objectsSolarSystem.push(earth);
objectsSolarSystem.push(moon);
objectsSolarSystem.push(moonOrbit);
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


//** Objects that have GUI controls */
const celestialBodies:CelestialBody[] = [];
celestialBodies.push(mercuryOrbit);
celestialBodies.push(venusOrbit);
celestialBodies.push(earthOrbit);
celestialBodies.push(marsOrbit);
celestialBodies.push(jupiterOrbit);
celestialBodies.push(saturnOrbit);
celestialBodies.push(uranusOrbit);
celestialBodies.push(neptunusOrbit);
celestialBodies.push(sun);
celestialBodies.push(space);

generateGUIControls(celestialBodies);

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

    // Copy values from fake camera to original camera
    camera.copy(fakeCamera);
    
    // Rotate objects
    objectsSolarSystem.forEach((obj) => {
        obj.rotationY = obj.rotationSpeed !== 0 ? time*obj.rotationSpeed : obj.rotationY;
    });

    renderer.render(space.getObject(), camera);
   
    requestAnimationFrame(render);
}
requestAnimationFrame(render);