// Copyright 2020, University of Colorado Boulder

/**
 * Demonstrates a BarPlot.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Orientation from '../../../phet-core/js/Orientation.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import Color from '../../../scenery/js/util/Color.js';
import BarPlot from '../BarPlot.js';
import ChartTransform from '../ChartTransform.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

class DemoBarPlot extends Node {

  constructor( options ) {
    super();

    const dataSet = [];
    for ( let i = 0; i <= 24; i++ ) {
      const x = Math.PI * i;
      const arg = x - Math.PI * 12;
      const c = 10;
      const y = 0.13 * Math.exp( -arg * arg / 2 / c / c );
      dataSet.push( new Vector2( x, y ) );
    }

    const chartTransform = new ChartTransform( 700, 300, {
      modelXRange: new Range( 0, Math.PI * 24 ),
      modelYRange: new Range( 0, 0.14 )
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

        // Minor grid lines
        new GridLineSet( chartTransform, Orientation.VERTICAL, 0.05, { stroke: 'lightGray' } ),

        // Some data
        new BarPlot( chartTransform, dataSet, {
          pointToColor: point => {
            const c = Utils.linear( 0, 24 * Math.PI, 0, 240, point.x );
            return new Color( c, c, c );
          }
        } )
      ]
    } );

    const chartNode = new Node( {
      children: [

        // Background
        chartRectangle,

        // Clipped contents
        chartClip,

        // Minor ticks on the y-axis
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.01, {
          stroke: 'darkGray',
          edge: 'min'
        } ),

        // Major ticks on the y-axis
        new TickMarkSet( chartTransform, Orientation.VERTICAL, 0.05, { edge: 'min' } ),
        new LabelSet( chartTransform, Orientation.VERTICAL, 0.05, {
          edge: 'min',
          createLabel: value => new Text( value.toFixed( 2 ), { fontSize: 12 } )
        } ),

        new TickMarkSet( chartTransform, Orientation.HORIZONTAL, Math.PI * 2, { edge: 'min' } ),
        new LabelSet( chartTransform, Orientation.HORIZONTAL, Math.PI * 2, {
          edge: 'min',
          createLabel: value => new Text( ( value / Math.PI ).toFixed( 0 ) + MathSymbols.PI, { fontSize: 12 } )
        } )
      ]
    } );

    this.children = [
      new VBox( {
        resize: false,
        children: [ chartNode ]
      } )
    ];
    this.mutate( options );
  }
}

bamboo.register( 'DemoBarPlot', DemoBarPlot );
export default DemoBarPlot;