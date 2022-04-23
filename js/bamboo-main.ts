// Copyright 2020-2021, University of Colorado Boulder

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

simLauncher.launch( () => {
  new Sim( bambooStrings.bamboo.title, [
    new Screen( () => {return {};}, () => new BambooDemoScreenView(), {
        name: 'Bamboo Demo',
        backgroundColorProperty: new Property( '#e4fcf4' ),
        tandem: Tandem.OPT_OUT
      }
    )
  ], simOptions ).start();
} );