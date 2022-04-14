// Copyright 2020-2021, University of Colorado Boulder

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
import DemoBarPlot from './DemoBarPlot.js';
import DemoChartCanvasNode from './DemoChartCanvasNode.js';
import DemoLinePlot from './DemoLinePlot.js';
import DemoMultiplePlots from './DemoMultiplePlots.js';
import DemoScatterPlot from './DemoScatterPlot.js';
import DemoLinearEquationPlot from './DemoLinearEquationPlot.js';
import DemoUpDownArrowPlot from './DemoUpDownArrowPlot.js';
import Tandem from '../../../tandem/js/Tandem.js';

// constants - this is a hack to enable components to animate from the animation loop
const emitter = new Emitter<[ number ]>( { parameters: [ { valueType: 'number' } ] } );

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
        label: 'ScatterPlot',

        // @ts-ignore
        createNode: layoutBounds => new DemoScatterPlot( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'LinePlot',

        // @ts-ignore
        createNode: layoutBounds => new DemoLinePlot( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'ChartCanvasNode',

        // @ts-ignore
        createNode: layoutBounds => new DemoChartCanvasNode( emitter, {
          center: layoutBounds.center
        } )
      },
      {
        label: 'MultiplePlots',

        // @ts-ignore
        createNode: layoutBounds => new DemoMultiplePlots( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'BarPlot',

        // @ts-ignore
        createNode: layoutBounds => new DemoBarPlot( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'UpDownArrowPlot',

        // @ts-ignore
        createNode: layoutBounds => new DemoUpDownArrowPlot( {
          center: layoutBounds.center
        } )
      },
      {
        label: 'LinearEquationPlot',

        // @ts-ignore
        createNode: layoutBounds => new DemoLinearEquationPlot( {
          center: layoutBounds.center
        } )
      }
    ], {
      selectedDemoLabel: sceneryPhetQueryParameters.component,
      tandem: Tandem.OPT_OUT
    } );
  }

  /**
   * Move the model forward in time.
   * @param dt - elapsed time in seconds
   */
  step( dt: number ) {
    emitter.emit( dt );
  }
}

bamboo.register( 'BambooDemoScreenView', BambooDemoScreenView );
export default BambooDemoScreenView;