// Copyright 2020-2021, University of Colorado Boulder

/**
 * ChartCanvasNode renders to a canvas. It is usually preferable to use the other scenery Node-based
 * renderers, but this one can be necessary for performance-critical charts.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import { CanvasNode } from '../../scenery/js/imports.js';
import bamboo from './bamboo.js';
import ChartTransform from './ChartTransform.js';
import CanvasPainter from './CanvasPainter.js';

class ChartCanvasNode extends CanvasNode {
  private chartTransform: ChartTransform;

  // if you change this directly, you are responsible for calling update
  painters: CanvasPainter[];
  private disposeChartCanvasLinePlot: () => void;

  constructor( chartTransform: ChartTransform, painters: CanvasPainter[], options?: any ) {

    options = options || {};

    assert && assert( !options.canvasBounds, 'ChartCanvasNode sets canvasBounds' );
    options.canvasBounds = new Bounds2( 0, 0, chartTransform.viewWidth, chartTransform.viewHeight );

    super( options );

    this.chartTransform = chartTransform;
    this.painters = painters;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );

    this.disposeChartCanvasLinePlot = () => chartTransform.changedEmitter.removeListener( changedListener );
  }

  // Sets the painters and redraws the chart.
  setPainters( painters: CanvasPainter[] ): void {
    this.painters = painters;
    this.update();
  }

  update(): void {
    this.invalidatePaint();
  }

  // Used to redraw the CanvasNode. Use CanvasNode.invalidatePaint to signify that it is time to redraw the canvas.
  paintCanvas( context: CanvasRenderingContext2D ): void {
    this.painters.forEach( painter => {
      if ( painter.visible ) {

        // The context save and restore for each painter is intentional, so that we are guaranteed that a fill,
        // transform, etc, from one painter won't leak into another painter.
        context.save();
        painter.paintCanvas( context );
        context.restore();
      }
    } );
  }

  override dispose(): void {
    this.disposeChartCanvasLinePlot();
    super.dispose();
  }
}

bamboo.register( 'ChartCanvasNode', ChartCanvasNode );
export default ChartCanvasNode;