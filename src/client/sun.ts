import { GUI } from "dat.gui";
import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare";
import { sphereGeometry } from "./helper/geometry";
import { CelestialBody } from "./helper/spaceCommons";
import { Space } from "./space";


export class Sun extends CelestialBody {
    
    private light: THREE.PointLight;

    private _sunFlare : boolean;

    private lensFlare: Lensflare;

    private onLightChange: (value:number,light:string) => void = () => {};

    constructor(space:Space,rotationSpeed: number){
        super(rotationSpeed);
        const sunTexture = new THREE.TextureLoader().load("2k_sun.jpeg");
        const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
        const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);
        sunMesh.scale.set(5,5,5);
        {
            const color = 0xFFFFFF;
            const intensity = 2;
            const light = new THREE.PointLight(color, intensity);
            light.name = "Sun";
            this.light = light;
            this.lensFlare = new Lensflare(); // effects of flare for the sun light
            this.lensFlare.name = "sun flare";
            const textureFlare = new THREE.TextureLoader().load("sun-flare.jpg");
            this.lensFlare.addElement(new LensflareElement(textureFlare,160,0));
            this.lensFlare.addElement(new LensflareElement(textureFlare,160,0));
            this.lensFlare.addElement(new LensflareElement(textureFlare,2600,0));
            light.add(this.lensFlare);
            this._sunFlare = true;
            space.addSunLight(light);
        }
        this.object = sunMesh;
    }

    getLight(){
        return this.light;
    }

    setOnLightChange(func:(value:number,light:string) => void){
        this.onLightChange = func;
    }

    get sunFlare(){
        return this._sunFlare;
    }

    set sunFlare(flare:boolean){
        this._sunFlare = flare;
        if (flare){
            this.light.add(this.lensFlare);
        } else {
            this.light.remove(this.lensFlare);
        }
    }

    buildUserControls(gui: GUI){
        const sunControlFolder = gui.addFolder("Sun");
        sunControlFolder.add(this.light,"intensity",0,4).name("Shininess").onChange((value) => this.onLightChange(value,"pointLightIntensity"));
        sunControlFolder.add(this,"sunFlare").name("Sun flare");
        super.buildUserControls(sunControlFolder);
    }
}