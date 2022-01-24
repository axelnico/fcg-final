import { GUI } from "dat.gui";
import * as THREE from "three";
import { controls } from "./client";
import { CelestialBody } from "./helper/spaceCommons";
import { sphereGeometry } from "./helper/geometry";
import { Space } from "./space";
import { Sun } from "./sun";

//** Custom shaders for Earth */
const vsEarth = `
struct PointLight {
    vec3 color;
    vec3 position; // light position, in camera coordinates
    float distance; // used for attenuation purposes
};
   
uniform PointLight pointLights[NUM_POINT_LIGHTS];

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 surfaceToLight;
varying vec3 surfaceToView;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  surfaceToLight = pointLights[0].position - mvPosition.xyz;
  surfaceToView = - mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fsEarth = `
struct PointLight {
    vec3 color;
    vec3 position;
    float distance;
};
   
uniform PointLight pointLights[NUM_POINT_LIGHTS];

uniform float pointLightIntensity;

uniform float ambientLightIntensity;

uniform bool cloudy;

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D cloudsTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 surfaceToLight;
varying vec3 surfaceToView;

void main( void ) {
  vec3 dayCl = texture2D( dayTexture, vUv ).rgb;
  vec3 nightCl = texture2D( nightTexture, vUv ).rgb;
  vec3 cloudsCl = texture2D( cloudsTexture, vUv ).rgb;

  vec3 lightColor = vec3(1,1,1);

  vec3 normal = normalize(vNormal);

  vec3 surfaceToViewDirection = normalize(surfaceToView);

  vec3 surfaceToLightDirection = normalize(surfaceToLight);

  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float specular = dot(normal, halfVector);

  // cosine of the angle between sun and normal
  float sunToNormal = dot(normal, surfaceToLightDirection);

  // make the transition sharper, constraining the value multiplied by 20 between -1 and 1
  sunToNormal = clamp( sunToNormal * 20.0, -1.0, 1.0);

  // To use as a mix, convert ranges from -1 <> 1 to 0 <> 1
  float mixTexture = sunToNormal * 0.5 + 0.5;

  //mixTexture *= pointLightIntensity;

  //mixTexture += ambientLightIntensity;

  //mixTexture += specular;
  
  // Blending with the clouds texture
  nightCl = cloudy ? nightCl * 0.6 + cloudsCl * 0.4 * 0.6 : nightCl;

  dayCl = cloudy ? dayCl * 0.6 + cloudsCl * 0.4 * 0.6 : dayCl;

  // Select day or night texture based on mix. If mixTexture is greater than 1 it is the day part
  vec3 color = mixTexture > 1.0 ? dayCl * mixTexture : mix( nightCl, dayCl, mixTexture );

  float phong = pointLightIntensity * max(0.0,sunToNormal)*(1.0 + 1.0*pow(max(0.0,specular),30.0)/sunToNormal) + 1.0*ambientLightIntensity;

  color = phong > 1.0 ? dayCl * phong : mix(nightCl, dayCl, phong);

  gl_FragColor = vec4( color, 1.0 );

}

