// Copyright 2020-2022, University of Colorado Boulder

/**
 * Main file for the Bamboo library demo.
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import BambooDemoScreenView from './demo/BambooDemoScreenView.js';
import bambooStrings from './bambooStrings.js';
import Tandem from '../../tandem/js/Tandem.js';

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

class Model {
  public step(): void { /* no stepping here */ }
}

simLauncher.launch( () => {
  new Sim( bambooStrings.bamboo.titleStringProperty, [
    new Screen( () => new Model(), () => new BambooDemoScreenView(), {
        name: 'Bamboo Demo',
        backgroundColorProperty: new Property( '#e4fcf4' ),
        tandem: Tandem.OPT_OUT
      }
    )
  ], simOptions ).start();
} );