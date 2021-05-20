// Copyright 2020-2021, University of Colorado Boulder

/**
 * Main file for the Bamboo library demo.
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import BambooDemoScreenView from './demo/BambooDemoScreenView.js';
import bambooStrings from './bambooStrings.js';

const simOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

simLauncher.launch( () => {
  new Sim( bambooStrings.bamboo.title, [
    new Screen( () => {return {};}, () => new BambooDemoScreenView(), {
        name: 'Bamboo Demo',
        backgroundColorProperty: new Property( '#e4fcf4' )
      }
    )
  ], simOptions ).start();
} );