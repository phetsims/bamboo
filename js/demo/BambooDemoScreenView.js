// Copyright 2018-2020, University of Colorado Boulder

/**
 * Demonstration of bamboo components.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'component' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Emitter from '../../../axon/js/Emitter.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import sceneryPhetQueryParameters from '../../../scenery-phet/js/sceneryPhetQueryParameters.js';
import Node from '../../../scenery/js/nodes/Node.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import DemosScreenView from '../../../sun/js/demo/DemosScreenView.js';
import HSlider from '../../../sun/js/HSlider.js';
import AxisNode from '../bamboo/AxisNode.js';
import BarPlot from '../bamboo/BarPlot.js';
import GridLineSet from '../bamboo/GridLineSet.js';
import LinePlot from '../bamboo/LinePlot.js';
import TickMarkSet from '../bamboo/TickMarkSet.js';
import ChartModel from '../bamboo/ChartModel.js';
import ChartRectangle from '../bamboo/ChartRectangle.js';
import bamboo from '../bamboo.js';
import ScatterPlot from '../bamboo/ScatterPlot.js';
import DemoAmplitudesChart from './DemoAmplitudesChart.js';
import DemoComponentsChart from './DemoComponentsChart.js';
import DemoHarmonicsChart from './DemoHarmonicsChart.js';

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
      { label: 'ChartNode', createNode: demoChartNode },
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

const demoChartNode = function( layoutBounds ) {

  const data = [];
  for ( let i = -1; i < 1; i += 0.01 ) {
    phet.joist.random.nextDouble() < 0.3 && data.push( new Vector2( i, Math.sin( i * 2 ) ) );
  }

  const chartModel = new ChartModel( 600, 400, {
    modelXRange: new Range( -1, 1 ),
    modelYRange: new Range( -1, 1 )
  } );

  const chartRectangle = new ChartRectangle( chartModel, {
    fill: 'white',
    stroke: 'black',
    cornerXRadius: 6,
    cornerYRadius: 6
  } );

  // Anything you want clipped goes in here
  const chartClip = new Node( {
    clipArea: chartRectangle.getShape(),
    children: [
      // Minor grid lines
      new GridLineSet( chartModel, Orientation.HORIZONTAL, 0.1, { stroke: 'lightGray' } ),
      new GridLineSet( chartModel, Orientation.VERTICAL, 0.1, { stroke: 'lightGray' } ),

      // Major grid lines
      new GridLineSet( chartModel, Orientation.HORIZONTAL, 0.2, { stroke: 'darkGray', clipped: true } ),
      new GridLineSet( chartModel, Orientation.VERTICAL, 0.2, { stroke: 'darkGray', clipped: true } ),

      // Tick labels along the axes
      new TickMarkSet( chartModel, Orientation.HORIZONTAL, 0.2, { clipped: true } ),
      new TickMarkSet( chartModel, Orientation.VERTICAL, 0.2, { clipped: true } ),

      // Some data
      new BarPlot( chartModel, data ),
      new LinePlot( chartModel, data, {
        stroke: 'red',
        lineWidth: 2
      } ),
      new ScatterPlot( chartModel, data )
    ]
  } );

  const chartNode = new Node( {
    children: [

      // Background
      chartRectangle,

      // Clipped contents
      chartClip,

      // axes nodes not clipped
      new AxisNode( chartModel, Orientation.VERTICAL ),
      new AxisNode( chartModel, Orientation.HORIZONTAL ),

      // Tick marks outside the chart
      new TickMarkSet( chartModel, Orientation.VERTICAL, 0.2, { edge: 'min' } ),
      new TickMarkSet( chartModel, Orientation.HORIZONTAL, 0.2, { edge: 'min' } )
    ]
  } );

  // Controls
  const centerXProperty = new NumberProperty( 0 );
  centerXProperty.link( centerX => chartModel.setModelXRange( new Range( -1 - centerX, 1 - centerX ) ) );
  const controls = new HSlider( centerXProperty, new Range( -1.25, 1.25 ), {
    trackSize: new Dimension2( 500, 5 )
  } );
  return new VBox( {
    resize: false,
    children: [ chartNode, controls ],
    center: layoutBounds.center
  } );
};

bamboo.register( 'BambooDemoScreenView', BambooDemoScreenView );
export default BambooDemoScreenView;