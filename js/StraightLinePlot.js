// Copyright 2021, University of Colorado Boulder

/**
 * StraightLinePlot plots a straight line, described by y = mx + b.
 * This was created for the Google Group discussion in
 * https://groups.google.com/g/developing-interactive-simulations-in-html5/c/k9P78WZivJ4.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../phet-core/js/merge.js';
import Line from '../../scenery/js/nodes/Line.js';
import bamboo from './bamboo.js';

class StraightLinePlot extends Line {

  /**
   * @param chartTransform
   * @param {number} m - the slope, use Infinity for undefined slope (vertical line)
   * @param {number} b - the y-intercept
   * @param options
   */
  constructor( chartTransform, m, b, options ) {

    options = merge( {

      // Path options
      stroke: 'black',
      lineWidth: 1
    }, options );

    super( 0, 0, 1, 1, options );

    // @private
    this.chartTransform = chartTransform;
    this._m = m;
    this._b = b;

    // initial state
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    // @private
    this.disposeStraightLinePlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  /**
   * Sets the slope and redraws the plot.
   * @param {number} m
   * @public
   */
  setSlope( m ) {
    this._m = m;
    this.update();
  }

  set m( value ) { this.setSlope( value ); }

  get m() { return this._m; }

  /**
   * Sets the y-intercept and redraws the plot.
   * @param {number} b
   * @public
   */
  setYIntercept( b ) {
    this._b = b;
    this.update();
  }

  set b( value ) { this.setYIntercept( value ); }

  get b() { return this._b; }

  /**
   * Solves for y.
   * @param {number} x
   * @returns {number}
   * @public
   */
  solve( x ) {
    return ( this._m * x ) + this._b;
  }

  /**
   * Recomputes the endpoints of the line.
   * @public
   */
  update() {

    if ( this._m === Infinity ) {

      // slope is undefined, draw a vertical line
      const modelX = 0;
      const modelMinY = this.chartTransform.modelYRange.min;
      const modelMaxY = this.chartTransform.modelYRange.max;

      const viewX = this.chartTransform.modelToViewX( modelX );
      const viewMinY = this.chartTransform.modelToViewY( modelMinY );
      const viewMaxY = this.chartTransform.modelToViewY( modelMaxY );

      this.setLine( viewX, viewMinY, viewX, viewMaxY );
    }
    else {

      // Determine the endpoints, in model coordinates
      const modelMinX = this.chartTransform.modelXRange.min;
      const modelMinY = this.solve( modelMinX );
      const modelMaxX = this.chartTransform.modelXRange.max;
      const modelMaxY = this.solve( modelMaxX );

      // Convert to view coordinates
      const viewMinX = this.chartTransform.modelToViewX( modelMinX );
      const viewMinY = this.chartTransform.modelToViewY( modelMinY );
      const viewMaxX = this.chartTransform.modelToViewX( modelMaxX );
      const viewMaxY = this.chartTransform.modelToViewY( modelMaxY );

      this.setLine( viewMinX, viewMinY, viewMaxX, viewMaxY );
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeStraightLinePlot();
    super.dispose();
  }
}

bamboo.register( 'StraightLinePlot', StraightLinePlot );
export default StraightLinePlot;