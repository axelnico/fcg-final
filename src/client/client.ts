import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Earth, Orbit, Planet, PlanetRing, Satellite} from "./planets";
import { generateGUIControls } from './helper/gui';
import { CelestialBody, 
    EARTH_COLOR, 
    EARTH_DISTANCE, 
    EARTH_ORBIT_SPEED, 
    EARTH_ROTATION_SPEED, 
    EARTH_SIZE, 
    JUPITER_COLOR, 
    JUPITER_DISTANCE, 
    JUPITER_ORBIT_SPEED,
    JUPITER_ROTATION_SPEED, 
    JUPITER_SIZE, 
    JUPITER_SURFACE, 
    MARS_COLOR, 
    MARS_DISTANCE, 
    MARS_ORBIT_SPEED, 
    MARS_ROTATION_SPEED, 
    MARS_SIZE, 
    MARS_SURFACE, 
    MERCURY_COLOR, 
    MERCURY_DISTANCE, 
    MERCURY_ORBIT_SPEED, 
    MERCURY_ROTATION_SPEED, 
    MERCURY_SIZE, 
    MERCURY_SURFACE, 
    MOON_DISTANCE, 
    MOON_ORBIT_SPEED, 
    MOON_ROTATION_SPEED, 
    MOON_SIZE, 
    MOON_SURFACE, 
    NEPTUNE_COLOR, 
    NEPTUNE_DISTANCE, 
    NEPTUNE_ORBIT_SPEED, 
    NEPTUNE_ROTATION_SPEED, 
    NEPTUNE_SIZE, 
    NEPTUNE_SURFACE, 
    SATURN_COLOR, 
    SATURN_DISTANCE, 
    SATURN_ORBIT_SPEED, 
    SATURN_RING, 
    SATURN_ROTATION_SPEED, 
    SATURN_SIZE, 
    SATURN_SURFACE, 
    SUN_ROTATION_SPEED, 
    URANUS_COLOR, 
    URANUS_DISTANCE, 
    URANUS_ORBIT_SPEED, 
    URANUS_ROTATION_SPEED, 
    URANUS_SIZE, 
    URANUS_SURFACE, 
    VENUS_COLOR, 
    VENUS_DISTANCE, 
    VENUS_ORBIT_SPEED, 
    VENUS_ROTATION_SPEED, 
    VENUS_SIZE, 
    VENUS_SURFACE } from './helper/spaceCommons';
import { Space } from './space';
import { Sun } from './sun';

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
const sun = new Sun(space,SUN_ROTATION_SPEED);

//** Planets and moon*/
const mercury = new Planet("mercury",MERCURY_SIZE,MERCURY_SURFACE,MERCURY_ROTATION_SPEED,MERCURY_COLOR);
const venus =  new Planet("venus",VENUS_SIZE,VENUS_SURFACE,VENUS_ROTATION_SPEED,VENUS_COLOR);
const earth =  new Earth("earth",EARTH_SIZE,EARTH_ROTATION_SPEED,EARTH_COLOR,space,sun);
const moon = new Satellite("moon",MOON_SIZE,MOON_SURFACE,MOON_ROTATION_SPEED);
const mars = new Planet("mars",MARS_SIZE,MARS_SURFACE,MARS_ROTATION_SPEED,MARS_COLOR);
const jupiter = new Planet("jupiter",JUPITER_SIZE,JUPITER_SURFACE,JUPITER_ROTATION_SPEED,JUPITER_COLOR);
const saturn = new Planet("saturn",SATURN_SIZE,SATURN_SURFACE,SATURN_ROTATION_SPEED,SATURN_COLOR);
const uranus = new Planet("uranus",URANUS_SIZE,URANUS_SURFACE,URANUS_ROTATION_SPEED,URANUS_COLOR);
const neptune = new Planet("neptune",NEPTUNE_SIZE,NEPTUNE_SURFACE,NEPTUNE_ROTATION_SPEED,NEPTUNE_COLOR);


//** Planets orbits */
const mercuryOrbit = new Orbit(mercury,MERCURY_ORBIT_SPEED,MERCURY_DISTANCE,camera,fakeCamera);
const venusOrbit = new Orbit(venus,VENUS_ORBIT_SPEED,VENUS_DISTANCE,camera,fakeCamera);
const earthOrbit = new Orbit(earth,EARTH_ORBIT_SPEED,EARTH_DISTANCE,camera,fakeCamera);
const moonOrbit = new Orbit(moon,MOON_ORBIT_SPEED,MOON_DISTANCE,camera,fakeCamera);
const marsOrbit = new Orbit(mars,MARS_ORBIT_SPEED,MARS_DISTANCE,camera,fakeCamera);
const jupiterOrbit = new Orbit(jupiter,JUPITER_ORBIT_SPEED,JUPITER_DISTANCE,camera,fakeCamera);
const saturnOrbit = new Orbit(saturn,SATURN_ORBIT_SPEED,SATURN_DISTANCE,camera,fakeCamera);
const uranusOrbit = new Orbit(uranus,URANUS_ORBIT_SPEED,URANUS_DISTANCE,camera,fakeCamera);
const neptuneOrbit = new Orbit(neptune,NEPTUNE_ORBIT_SPEED,NEPTUNE_DISTANCE,camera,fakeCamera);

const saturnRing = new PlanetRing(saturnOrbit,SATURN_RING);

//** Contains all rotating objects */
const objectsSolarSystem : CelestialBody[] = [];


earthOrbit.addSatellite(moonOrbit);
saturnOrbit.add(saturnRing);
// Controls zoom and movement of the camera
export let controls = new OrbitControls(fakeCamera,renderer.domElement);
controls.update();

//** Add objects to solar system */
solarSystem.add(sun);
solarSystem.add(mercuryOrbit);
solarSystem.add(venusOrbit);
solarSystem.add(earthOrbit);
solarSystem.add(marsOrbit);
solarSystem.add(jupiterOrbit);
solarSystem.add(saturnOrbit);
solarSystem.add(uranusOrbit);
solarSystem.add(neptuneOrbit);


//** Add objects that rotate */
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
objectsSolarSystem.push(neptuneOrbit);
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
celestialBodies.push(neptuneOrbit);
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