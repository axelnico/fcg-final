import { GUI } from "dat.gui";
import * as THREE from "three";

//** Distance of planets to the sun */
export const MERCURY_DISTANCE = 7;
export const VENUS_DISTANCE = 10;
export const EARTH_DISTANCE = 20;
export const MARS_DISTANCE = 30;
export const JUPITER_DISTANCE = 45;
export const SATURN_DISTANCE = 55;
export const URANUS_DISTANCE = 65;
export const NEPTUNE_DISTANCE = 75;
export const MOON_DISTANCE = 4; // distance of moon to Earth

//** Sizes of the planets and moon */
export const MERCURY_SIZE = 0.5;
export const VENUS_SIZE = 0.7;
export const EARTH_SIZE = 1;
export const MOON_SIZE = 0.2;
export const MARS_SIZE = 1;
export const JUPITER_SIZE = 3;
export const SATURN_SIZE = 2;
export const URANUS_SIZE = 1.5;
export const NEPTUNE_SIZE = 1.7;

//** Rotation speed of planets and moon*/
export const MERCURY_ROTATION_SPEED = 2;
export const VENUS_ROTATION_SPEED = 1.3;
export const EARTH_ROTATION_SPEED = 0.5;
export const MOON_ROTATION_SPEED = 3;
export const MARS_ROTATION_SPEED = 0.9;
export const JUPITER_ROTATION_SPEED = 0.8;
export const SATURN_ROTATION_SPEED = 0.7;
export const URANUS_ROTATION_SPEED = 0.4;
export const NEPTUNE_ROTATION_SPEED = 0.3;

//** Orbit speed of planets and moon*/
export const MERCURY_ORBIT_SPEED = 2;
export const VENUS_ORBIT_SPEED = 1.5;
export const EARTH_ORBIT_SPEED = 1;
export const MOON_ORBIT_SPEED = 2;
export const MARS_ORBIT_SPEED = 0.7;
export const JUPITER_ORBIT_SPEED = 0.5;
export const SATURN_ORBIT_SPEED = 0.2;
export const URANUS_ORBIT_SPEED = 0.1;
export const NEPTUNE_ORBIT_SPEED = 0.04;

//** Surface of planets and moon */
export const MERCURY_SURFACE = "2k_mercury.jpeg";
export const VENUS_SURFACE = "2k_venus_atmosphere.jpeg";
export const EARTH_SURFACE = ""; // uses several textures for surfaces as shown on Earth class
export const MOON_SURFACE = "2k_moon.jpg";
export const MARS_SURFACE = "2k_mars.jpeg";
export const JUPITER_SURFACE = "2k_jupiter.jpeg";
export const SATURN_SURFACE = "2k_saturn.jpeg";
export const URANUS_SURFACE = "2k_uranus.jpeg";
export const NEPTUNE_SURFACE = "2k_neptune.jpeg";

//** Basic color of planets */
export const MERCURY_COLOR = 0x92a3b3;
export const VENUS_COLOR = 0xdaa969;
export const EARTH_COLOR = 0x2186e4;
export const MARS_COLOR = 0xea622b;
export const JUPITER_COLOR = 0xebb672;
export const SATURN_COLOR = 0xecb673;
export const URANUS_COLOR = 0x6dc8db;
export const NEPTUNE_COLOR = 0x05457f;


export const SATURN_RING = "2k_saturn_ring_alpha.png";

export const SUN_ROTATION_SPEED = 1.2;

export class CelestialBody {
    
    protected object:THREE.Object3D;

    private _rotationSpeed : number;

    constructor(rotationSpeed = 0){
        this.object = new THREE.Object3D();
        this._rotationSpeed = rotationSpeed;
    }

    add(anotherObject: CelestialBody){
        this.object.add(anotherObject.getObject());
    }

    getObject() {
        return this.object;
    }

    get rotationSpeed() : number {
        return this._rotationSpeed;       
    }

    set rotationSpeed(speed:number) {
        this._rotationSpeed = speed;
    }

    get rotationY() : number {
        return this.object.rotation.y;       
    }

    set rotationY(rotation:number) {
        this.object.rotation.y = rotation;
    }

    buildUserControls(gui: GUI){
        gui.add(this,"rotationSpeed",0,4).name("Rotation");
    }
}