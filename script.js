let isMouseDown = false;
let penColor = "gray";
let initialPenColorOpacity = 0.25;
const DEFAULT_PEN_COLOR = "rgb(73, 73, 73)";
const HOVER_SELECTOR = "hovered";
const MESH_CONTENT_SELECTOR = ".mesh-content";
const BUTTON_CLICK_SELECTOR = "clicked";
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
        requestAnimationFrame(() => target.classList.add(BUTTON_CLICK_SELECTOR));
    });
    button.addEventListener("transitionend", event => {
        const target = event.currentTarget;
        if (event.propertyName === "transform") {
            setTimeout(
                () => target.classList.remove(BUTTON_CLICK_SELECTOR),
                Math.floor(Math.random() * 2000) + 200
            );
        }
    });
});
sweepButton.addEventListener("click", resetMesh);
colorButton.addEventListener("click", changeDrawingColor);

function setMeshSize(xAxis=10, yAxis=20) {
    mesh.innerHTML = "";
    for (let i = 0; i < (xAxis * yAxis); i++) {
        const div = document.createElement("div");
        div.classList.add("mesh-content");
        mesh.appendChild(div);
    }    
    const meshBlocks = document.querySelectorAll(MESH_CONTENT_SELECTOR);
    
    meshBlocks.forEach(
        div => {
            div.style.width = `${MESH_WIDTH / yAxis}px`;
            div.style.height = `${MESH_HEIGHT / xAxis}px`;
        }
    );
    addDelegatedEventListenersForMeshBlocks();
    // meshBlocks.forEach(div => addColorEventListeners(div));
    return meshBlocks;
}


function addDelegatedEventListenersForMeshBlocks() {
    mesh.addEventListener("mousedown", (e) => {
        const target = e.target.closest(MESH_CONTENT_SELECTOR);
        if (!target || !mesh.contains(target)) return;
        setDrawingColor(target);
    });

    mesh.addEventListener("mouseover", (e) => {
        const target = e.target.closest(MESH_CONTENT_SELECTOR);
        if (!target || !mesh.contains(target)) return;

        const isUnhovered = !target.classList.contains(HOVER_SELECTOR);
        const isUncolored = target.style.backgroundColor === '';
        if (isUnhovered && isUncolored) {
            target.classList.add(HOVER_SELECTOR);
        }

        if (isMouseDown) {
            setDrawingColor(target);
        }
    });

    mesh.addEventListener("transitionend", (e) => {
        const target = e.target.closest(MESH_CONTENT_SELECTOR);
        if (!target || !mesh.contains(target)) return;
        target.classList.remove(HOVER_SELECTOR);
    });
}


// function addColorEventListeners(element) {
//     element.addEventListener("mousedown", e => setDrawingColor(e));
//     element.addEventListener("mouseover", e => {
//         const currentTarget = e.currentTarget;
//         const isUnhovered = !currentTarget.classList.contains(HOVER_SELECTOR);
//         const isUncolored = currentTarget.style.backgroundColor === '';
//         if (isUnhovered && isUncolored) {
//             currentTarget.classList.add(HOVER_SELECTOR);
//         }
//         if (isMouseDown) setDrawingColor(e);
//     });
//     element.addEventListener("transitionend", e => {
//         e.currentTarget.classList.remove(HOVER_SELECTOR);
//     });
// }

function resetMesh(event) {
    event.currentTarget.classList.toggle("right-side");
    setTimeout(
        () => {
            meshContent.forEach((div) => {
                div.classList.remove(BUTTON_CLICK_SELECTOR);
                div.style.backgroundColor = '';
            });
        },
        400
    );
}

function setDrawingColor(currentTarget) {
    if (penColor === "rainbow") {
        let randomColor = Math.floor(Math.random() * (16**8 - 1));  // alpha channel included
        randomColor = '#' + randomColor.toString(16).padStart(8, '0');
        currentTarget.style.backgroundColor = randomColor;
        currentTarget.classList.remove(HOVER_SELECTOR);
    } else {
        const isAlreadyColored = currentTarget.classList.contains(BUTTON_CLICK_SELECTOR);
        currentTarget.style.backgroundColor = DEFAULT_PEN_COLOR;
        currentTarget.classList.add(BUTTON_CLICK_SELECTOR);
        currentTarget.classList.remove(HOVER_SELECTOR);
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

function changeDrawingColor(event) {
    const target = event.currentTarget;
    const isGrayscale = !target.classList.contains(BUTTON_CLICK_SELECTOR);
    penColor = isGrayscale ? "rainbow": "gray";  // change pen color
    requestAnimationFrame(
        () => {
            target.classList.toggle(BUTTON_CLICK_SELECTOR);
            const targetButton = target.querySelector("span");
            setTimeout(
                () => targetButton.textContent = isGrayscale ? "Gray": "Colored",
                400
            );
        }
    );
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
[x] Check performance drop on large meshes while dev tool is open!
    * It is probably due to dynamically created flex items. Grid is not allowed in this project, so I cannot use it.
    * The event listeners are delegated, so it should not be a problem.
*/