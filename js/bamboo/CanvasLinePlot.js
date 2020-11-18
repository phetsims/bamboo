// Copyright 2019-2020, University of Colorado Boulder

/**
 * TODO documentation
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import Enumeration from '../../../phet-core/js/Enumeration.js';
import CanvasNode from '../../../scenery/js/nodes/CanvasNode.js';
import griddle from '../griddle.js';

// constants
const PlotStyle = Enumeration.byKeys( [ 'SCATTER', 'LINE' ] );

class CanvasLinePlot extends CanvasNode {

  constructor( chartModel, dataSets ) {

    super( {
      canvasBounds: new Bounds2( 0, 0, chartModel.width, chartModel.height )
    } );

    this.dataSets = dataSets;
    this.chartModel = chartModel;

    chartModel.link( () => this.invalidatePaint() );
  }

  /**
   * Used to redraw the CanvasNode. Use CanvasNode.invalidatePaint to signify that
   * it is time to redraw the canvas.
   * @protected
   * @override
   *
   * @param {CanvasRenderingContext2D} context
   */
  paintCanvas( context ) {
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 0.1;

    this.dataSets.forEach( dataSet => {
      for ( let i = 0; i < dataSet.length; i++ ) {
        const point = this.chartModel.modelToViewPosition( dataSet[ i ] );
        i === 0 && context.moveTo( point.x, point.y );
        i !== 0 && context.lineTo( point.x, point.y );
      }
    } );

    context.stroke();
  }
}

// @public (read-only)
CanvasLinePlot.PlotStyle = PlotStyle;

griddle.register( 'CanvasLinePlot', CanvasLinePlot );
export default CanvasLinePlot;