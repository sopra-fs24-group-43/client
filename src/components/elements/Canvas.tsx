import React, { useEffect, useRef } from "react";
import p5 from 'p5';

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const canvas = new p5((p: p5) => {
      // Setup function
        p.setup = () => {
          p.createCanvas(400, 400);
          p.stroke(255); // Set line drawing color to white
          p.strokeWeight(5); // Set line thickness
        };

      // Draw function
      p.draw = () => {
        if (p.mouseIsPressed) {
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY); // Draw a line from previous mouse position to current mouse position
        }
      };
    }, canvasRef.current!);
  
    return () => {
      canvas.remove(); // Clean up p5.js instance
    };
  }, []);
  
  return <div ref={canvasRef}></div>;
};
  
export default Canvas;