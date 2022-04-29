// Copyright 2020-2021, University of Colorado Boulder

/**
 * CanvasLinePlot renders a {Array.<Vector2|null>} dataSet on a canvas that is managed by a ChartCanvasNode.
 * Typically it is preferable to use LinePlot, but this alternative is provided for cases where canvas must be
 * used for performance. Like LinePlot, null values are skipped, and allow you to create gaps in a plot.
 * @see LinePlot
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import { Color } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import CanvasPainter from './CanvasPainter.js';
import ChartTransform from './ChartTransform.js';

class CanvasLinePlot extends CanvasPainter {
  private chartTransform: ChartTransform;

  // if you change this directly, you are responsible for calling update on the corresponding ChartCanvasNode
  dataSet: ( Vector2 | null )[];

  // if you change this directly, you are responsible for calling update on the corresponding ChartCanvasNode
  lineWidth: number;

  // CSS for rendering the stroke
  private strokeCSS: string | null;

  /**
   * @param {ChartTransform} chartTransform
   * @param {Array.<Vector2|null>} dataSet
   * @param {Object} [options]
   */
  constructor( chartTransform: ChartTransform, dataSet: Array<Vector2 | null>, options?: any ) {

    options = merge( {
      stroke: 'black', // {Color|string|null}
      lineWidth: 1
    }, options );

    super();

    this.chartTransform = chartTransform;
    this.dataSet = dataSet;


    this.lineWidth = options.lineWidth;

    this.strokeCSS = null; // updated in setStroke
    this.setStroke( options.stroke );
  }

  /**
   * Sets the stroke.
   * @param stroke - If you call setStroke, you are responsible for calling update on the associated ChartCanvasNode(s).
   */
  setStroke( stroke: Color | string | null ): void {
    assert && assert( stroke instanceof Color || ( typeof stroke === 'string' && Color.isCSSColorString( stroke ) ) || stroke === null, 'invalid stroke' );
    this.strokeCSS = stroke instanceof Color ? stroke.toCSS() : stroke;
  }

  set stroke( stroke: Color | string | null ) {
    this.setStroke( stroke );
  }

  dispose(): void {
    assert && assert( !this.isDisposed, 'already disposed' );
    this.isDisposed = true;
  }

  // Sets dataSet. You are responsible for calling update on the associated ChartCanvasNode(s).
  setDataSet( dataSet: Vector2[] ): void {
    this.dataSet = dataSet;
  }

  // Intended to be called by ChartCanvasNode.
  paintCanvas( context: CanvasRenderingContext2D ): void {
    context.beginPath();

    if ( this.strokeCSS ) {
      context.strokeStyle = this.strokeCSS;
      context.lineWidth = this.lineWidth;

      let moveToNextPoint = true;

      // Only access the data set length once for performance
      const length = this.dataSet.length;
      for ( let i = 0; i < length; i++ ) {

        const dataPoint = this.dataSet[ i ];
        assert && assert( dataPoint === null || dataPoint.isFinite(), 'data points must be finite Vector2 or null' );

        // Draw a line segment to the next non-null value. Null values result in a gap (via move) in the plot.
        if ( dataPoint ) {
          const viewPoint = this.chartTransform.modelToViewPosition( dataPoint );
          if ( moveToNextPoint ) {
            context.moveTo( viewPoint.x, viewPoint.y );
            moveToNextPoint = false;
          }
          else {
            context.lineTo( viewPoint.x, viewPoint.y );
          }
        }
        else {
          moveToNextPoint = true;
        }
      }
      context.stroke();
    }
  }
}

bamboo.register( 'CanvasLinePlot', CanvasLinePlot );
export default CanvasLinePlot;