// Copyright 2021, University of Colorado Boulder

/**
 * Demonstrates an UpDownArrowPlot.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import AxisNode from '../AxisNode.js';
import bamboo from '../bamboo.js';
import ChartRectangle from '../ChartRectangle.js';
import ChartTransform from '../ChartTransform.js';
import Color from '../../../scenery/js/util/Color.js';
import UpDownArrowPlot from '../UpDownArrowPlot.js';
import Node from '../../../scenery/js/nodes/Node.js';

class DemoUpDownArrowPlot extends Node {
  constructor( options ) {
    super();

    const modelXRange = new Range( 0, 10 );
    const modelYRange = new Range( -100, 100 );

    // one data point for each integer point in the model, y values interpolated along the x range from min to max
    const dataSet = [];
    for ( let i = 0; i <= modelXRange.max; i++ ) {
      dataSet.push( new Vector2( i, modelYRange.min + ( modelYRange.getLength() / modelXRange.getLength() ) * i ) );
    }

    const chartTransform = new ChartTransform( {
      viewWidth: 500,
      viewHeight: 400,
      modelXRange: modelXRange,
      modelYRange: modelYRange
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 6,
      cornerYRadius: 6
    } );

    const barPlot = new UpDownArrowPlot( chartTransform, dataSet, {
      arrowNodeOptions: {
        headWidth: 15,
        headHeight: 15
      },
      pointToPaintableFields: point => {

        // interpolate from red at modelYRange.min, green at modelYRange.max
        const distance = 1 / ( modelYRange.getLength() ) * ( point.y - modelYRange.min );
        const c = Color.interpolateRGBA( new Color( 'red' ), new Color( 'lawngreen' ), distance );
        return { fill: c };
      }
    } );
    const xAxis = new AxisNode( chartTransform, Orientation.HORIZONTAL );

    // anything you want clipped goes in here
    const chartClip = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [
        barPlot,
        xAxis
      ]
    } );

    this.children = [ chartRectangle, chartClip ];

    // for positioning in the demo
    this.mutate( options );
  }
}

bamboo.register( 'DemoUpDownArrowPlot', DemoUpDownArrowPlot );
export default DemoUpDownArrowPlot;
