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
document.body.append(document.createElement("br"));
document.body.append(document.createElement("br"));
document.body.appendChild(clearButton);

//Undo and Redo Buttons
const undoButton = document.createElement("button");
undoButton.textContent = `UNDO`;
const redoButton = document.createElement("button");
redoButton.textContent = `REDO`;
document.body.appendChild(undoButton);
document.body.appendChild(redoButton);

//Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

//Event for when a drawing changes
const drawingChanged = new Event("redraw");

//Class that holds drawing data
class lineCommand {
  points: [{ x: number; y: number }];
  constructor(x: number, y: number) {
    this.points = [{ x, y }];
  }

  execute() {
    ctx?.beginPath();
    const { x, y } = this.points[0];
    ctx?.moveTo(x, y);
    for (const { x, y } of this.points) {
      ctx?.lineTo(x, y);
    }
    ctx?.stroke();
  }

  grow(x: number, y: number) {
    this.points.push({ x, y });
  }
}

//Current line the user is drawing. Will be pushed into lines array
let currentLine: lineCommand;

//Array of all lines displayed on screen. Is an array of every set of lines that are drawn
const lines: lineCommand[] = [];

//Array of all lines that are undo-ed availible for redo
const redoLines: lineCommand[] = [];

//Mouse Event Listeners
//Holding mouse click down
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;

  currentLine = new lineCommand(lastX, lastY);
  lines.push(currentLine);
  redoLines.splice(0, redoLines.length); //Erases redo history for new mouse options

  canvas.dispatchEvent(drawingChanged);
});

//Moving the mouse
canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  currentLine.grow(lastX, lastY);
  console.log(`lastX: ${lastX}, lastY: ${lastY}`);

  canvas.dispatchEvent(drawingChanged);
});

//Lifting mouseclick
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  canvas.dispatchEvent(drawingChanged);
});

//Mouse leaves the canvas
canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
  canvas.dispatchEvent(drawingChanged);
});

//Redrawing Event Listener/Observer
canvas.addEventListener("redraw", () => {
  console.log("Redraw is called");
  ctx?.clearRect(0, 0, canvas.width, canvas.height); //Clear canvas so there is no line doubling

  lines.forEach((line) => line.execute());
});

//clear button handler
clearButton.addEventListener("click", () => {
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  lines.splice(0, lines.length); //Deletes elements in array from 0 to line length, which is everything in the array
});

//Undo button handler
undoButton.addEventListener("click", () => {
  if (lines.length > 0) {
    redoLines.push(lines.pop()!);
    canvas.dispatchEvent(drawingChanged);
  }
});

//Redo button handler
redoButton.addEventListener("click", () => {
  if (redoLines.length > 0) {
    lines.push(redoLines.pop()!);
    canvas.dispatchEvent(drawingChanged);
  }
});
