const imageInput = document.getElementById("imageInput");
const canvasContainer = document.getElementById("canvasContainer");
const rectangles = [];
var lengthRectangles = rectangles.length;

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = document.createElement("img");
    img.src = event.target.result;
    img.draggable = false;

    canvasContainer.innerHTML = ""; // Clear any previous image or rectangles
    canvasContainer.appendChild(img);

    // Add event listeners for drawing rectangles
    img.addEventListener("mousedown", startDrawing);
    img.addEventListener("mousemove", continueDrawing);
    img.addEventListener("mouseup", finishDrawing);
    var x = 0;
    rectangles.forEach(function (rectangle) {
      const rectOverlay = document.createElement("div");
      rectOverlay.id = "rectangle" + ++x;
      rectOverlay.classList.add("rectangle-overlay-"+rectangle.type);
      rectOverlay.style.left = rectangle.x + "px";
      rectOverlay.style.top = rectangle.y + "px";
      rectOverlay.style.width = rectangle.w + "px";
      rectOverlay.style.height = rectangle.h + "px";
      canvasContainer.appendChild(rectOverlay);
    });
    updateTable();
  };

  reader.readAsDataURL(file);
});

let isDrawing = false;
let startX,
  startY,
  rect = null;

function startDrawing(event) {
  isDrawing = true;
  startX = event.offsetX;
  startY = event.offsetY;
  rect = document.createElement("div");
  rect.id = "rectangle" + (++lengthRectangles);
  rect.classList.add("rectangle-overlay-select");
  canvasContainer.appendChild(rect);
}

function continueDrawing(event) {
  if (isDrawing) {
    const width = event.offsetX - startX;
    const height = event.offsetY - startY;
    // Get image dimensions
    const img = canvasContainer.querySelector("img");
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Only draw the rectangle if width and height are greater than 2px
    if (width > 2 && height > 2) {
      rect.style.left = startX + "px";
      rect.style.top = startY + "px";
      rect.style.width = width + "px";
      rect.style.height = height + "px";
    }

    if ((event.offsetX > imgWidth - 5) | (event.offsetY > imgHeight - 5))
      finishDrawing();
  }
}

function finishDrawing(event) {
  if (isDrawing) {
    isDrawing = false;
    let x = parseInt(rect.style.left),
      y = parseInt(rect.style.top);
    if ((x > 0) & (y > 0)) {
      const rectangle = {
        id: rect.id,
        x: parseInt(rect.style.left),
        y: parseInt(rect.style.top),
        w: parseInt(rect.style.width),
        h: parseInt(rect.style.height),
        type: "",
      };

      rectangles.push(rectangle);
      console.log(rectangles);
        updateTable();
    }
  }
}

///
///
///
/// Tableeeeeeeeeeeeeee
function updateTable() {
  const table = document.getElementById("rectangleTable");
  // Clear existing rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Add rows based on the rectangles array
  rectangles.forEach((rectangle) => {
    var selectList = createSelectList(rectangle.id, rectangle.type);
    var deleteButton = createDeleteButton(rectangle.id);

    const row = table.insertRow(-1);
    const cellX = row.insertCell(0);
    const cellY = row.insertCell(1);
    const cellWidth = row.insertCell(2);
    const cellHeight = row.insertCell(3);
    const cellType = row.insertCell(4);
    const cellDelete = row.insertCell(5);

    cellX.textContent = rectangle.x;
    cellY.textContent = rectangle.y;
    cellWidth.textContent = rectangle.w;
    cellHeight.textContent = rectangle.h;
    cellType.appendChild(selectList);
    cellDelete.appendChild(deleteButton);
  });
}
///
///
///
///listtttttttttttt
function createSelectList(id, type) {
  var selectList = document.createElement("select");

  var option0 = document.createElement("option");
  option0.value = "select";
  option0.text = "Select";
  selectList.appendChild(option0);

  var option1 = document.createElement("option");
  option1.value = "red";
  option1.text = "Red";
  selectList.appendChild(option1);

  var option2 = document.createElement("option");
  option2.value = "green";
  option2.text = "Green";
  selectList.appendChild(option2);

  var option3 = document.createElement("option");
  option3.value = "blue";
  option3.text = "Blue";
  selectList.appendChild(option3);

  var option4 = document.createElement("option");
  option4.value = "yellow";
  option4.text = "Yellow";
  selectList.appendChild(option4);

  var defaultValue = type;

  for (var i = 0; i < selectList.options.length; i++) {
    if (selectList.options[i].value === defaultValue) {
      selectList.options[i].selected = true;
      break;
    }
  }

  selectList.addEventListener("change", function () {
    const rectangle = document.getElementById(id);
    updateTypeById(rectangles, id, selectList.value);
    rectangle.removeAttribute("class");
    rectangle.classList.add("rectangle-overlay-" + selectList.value);
  });
  return selectList;
}

function updateTypeById(rectangles, id, type) {
  for (let i = 0; i < rectangles.length; i++) {
    if (rectangles[i].id === id) {
      rectangles[i].type = type;
      break; // Assuming each ID is unique, exit the loop after updating
    }
  }
}

///
///
function createDeleteButton(id) {
  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click",function() {
    let i=0;
    for (i = 0; i < rectangles.length; i++) {
        if (rectangles[i].id === id) { 
            rectangles.splice(i,1);
            updateTable();
          break; // Assuming each ID is unique, exit the loop after updating
        }
    }
    var elementToDelete = document.getElementById(id);
    if (elementToDelete) {
        elementToDelete.remove();
    }

  });
return deleteButton
}
