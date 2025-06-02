let isMouseDown = false;
let initialPenColorOpacity = 0.25;
const HOVER_CLASS_NAME = "hovered";
const RANDOM_COLOR_CLASS_NAME = "random-color";
const MESH_CONTENT_CLASS_NAME = ".mesh-content";
const BUTTON_CLICK_CLASS_NAME = "clicked";
const entireFrame = document.querySelector(".entire-frame");
const mesh = document.querySelector(".mesh");
const MESH_HEIGHT = mesh.clientHeight;
const MESH_WIDTH = mesh.clientWidth;
const sizingButton = document.querySelectorAll(".sizing-button-container .sizing-button");
const sweepButton = document.querySelector(".sweep-button");
const colorButton = document.querySelector(".color-button");
let meshContent = setMeshSize();

document.addEventListener("mousedown", () => isMouseDown = true);
document.addEventListener("mouseup", () => isMouseDown = false);
document.addEventListener("blur", () => isMouseDown = false);
entireFrame.addEventListener("contextmenu", e => e.preventDefault());
entireFrame.addEventListener("dragstart", e => e.preventDefault());

sizingButton.forEach(button => {
    button.addEventListener("click", event => {
        meshContent = setMeshSize(
            event.currentTarget.dataset.xAxis,
            event.currentTarget.dataset.yAxis
        );
        const target = event.currentTarget;
        requestAnimationFrame(() => target.classList.add(BUTTON_CLICK_CLASS_NAME));
    });
    button.addEventListener("transitionend", event => {
        const target = event.currentTarget;
        if (event.propertyName === "transform") {
            setTimeout(
                () => target.classList.remove(BUTTON_CLICK_CLASS_NAME),
                Math.floor(Math.random() * 2000) + 200
            );
        }
    });
});
sweepButton.addEventListener("click", resetMesh);
colorButton.addEventListener("click", (event) => {
    const target = event.currentTarget;
    const isGrayscale = !target.classList.contains(BUTTON_CLICK_CLASS_NAME);
    meshContent.forEach((div) => {
        div.classList.toggle(RANDOM_COLOR_CLASS_NAME);
    });
    requestAnimationFrame(
        () => {
            target.classList.toggle(BUTTON_CLICK_CLASS_NAME);
            const targetButton = target.querySelector("span");
            setTimeout(
                () => targetButton.textContent = isGrayscale ? "Gray": "Colored",
                400
            );
        }
    );
});

function setMeshSize(xAxis=10, yAxis=20) {
    mesh.innerHTML = "";
    for (let i = 0; i < (xAxis * yAxis); i++) {
        const div = document.createElement("div");
        div.classList.add("mesh-content");
        mesh.appendChild(div);
    }    
    const meshBlocks = document.querySelectorAll(MESH_CONTENT_CLASS_NAME);
    
    meshBlocks.forEach(
        div => {
            div.style.width = `${MESH_WIDTH / yAxis}px`;
            div.style.height = `${MESH_HEIGHT / xAxis}px`;
        }
    );
    meshBlocks.forEach(div => addColorEventListeners(div));
    return meshBlocks;
}

function addColorEventListeners(element) {
    element.addEventListener("mousedown", e => setDrawingColor(e));
    element.addEventListener("mouseover", e => {
        const currentTarget = e.currentTarget;
        const isUnhovered = !currentTarget.classList.contains(HOVER_CLASS_NAME);
        const isUncolored = currentTarget.style.backgroundColor === '';
        if (isUnhovered && isUncolored) {
            currentTarget.classList.add(HOVER_CLASS_NAME);
        }
        if (isMouseDown) setDrawingColor(e);
    });
    element.addEventListener("transitionend", e => {
        e.currentTarget.classList.remove(HOVER_CLASS_NAME);
    });
}

function resetMesh(event) {
    event.currentTarget.classList.toggle("right-side");
    setTimeout(() => {
        meshContent.forEach((div) => div.style.backgroundColor = '');
    }, 400);
}

function setDrawingColor(event) {
    const currentTarget = event.currentTarget;
    if (currentTarget.classList.contains(RANDOM_COLOR_CLASS_NAME)) {
        let randomColor = Math.floor(Math.random() * (16**8 - 1));  // alpha channel included
        randomColor = randomColor.toString(16).padStart(9, '#');
        currentTarget.style.backgroundColor = randomColor;
        currentTarget.classList.remove(HOVER_CLASS_NAME);
    } else {
        const isAlreadyColored = currentTarget.classList.contains(BUTTON_CLICK_CLASS_NAME);
        currentTarget.classList.add(BUTTON_CLICK_CLASS_NAME);
        currentTarget.classList.remove(HOVER_CLASS_NAME);
        console.log(isAlreadyColored);
        if (isAlreadyColored) {
            setPenColorOpacity(currentTarget);
        } else {
            currentTarget.style.opacity = initialPenColorOpacity;
        };
    }
}

function setPenColorOpacity(element) {
    let currentPenColorOpacity = parseFloat(element.style.opacity);
    const isStillTransparent = currentPenColorOpacity < 1;
    if (isStillTransparent) {
        currentPenColorOpacity += 0.25;
        element.style.opacity = currentPenColorOpacity;
    };
}

/* TODO:
[x] Randomise defaultPenColor color.
[x] Add animations to buttons.
[x] Add transitionend and event.propertyName === "transform" to animated buttons.
[ ] Change the color of the pressed button.
[x] Change the color of the buttons altogether. They are ugly!
[x] Change the title.
[x] Fix the title box overflow (it is larger than the mesh box).
[x] Add footer with links to the project repository.
[x] Change font type, color and transparency.
[ ] Check performance drop on large meshes while dev tool is open!
    * It is probably due to dynamically created flex items.
    * Grid is not allowed in this project, so I cannot use it.
*/