import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import '../../styles/views/Canvas.scss';

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'erase'>('pen');

  useEffect(() => {
    const stage = new Konva.Stage({
      container: canvasRef.current!,
      width: 400,
      height: 400,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    let isDrawing = false;
    let lastLine: Konva.Line | null = null;

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
      isDrawing = true;
      const pos = stage.getPointerPosition();
      lastLine = new Konva.Line({
        points: [pos.x, pos.y],
        stroke: drawingTool === 'pen' ? 'black' : 'white',
        strokeWidth: drawingTool === 'pen' ? 5 : 20,
        globalCompositeOperation: drawingTool === 'pen' ? 'source-over' : 'destination-out',
        lineCap: 'round',
        lineJoin: 'round',
      });
      layer.add(lastLine);
    };

    const handleMouseUp = () => {
      isDrawing = false;
      lastLine = null;
    };

    const handleMouseMove = () => {
      if (!isDrawing || !lastLine) return;
      const pos = stage.getPointerPosition();
      const oldPoints = lastLine.points();
      lastLine.points([...oldPoints, pos.x, pos.y]);
      layer.batchDraw();
    };

    stage.on('mousedown touchstart', handleMouseDown);
    stage.on('mouseup touchend', handleMouseUp);
    stage.on('mousemove touchmove', handleMouseMove);

    return () => {
      stage.destroy();
    };
  }, [drawingTool]);

  const handleToolChange = (tool: 'pen' | 'erase') => {
    setDrawingTool(tool);
  };

  return (
    <div>
      <div ref={canvasRef} className="Canvas container"></div>
      <div>
        <button onClick={() => handleToolChange('pen')} className={drawingTool === 'pen' ? 'active' : ''}>
          Pen
        </button>
        <button onClick={() => handleToolChange('erase')} className={drawingTool === 'erase' ? 'active' : ''}>
          Erase
        </button>
      </div>
    </div>
  );
};

export default Canvas;
