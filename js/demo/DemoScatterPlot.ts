// Copyright 2020-2022, University of Colorado Boulder

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import dotRandom from '../../../dot/js/dotRandom.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import { Node, VBox, VBoxOptions } from '../../../scenery/js/imports.js';
import HSlider from '../../../sun/js/HSlider.js';
import AxisArrowNode from '../AxisArrowNode.js';
import BarPlot from '../BarPlot.js';
import ChartTransform from '../ChartTransform.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import TickLabelSet from '../TickLabelSet.js';
import LinePlot from '../LinePlot.js';
import ScatterPlot from '../ScatterPlot.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class DemoScatterPlot extends VBox {

  public constructor( options?: VBoxOptions ) {

    const dataSet = [];
    for ( let i = -3; i < 3; i += 0.01 ) {
      dotRandom.nextDouble() < 0.3 && dataSet.push( new Vector2( i, Math.sin( i * 2 ) ) );
    }

    const chartTransform = new ChartTransform( {
      viewWidth: 600,
      viewHeight: 400,
      modelXRange: new Range( -1, 1 ),
      modelYRange: new Range( -1, 1 )
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    // Anything you want clipped goes in here
    const chartClip = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [

        // Tick labels along the axes
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 0.2, { clippingType: 'lenient' } ),
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.2, { clippingType: 'lenient' } ),

        // Some data
        new BarPlot( chartTransform, dataSet, { opacity: 0.2 } ),
        new LinePlot( chartTransform, dataSet, {
          stroke: 'red',
          lineWidth: 2
        } ),
        new ScatterPlot( chartTransform, dataSet, {
          fill: 'blue'
        } )
      ]
    } );

    const chartNode = new Node( {
      children: [

        // Background
        chartRectangle,

        // Clipped contents
        chartClip,

        // Minor grid lines
        new GridLineSet( chartTransform, Orientation.HORIZONTAL, 0.1, { stroke: 'lightGray' } ),
        new GridLineSet( chartTransform, Orientation.VERTICAL, 0.1, { stroke: 'lightGray' } ),

        // Major grid lines
        new GridLineSet( chartTransform, Orientation.HORIZONTAL, 0.2, { stroke: 'black' } ),
        new GridLineSet( chartTransform, Orientation.VERTICAL, 0.2, { stroke: 'black' } ),

        // axes nodes not clipped
        new AxisArrowNode( chartTransform, Orientation.VERTICAL ),
        new AxisArrowNode( chartTransform, Orientation.HORIZONTAL ),

        // Tick marks outside the chart
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.2, { edge: 'min' } ),
        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 0.2, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.VERTICAL, 0.2, { edge: 'min' } ),
        new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 0.2, { edge: 'min' } )
      ]
    } );

    // Controls
    const centerXProperty = new NumberProperty( 0 );
    centerXProperty.link( centerX => chartTransform.setModelXRange( new Range( -1 - centerX, 1 - centerX ) ) );
    const controls = new HSlider( centerXProperty, new Range( -1.25, 1.25 ), {
      trackSize: new Dimension2( 500, 5 )
    } );
    super( {
      resize: false,
      children: [ chartNode, controls ]
    } );

    this.mutate( options );
  }
}

bamboo.register( 'DemoScatterPlot', DemoScatterPlot );
export default DemoScatterPlot;