`;

export class PlanetRing extends CelestialBody {

    constructor(planetOrbit: Orbit,ring: string){
        super();
        const rings = new THREE.TextureLoader().load(ring);
        const ringGeometry = new THREE.RingBufferGeometry(3,5,64);
        const pos = ringGeometry.attributes.position;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++){
            v3.fromBufferAttribute(pos, i);
            ringGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
        }
        const ringMaterial = new THREE.MeshBasicMaterial({map:rings, color: 0xffffff, side: THREE.DoubleSide, transparent: true});
        const ringMesh = new THREE.Mesh(ringGeometry,ringMaterial);
        ringMesh.scale.set(1,1,1);
        const planetPosition = planetOrbit.getObject().getObjectByName("proximity")?.position || new THREE.Vector3(0,0,0);
        ringMesh.position.set(planetPosition.x,planetPosition.y,planetPosition.z);
        ringMesh.rotation.x = -40;
        this.object = ringMesh;
    }
}

//** Base class for all planets */
export class Planet extends CelestialBody {

    private surfaceTexture: THREE.Texture;

    private planetMaterial : THREE.Material;

    private name: string;

    protected _realistic: boolean;

    protected basicColor: THREE.ColorRepresentation;

    constructor(name: string, size: number, surface: string, rotationSpeed: number, basicColor: THREE.ColorRepresentation){
        super(rotationSpeed);
        this.surfaceTexture = new THREE.TextureLoader().load(surface);
        this.planetMaterial = new THREE.MeshPhongMaterial({map: this.surfaceTexture});
        const planetMesh = new THREE.Mesh(sphereGeometry,this.planetMaterial);
        this._realistic = true;
        this.basicColor = basicColor;
        this.name = name;
        planetMesh.scale.set(size,size,size);
        this.object = planetMesh;
    }

    getName() {
        return this.name;
    }

    get realistic() {
        return this._realistic;
    }

    set realistic(real:boolean){
        this._realistic = real;
        const planet = this.object as THREE.Mesh;
        if (real){
            planet.material = new THREE.MeshPhongMaterial({map: this.surfaceTexture});
        } else {
            planet.material = new THREE.MeshPhongMaterial({color: this.basicColor});
        }
    }

    buildUserControls(gui: GUI){
        super.buildUserControls(gui);
        gui.add(this,"realistic").name("Real Surface");
    }

}

export class Satellite extends Planet {

    constructor(name: string, size: number, surface: string, rotationSpeed: number){
        super(name,size,surface,rotationSpeed,0xffffff);
    }

    buildUserControls(gui: GUI){
      // No user controls
    }
}

/** Class that contains a planet and optional sattelites and a camera to view the planet */
export class Orbit extends CelestialBody {

    private planet: Planet;

    private _viewPlanet: boolean;

    private camera: THREE.Camera;

    private fakeCamera: THREE.Camera;

    constructor(planet:Planet,rotationSpeed: number, distance: number, camera: THREE.Camera, fakeCamera: THREE.Camera) {
        super(rotationSpeed);
        const orbit = new THREE.Object3D();
        const planetProximity = new THREE.Object3D(); // object that encapsulates a planet and maybe other objects as sattelites and contains a camera that follows the planet
        planetProximity.name = "proximity";
        orbit.add(planetProximity);
        planetProximity.position.x = distance;
        this.planet = planet;
        planetProximity.add(planet.getObject());
        this.object = orbit;
        this._viewPlanet = false;
        this.camera = camera;
        this.fakeCamera = fakeCamera;
    }

    addSatellite(satelliteOrbit: Orbit){
        this.object.getObjectByName("proximity")?.add(satelliteOrbit.getObject());
    }

    buildUserControls(gui: GUI){
        gui = !gui.__folders["Planets"] ? gui.addFolder("Planets") : gui.__folders["Planets"]; // create a planet folder if there is no one created to use as a container for all planet controls
        const planetControlFolder = gui.addFolder(this.planet.getName());
        planetControlFolder.add(this,"rotationSpeed",0,4).name("Orbit speed");
        this.planet.buildUserControls(planetControlFolder);
        planetControlFolder.add(this,"viewPlanet").name("Look at").onChange((view) => {
            // If selected this control must reset the same controls on all the other planets.
            // Only one camera can be active at a time.
            if (view) {
                Object.entries(gui.__folders)
                .filter(([key,val]) => key !== this.planet.getName())
                .forEach(([key,val]) => val.__controllers
                .filter((c) => c.property === "viewPlanet")
                .forEach((c) => c.setValue(false)));
            }
        });
    }

    get viewPlanet(){
        return this._viewPlanet;
    }

    set viewPlanet(view:boolean){
        this._viewPlanet = view;
        if (view) {
            this.object.getObjectByName("proximity")?.add(this.camera); // Add camera to follow the planet
            this.fakeCamera = this.camera.clone(); // copy camera values to fakecamera
            controls.update(); // update orbit controls
        } else {
            this.object.getObjectByName("proximity")?.remove(this.camera);
            this.fakeCamera = this.camera.clone();
            controls.update();
            controls.reset(); // reset controls to default
        }
    }
}

//** Class that extends Planet because Earth has a specific behaviour and uses custom shaders to render */
export class Earth extends Planet {

    private uniforms: any;

    private textures: {
        dayTexture: {
            type: string;
            value: THREE.Texture;
        };
        nightTexture: {
            type: string;
            value: THREE.Texture;
        };
        cloudsTexture: {
            type: string;
            value: THREE.Texture;
        };
    }

    constructor(name: string, size: number, rotationSpeed: number, basicColor: THREE.ColorRepresentation,space:Space,sun:Sun){
        super(name,size,"",rotationSpeed,basicColor);
        this.textures =  {
            dayTexture: { type: "t", value: new THREE.TextureLoader().load( "2k_earth_daymap.jpeg" ) },
            nightTexture: { type: "t", value: new THREE.TextureLoader().load( "2k_earth_nightmap.jpeg" ) },
            cloudsTexture : { type: "t", value: new THREE.TextureLoader().load( "2k_earth_clouds.jpeg" )}
        };
        this.uniforms = {
            ...this.textures, 
            ...THREE.UniformsLib['lights'], 
            pointLightIntensity: { value: sun.getLight().intensity}, 
            ambientLightIntensity: { value: space.getLight().intensity},
            cloudy: {value : true}
        }
        const planetMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vsEarth,
            fragmentShader: fsEarth,
            lights: true,
        })
        const planetMesh = new THREE.Mesh(sphereGeometry,planetMaterial);
        planetMesh.name = name;
        planetMesh.scale.set(size,size,size);
        sun.setOnLightChange(this.updateLight); // callback to update uniform of shader for pointLight
        space.setOnLightChange(this.updateLight); // callback to update uniform of shader for ambientLight
        this.object = planetMesh;
    }

    get realistic() {
        return this._realistic;
    }

    set realistic(real:boolean){
        this._realistic = real;
        const planet = this.object as THREE.Mesh;
        if (real){
            planet.material = new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: vsEarth,
                fragmentShader: fsEarth,
                lights: true,
            });
        } else {
            planet.material = new THREE.MeshPhongMaterial({color: this.basicColor});
        }
    }

    updateLight = (value: number, lightType: string) => {
        this.uniforms[lightType] = {value};
    }

    buildUserControls(gui: GUI){
        super.buildUserControls(gui);
        gui.add(this.uniforms.cloudy,"value").name("Cloudy");
    }
}