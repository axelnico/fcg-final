import * as THREE from "three";


export const MERCURY_DISTANCE = 7;
export const VENUS_DISTANCE = 10;
export const EARTH_DISTANCE = 20;
export const MARS_DISTANCE = 30;
export const JUPITER_DISTANCE = 45;
export const SATURN_DISTANCE = 55;
export const URANUS_DISTANCE = 65;
export const NEPTUNE_DISTANCE = 75;

export const MERCURY_SIZE = 0.5;
export const VENUS_SIZE = 0.7;
export const EARTH_SIZE = 1;
export const MARS_SIZE = 1;
export const JUPITER_SIZE = 3;
export const SATURN_SIZE = 2;
export const URANUS_SIZE = 1.5;
export const NEPTUNE_SIZE = 1.7;



// All planets use the same geometry. An sphere of radius 1
const radius = 1;
const widthSegments = 75;
const heightSegments = 75;
const sphereGeometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);


const fov = 40;

const aspect = 2;
const near = 0.1;

const far = 1000;


export const getRotationMesh = (planet: THREE.Object3D) => {
    const boxGeometry = new THREE.BoxGeometry(planet.position.x,0.25,0.25);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(boxGeometry,material);
    mesh.position.x = planet.position.x / 2;
    mesh.visible = false;
    //const camera = new THREE.PerspectiveCamera(fov,aspect, near, far);
    //camera.name = "planetCamera";
    //camera.position.set(planet.position.x - 10,0.25,0.25)
    //mesh.add(camera);
    return mesh;
}

export const getMoonRotationMesh = (planet: THREE.Object3D) => {
    const boxGeometry = new THREE.BoxGeometry(planet.position.x/4,0.25,0.25);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(boxGeometry,material);
    mesh.position.x = planet.position.x;
    mesh.visible = true;
    //const camera = new THREE.PerspectiveCamera(fov,aspect, near, far);
    //camera.name = "planetCamera";
    //camera.position.set(planet.position.x - 10,0.25,0.25)
    //mesh.add(camera);
    return mesh;
}

export const createPlanet = (name: string, position: number, size: number, surface: string, rotationSpeed: number) => {
    const texture = new THREE.TextureLoader().load(surface);
    const planetMaterial = new THREE.MeshPhongMaterial({map: texture});
    const planetMesh = new THREE.Mesh(sphereGeometry,planetMaterial);
    planetMesh.name = name;
    planetMesh.type = "planet";
    planetMesh.position.x = position;
    planetMesh.scale.set(size,size,size);
    planetMesh.userData["rotationSpeed"] = rotationSpeed;
    return planetMesh;
}

export const createMoon = (position: number, size: number, surface: string, rotationSpeed: number) => {
    const texture = new THREE.TextureLoader().load(surface);
    const planetMaterial = new THREE.MeshPhongMaterial({map: texture});
    const moonMesh = new THREE.Mesh(sphereGeometry,planetMaterial);
    moonMesh.name = "Moon";
    moonMesh.position.x = position;
    moonMesh.scale.set(size,size,size);
    moonMesh.userData["rotationSpeed"] = rotationSpeed;
    return moonMesh;
}

export const createSaturn = (name: string, position: number, size: number, surface: string, rotationSpeed: number) => {
    const texture = new THREE.TextureLoader().load(surface);
    
    const planetMaterial = new THREE.MeshPhongMaterial({map: texture});
    

 
    const planetMesh = new THREE.Mesh(sphereGeometry,planetMaterial);
    
    planetMesh.name = name;
    planetMesh.type = "planet";
    planetMesh.position.x = position;
    planetMesh.scale.set(size,size,size);
    planetMesh.userData["rotationSpeed"] = rotationSpeed;
    return planetMesh;
}

export const createSaturnRing = (saturn: THREE.Mesh) => {
    const rings = new THREE.TextureLoader().load("2k_saturn_ring_alpha.png");
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
    ringMesh.position.set(saturn.position.x,saturn.position.y,saturn.position.z);
    ringMesh.rotation.x = -40;
    return ringMesh;
}

