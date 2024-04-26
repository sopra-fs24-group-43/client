import React, { useEffect, useState, useRef } from "react";

const RenderingGame = (payload) =>   {
  useEffect(() => {
    console.log("Coordinates are here: ", payload);
  }, [payload]);

}

export default RenderingGame; 