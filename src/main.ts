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
canvas.style.cursor = "none";
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

//Thickness Buttons
const thinButton = document.createElement("button");
thinButton.textContent = `THIN`;
const thickButton = document.createElement("button");
thickButton.textContent = `THICK`;
document.body.append(document.createElement("br"));
document.body.appendChild(thinButton);
document.body.appendChild(thickButton);

//Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

//Event for when a drawing changes
const drawingChanged = new Event("redraw");

//Event for cursor/tool moving
const toolMoved = new Event("toolMoved");

//Class that holds line thickness data
class marker {
  thickness: number;
  constructor(thickness: number) {
    this.thickness = thickness;
  }
}

//Class that holds drawing data
class lineCommand {
  points: [{ x: number; y: number }];
  marker: marker;
  constructor(x: number, y: number) {
    this.points = [{ x, y }];
    this.marker = new marker(currentMarkerThickness);
  }

  execute() {
    ctx!.lineWidth = this.marker.thickness;
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

//class that hold cursor data
class CursorCommand {
  x: number;
  y: number;
  previewSize: number;
  previewImage: string;
  constructor(
    x: number,
    y: number,
    previewSize: number = currentMarkerThickness,
    previewImage: string = currentMarkerPreview,
  ) {
    this.x = x;
    this.y = y;
    this.previewSize = previewSize;
    this.previewImage = previewImage;
  }
  execute() {
    ctx!.font = `${this.previewSize * 4}px monospace`;
    ctx?.fillText(
      `${this.previewImage}`,
      this.x - (this.previewSize),
      this.y + (this.previewSize),
    );
  }
}

//Current line the user is drawing. Will be pushed into lines array
let currentLine: lineCommand;

//Array of all lines displayed on screen. Is an array of every set of lines that are drawn
const lines: lineCommand[] = [];

//Array of all lines that are undo-ed availible for redo
const redoLines: lineCommand[] = [];

//Variables for marker creation, set to default of 3 matching thin marker
let currentMarkerThickness = 3;
let currentMarkerPreview = `*`;

//Current position of cursor
let cursorPreview: CursorCommand | null = null;

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
  //Position of cursor
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;

  //Preview of cursor
  cursorPreview = new CursorCommand(lastX, lastY);
  canvas.dispatchEvent(toolMoved);

  //Drawing if mouse is held down
  if (!isDrawing) return;
  currentLine.grow(lastX, lastY);
  canvas.dispatchEvent(drawingChanged);
});

//Lifting mouseclick
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  canvas.dispatchEvent(drawingChanged);
});

//Mouse leaves the canvas
canvas.addEventListener("mouseleave", (e) => {
  isDrawing = false;
  canvas.dispatchEvent(drawingChanged);
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  cursorPreview = new CursorCommand(lastX, lastY);
  canvas.dispatchEvent(toolMoved);
});

//Mouse enters the canvas
canvas.addEventListener("mouseenter", (e) => {
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  cursorPreview = new CursorCommand(lastX, lastY);
  canvas.dispatchEvent(toolMoved);
});

//Redrawing Event Listener/Observer
canvas.addEventListener("redraw", () => {
  console.log("Redraw is called");
  ctx?.clearRect(0, 0, canvas.width, canvas.height); //Clear canvas so there is no line doubling

  lines.forEach((line) => line.execute());
});

//Mouse move Event Listener/Observer
canvas.addEventListener("toolMoved", () => {
  canvas.dispatchEvent(drawingChanged); //Calls redraw event to have the lines first and clear the canvas
  console.log("Tool moved is called");
  cursorPreview?.execute(); //Draws the preview on top of canvas
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

//Thin button handler
thinButton.addEventListener("click", () => {
  console.log("Thin button clicked");
  currentMarkerThickness = 3;
  currentMarkerPreview = `*`;
});

//Thick button handler
thickButton.addEventListener("click", () => {
  console.log("Thick button clicked");
  currentMarkerThickness = 10;
  currentMarkerPreview = `o`;
});
