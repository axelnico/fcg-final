import {GUI} from 'dat.gui';
import { CelestialBody } from '../planets';

/** GUI controls manegement */
export const generateGUIControls = (celestialBodies: THREE.Object3D<THREE.Event>[]) => {
    const gui = new GUI();
    const planetsControlFolder = gui.addFolder('Planets');
    const length = celestialBodies.length;
    for (let index = 0; index < length; index++) {
        const planet = celestialBodies[index].getObjectByProperty('type',"planet");
        if (planet) {
            const planetControlFolder = planetsControlFolder.addFolder(planet.name);
            planetControlFolder.add(celestialBodies[index].userData,"rotationSpeed",0,4).name("Orbit speed");
            planetControlFolder.add(planet.userData,"rotationSpeed",0,4).name("Rotation");
        } else if (celestialBodies[index].name === "Sun") {
            const sunShininess = celestialBodies[index];
            if (sunShininess){
                const sunControlFolder = gui.addFolder(sunShininess.name);
                sunControlFolder.add(sunShininess,"intensity",0,4).name("Shininess").onChange((value:number) => {
                    const earth = celestialBodies.find((cb) => cb.getObjectByProperty('type',"planet")?.name === "earth")?.getObjectByProperty('type',"planet") as THREE.Mesh;
                    const material = earth.material as THREE.ShaderMaterial;
                    material.uniforms.pointLightIntensity = {value};
                });
            }
        } else {
            const spaceLight = celestialBodies[index];
            if (spaceLight){
                const sunControlFolder = gui.addFolder("Space");
                sunControlFolder.add(spaceLight,"intensity",0,0.3,0.05).name("Darkness").onChange((value:number) => {
                    const earth = celestialBodies.find((cb) => cb.getObjectByProperty('type',"planet")?.name === "earth")?.getObjectByProperty('type',"planet") as THREE.Mesh;
                    const material = earth.material as THREE.ShaderMaterial;
                    material.uniforms.ambientLightIntensity = {value};
                });
            }
        }
        
    }
}

export const generateGUIControls2 = (celestialBodies: CelestialBody[]) => {
    const gui = new GUI();
    const length = celestialBodies.length;
    for (let index = 0; index < length; index++) {
        celestialBodies[index].buildUserControls(gui);
    }
}