const vs = `
struct PointLight {
    vec3 color;
    vec3 position; // light position, in camera coordinates
    float distance; // used for attenuation purposes. Since
                    // we're writing our own shader, it can
                    // really be anything we want (as long
                    // as we assign it to our light in its
                    // "distance" field
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
  vec3 surfaceWorldPosition = (modelViewMatrix * vec4(position,1.0)).xyz;
  surfaceToLight = pointLights[0].position - surfaceWorldPosition;
  surfaceToView = cameraPosition - surfaceWorldPosition;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fs = `
struct PointLight {
    vec3 color;
    vec3 position; // light position, in camera coordinates
    float distance; // used for attenuation purposes. Since
                    // we're writing our own shader, it can
                    // really be anything we want (as long
                    // as we assign it to our light in its
                    // "distance" field
};
   
uniform PointLight pointLights[NUM_POINT_LIGHTS];

uniform float pointLightIntensity;

uniform float ambientLightIntensity;

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D cloudsTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 surfaceToLight;
varying vec3 surfaceToView;

void main( void ) {
  vec3 dayColor = texture2D( dayTexture, vUv ).rgb;
  vec3 nightColor = texture2D( nightTexture, vUv ).rgb;
  vec3 clouds = texture2D( cloudsTexture, vUv ).rgb;

  vec3 normal = normalize(vNormal);

  vec3 surfaceToLightDirection = normalize(surfaceToLight);
  vec3 surfaceToViewDirection = normalize(surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
  float specular = dot(normal, halfVector);

  // compute cosine sun to normal so -1 is away from sun and +1 is toward sun.
  float cosineAngleSunToNormal = dot(normalize(vNormal), surfaceToLightDirection);

  float light = dot(normal,surfaceToLightDirection);

  // sharpen the edge beween the transition
  cosineAngleSunToNormal = clamp( cosineAngleSunToNormal * 10.0, -1.0, 1.0);

  // convert to 0 to 1 for mixing
  float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;

  mixAmount *= pointLightIntensity;

  mixAmount += ambientLightIntensity;
  
  vec3 nightColorCloudy = nightColor * 0.6 + clouds * 0.4 * 0.6;

  vec3 dayColorCloudy = dayColor * 0.6 + clouds * 0.4 * 0.6;

  // Select day or night texture based on mix.
  vec3 color = mixAmount > 1.0 ? dayColorCloudy * mixAmount : mix( nightColorCloudy, dayColorCloudy, mixAmount );

  //vec3 finalColor = color * 0.2 + clouds * 0.8;

  //vec3 color1 = cosineAngleSunToNormal < 0.0 ? dayColor : nightColor;

  gl_FragColor = vec4( color, 1.0 );

  //gl_FragColor.rgb += specular;

  //gl_FragColor = vec4(1,0,0,1);

  //gl_FragColor = vec4(dayColor, 1.0); 

  //gl_FragColor.rgb *= 0.0;
}

`;

export const createEarth = (name: string, position: number, size: number, surface: string, rotationSpeed: number,scene: THREE.Scene) => {
    //const texture = new THREE.TextureLoader().load(surface);
    const textures =  {
        dayTexture: { type: "t", value: new THREE.TextureLoader().load( "2k_earth_daymap.jpeg" ) },
        nightTexture: { type: "t", value: new THREE.TextureLoader().load( "2k_earth_nightmap.jpeg" ) },
        cloudsTexture : { type: "t", value: new THREE.TextureLoader().load( "2k_earth_clouds.jpeg" )}
    };
    const pointLight = scene.getObjectByName("Sun") as THREE.PointLight;
    const ambientLight = scene.getObjectByName("space light") as THREE.AmbientLight;
    const uniforms = {
        ...textures, 
        ...THREE.UniformsLib['lights'], 
        pointLightIntensity: { value: pointLight.intensity}, 
        ambientLightIntensity: { value: ambientLight.intensity}
    }
    const planetMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        lights: true,
    })
    const planetMesh = new THREE.Mesh(sphereGeometry,planetMaterial);
    planetMesh.name = name;
    planetMesh.type = "planet";
    //planetMesh.position.x = position;
    //planetMesh.scale.set(size,size,size);
    planetMesh.userData["rotationSpeed"] = rotationSpeed;
    const external = new THREE.Object3D();
    external.position.x = position;
    planetMesh.scale.set(size,size,size);
    external.add(planetMesh);
    return external;
}