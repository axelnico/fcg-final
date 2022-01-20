import { GUI } from "dat.gui";
import * as THREE from "three";
import { CelestialBody } from "./helper/spaceCommons";

export class Space extends CelestialBody {

    private light: THREE.AmbientLight;

    private onLightChange: (value:number,light:string) => void = () => {};

    constructor(){
        super();
        const scene = new THREE.Scene();
        const loader = new THREE.TextureLoader();
        loader.load("2k_stars_milky_way.jpeg",function(texture) {
            scene.background = texture;
        })
        const spaceLight = new THREE.AmbientLight(0xFFFFFF,0);
        spaceLight.name = "space light";
        scene.add(spaceLight);
        

        this.object = scene;
       
        this.light = spaceLight;
    }

    addSunLight(light: THREE.PointLight) {
        this.object.add(light);
    }

    addCelestialBody(body: CelestialBody){
        this.object.add(body.getObject());
    }

    getLight(){
        return this.light;
    }

    setOnLightChange(func:(value:number,light:string) => void){
        this.onLightChange = func;
    }

    buildUserControls(gui: GUI){
        const spaceControlFolder = gui.addFolder("Space");;
        spaceControlFolder.add(this.light,"intensity",0,0.3,0.05).name("Darkness").onChange((value) => this.onLightChange(value,"ambientLightIntensity"));
    }
}