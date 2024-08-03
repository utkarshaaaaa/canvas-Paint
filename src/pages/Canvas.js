import React, { useRef, useState, useEffect } from "react";
import "./canvs.css";
import io from "socket.io-client";

export default function Canvas() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3B3B3B");
  const [size, setSize] = useState("3");
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const timeout = useRef(null);
  const [cursor, setCursor] = useState("default");
  const socket = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const canvasimg = localStorage.getItem("canvasimg");
    if (canvasimg) {
      const image = new Image();
      image.onload = () => {
        ctx.current.drawImage(image, 0, 0);
        setIsDrawing(false);
      };
      image.src = canvasimg;
    }

    socket.current = io.connect("http://localhost:3001");
  }, []);

  const startPosition = ({ nativeEvent }) => {
    setIsDrawing(true);
    draw(nativeEvent);
  };

  const finishedPosition = () => {
    setIsDrawing(false);
    ctx.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { clientX, clientY } = nativeEvent;

    ctx.current.lineWidth = size;
    ctx.current.lineCap = "round";
    ctx.current.strokeStyle = color;

    ctx.current.lineTo(clientX, clientY);
    ctx.current.stroke();
    ctx.current.beginPath();
    ctx.current.moveTo(clientX, clientY);

    if (timeout.current !== undefined) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const base64ImageData = canvasRef.current.toDataURL("image/png");
      localStorage.setItem("canvasimg", base64ImageData);
      socket.current.emit("canvas-data", base64ImageData);
    }, 400);
  };

  const clearCanvas = () => {
    localStorage.removeItem("canvasimg");
    const canvas = canvasRef.current;
    ctx.current.fillStyle = "white";
    ctx.current.fillRect(0, 0, canvas.width, canvas.height);

    if (timeout.current !== undefined) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const base64ImageData = canvas.toDataURL("image/png");
      localStorage.setItem("canvasimg", base64ImageData);
    }, 400);
  };

  const getPen = () => {
    setCursor("default");
    setSize("3");
    setColor("#3B3B3B");
  };

  const eraseCanvas = () => {
    setCursor("grab");
    setSize("20");
    setColor("#FFFFFF");
  };

  return (
    <div>
      <div className="header">
        Draw Anything !!
      </div>
      <div className="canvas-btn">
        <button onClick={getPen} className="btn btn-primary">
          Pencil
        </button>
        <div className="color-picker btn">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <select
            className="btn btn-primary"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="1"> 1 </option>
            <option value="3"> 3 </option>
            <option value="5"> 5 </option>
            <option value="10"> 10 </option>
            <option value="15"> 15 </option>
            <option value="20"> 20 </option>
            <option value="25"> 25 </option>
            <option value="30"> 30 </option>
          </select>
        </div>
        <button onClick={clearCanvas} className="btn btn-danger">
          Clear
        </button>
        <div>
          <button onClick={eraseCanvas} className="btn btn-secondary">
            Erase
          </button>
        </div>
      </div>

      <canvas
        style={{ cursor: cursor }}
        onMouseDown={startPosition}
        onMouseUp={finishedPosition}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
}
