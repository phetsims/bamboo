// Copyright 2018-2020, University of Colorado Boulder

/**
 * Demonstration of bamboo components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../axon/js/Emitter.js';
import sceneryPhetQueryParameters from '../../../scenery-phet/js/sceneryPhetQueryParameters.js';
import DemosScreenView from '../../../sun/js/demo/DemosScreenView.js';
import bamboo from '../bamboo.js';
import DemoAmplitudesChart from './DemoAmplitudesChart.js';
import DemoComponentsChart from './DemoComponentsChart.js';
import DemoHarmonicsChart from './DemoHarmonicsChart.js';
import DemoLogPlot from './DemoLogPlot.js';
import DemoScatterPlot from './DemoScatterPlot.js';

// constants - this is a hack to enable components to animate from the animation loop
const emitter = new Emitter( { parameters: [ { valueType: 'number' } ] } );

class BambooDemoScreenView extends DemosScreenView {
  constructor() {

    super( [

      /**
       * To add a demo, add an object literal here. Each object has these properties:
       *
       * {string} label - label in the combo box
       * {function(Bounds2): Node} createNode - creates the scene graph for the demo
       */
      {
        label: 'ScatterPlot', createNode: layoutBounds => new DemoScatterPlot( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'HarmonicsChart', createNode: layoutBounds => new DemoHarmonicsChart( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'ComponentsChart', createNode: layoutBounds => new DemoComponentsChart( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'LogPlot', createNode: layoutBounds => new DemoLogPlot( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'AmplitudesChart', createNode: layoutBounds => new DemoAmplitudesChart( {
          center: layoutBounds.center
        } )
      }
    ], {
      selectedDemoLabel: sceneryPhetQueryParameters.component
    } );
  }

  /**
   * Move the model forward in time.
   * @param {number} dt - elapsed time in seconds
   * @public
   */
  step( dt ) {
    emitter.emit( dt );
  }
}

bamboo.register( 'BambooDemoScreenView', BambooDemoScreenView );
export default BambooDemoScreenView;