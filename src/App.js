import React, { Component, useEffect, useState } from "react";
import { render } from "react-dom";
import io from "socket.io-client";
import Canvas from "./pages/Canvas";
import { Stage, Layer, Rect, Text } from "react-konva";
import Konva from "konva";

function App() {
  return (
    <div className="App">
      <Canvas />
    </div>
  );
}

export default App;
