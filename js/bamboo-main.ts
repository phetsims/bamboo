// Copyright 2020-2024, University of Colorado Boulder

/**
 * Main file for the Bamboo library demo.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import Screen from '../../joist/js/Screen.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import BambooStrings from './BambooStrings.js';
import BambooDemoScreenView from './demo/BambooDemoScreenView.js';

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'PhET'
  }
};

class Model {
  public reset(): void { /* nothing to do */ }
}

simLauncher.launch( () => {
  new Sim( BambooStrings.bamboo.titleStringProperty, [
    new Screen( () => new Model(), () => new BambooDemoScreenView(), {
        name: new Property( 'Bamboo Demo' ),
        backgroundColorProperty: new Property( '#e4fcf4' ),
        tandem: Tandem.OPT_OUT
      }
    )
  ], simOptions ).start();
} );