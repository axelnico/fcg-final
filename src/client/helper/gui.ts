import {GUI} from 'dat.gui';
import { CelestialBody } from '../planets';

/** GUI controls manegement */
export const generateGUIControls = (celestialBodies: CelestialBody[]) => {
    const gui = new GUI();
    const length = celestialBodies.length;
    for (let index = 0; index < length; index++) {
        celestialBodies[index].buildUserControls(gui);
    }
}