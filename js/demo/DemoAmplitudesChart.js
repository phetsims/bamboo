// Copyright 2020, University of Colorado Boulder

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
import ChartModel from '../ChartModel.js';
import ChartRectangle from '../ChartRectangle.js';
import GridLineSet from '../GridLineSet.js';
import LabelSet from '../LabelSet.js';
import TickMarkSet from '../TickMarkSet.js';
import bamboo from '../bamboo.js';

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

class DemoAmplitudesChart extends Node {

  constructor( options ) {
    super();

    const data = [];
    for ( let i = 0; i <= 24; i++ ) {
      const x = Math.PI * i;
      const arg = x - Math.PI * 12;
      const c = 10;
      const y = 0.13 * Math.exp( -arg * arg / 2 / c / c );
      console.log( x, y );
      data.push( new Vector2( x, y ) );
    }

    const chartModel = new ChartModel( 700, 300, {
      modelXRange: new Range( 0, Math.PI * 24 ),
      modelYRange: new Range( 0, 0.14 )
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
        new GridLineSet( chartModel, Orientation.VERTICAL, 0.05, { stroke: 'lightGray' } ),

        // Some data
        new BarPlot( chartModel, data, {
          valueToColor: ( x, y ) => {
            const c = Utils.linear( 0, 24 * Math.PI, 0, 240, x );
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
        new TickMarkSet( chartModel, Orientation.VERTICAL, 0.01, {
          stroke: 'darkGray',
          edge: 'min'
        } ),

        // Major ticks on the y-axis
        new TickMarkSet( chartModel, Orientation.VERTICAL, 0.05, { edge: 'min' } ),
        new LabelSet( chartModel, Orientation.VERTICAL, 0.05, {
          edge: 'min',
          createLabel: value => new Text( value.toFixed( 2 ), { fontSize: 12 } )
        } ),

        new TickMarkSet( chartModel, Orientation.HORIZONTAL, Math.PI * 2, { edge: 'min' } ),
        new LabelSet( chartModel, Orientation.HORIZONTAL, Math.PI * 2, {
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

bamboo.register( 'DemoAmplitudesChart', DemoAmplitudesChart );
export default DemoAmplitudesChart;