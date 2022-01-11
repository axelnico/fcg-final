import {GUI} from 'dat.gui';

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
                sunControlFolder.add(sunShininess,"intensity",0,4).name("Shininess");
            }
        } else {
            const spaceLight = celestialBodies[index];
            if (spaceLight){
                const sunControlFolder = gui.addFolder("Space");
                sunControlFolder.add(spaceLight,"intensity",0,0.3,0.05).name("Darkness");
            }
        }
        
    }
}