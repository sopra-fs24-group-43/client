import React, { useEffect, useRef, useState } from "react";
import p5 from 'p5';

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drawingTool, setDrawingTool] = useState<'pen' | 'eraser'>('pen'); 

  useEffect(() => {
    const canvas = new p5((p: p5) => {
      let drawing: any[] = []; 


      p.setup = () => {
        p.createCanvas(400, 400);
        p.background(255);
        p.strokeWeight(5); 
      };

      
      const draw = () => {
        p.stroke(0); 
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY); 
        drawing.push([p.mouseX, p.mouseY]); 
      };


      const erase = () => {
        p.stroke(0); 
        p.strokeWeight(20); 
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        
        for (let i = 0; i < drawing.length; i++) {
          const [x, y] = drawing[i];
          const distance = p.dist(x, y, p.mouseX, p.mouseY);
          if (distance < 10) { 
            drawing.splice(i, 1); 
          }
        }
      };


      p.draw = () => {
        if (p.mouseIsPressed) {
        
          if (drawingTool === 'pen') {
            draw();
          }
       
          else if (drawingTool === 'eraser') {
            erase();
          }
        }
      };


      const toggleDrawingTool = () => {
        setDrawingTool(currentTool => currentTool === 'pen' ? 'eraser' : 'pen');
      };


      p.keyPressed = () => {
        if (p.key === 'e') {
          toggleDrawingTool();
        }
      };


      setDrawingTool('pen');

    }, canvasRef.current!);

    return () => {
      canvas.remove(); 
    };
  }, [drawingTool]);

  return <div ref={canvasRef}></div>;
};

export default Canvas;
