import "./style.css";

//Title
const title = document.createElement("h1");
title.textContent = "D2 - Sticker Sketchpad";
document.body.appendChild(title);

//Canvas
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext("2d");
ctx?.clearRect(0, 0, canvas.width, canvas.height);

//Clear Button
const clearButton = document.createElement("button");
clearButton.textContent = `CLEAR`;
document.body.appendChild(clearButton);

//Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

//Mouse Event Listeners
//Holding mouse click down
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
});

//Moving the mouse
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  //Drawing behavior
  ctx?.beginPath();
  ctx?.moveTo(lastX, lastY);
  ctx?.lineTo(x, y);
  ctx?.stroke();
  lastX = x;
  lastY = y;
});

//Lifting mouseclick
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

//Mouse leaves the canvas
canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

//clear button handler
clearButton.addEventListener("click", () => {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
});
