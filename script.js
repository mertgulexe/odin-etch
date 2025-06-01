let isMouseDown = false;
const HOVER_CLASS_NAME = "hovered";
const MESH_CONTENT_NAME = ".mesh-content";
const mesh = document.querySelector(".mesh");
const meshHeight = mesh.clientHeight;
const meshWidth = mesh.clientWidth;
const sizingButton = document.querySelectorAll(".sizing-button-container .sizing-button");

window.addEventListener("DOMContentLoaded", () => {
    setMeshSize({
        currentTarget: {
            dataset: {
                xAxis: 10,
                yAxis: 20
            }
        }
    });
    
});

window.addEventListener("mousedown", () => isMouseDown = true);
window.addEventListener("mouseup", () => isMouseDown = false);

sizingButton.forEach(
    button => {
        button.addEventListener("click", setMeshSize)
    }
);

function setMeshSize(event) {
    mesh.innerHTML = "";
    const xAxis = parseInt(event.currentTarget.dataset.xAxis);
    const yAxis = parseInt(event.currentTarget.dataset.yAxis);
    
    for (let i = 0; i < (xAxis * yAxis); i++) {
        const div = document.createElement("div");
        div.classList.add("mesh-content");
        mesh.appendChild(div);
    }
    
    const meshContent = document.querySelectorAll(MESH_CONTENT_NAME);
    
    meshContent.forEach(
        div => {
            div.style.width = `${meshWidth / yAxis}px`;
            div.style.height = `${meshHeight / xAxis}px`;
        }
    );
    
    addColorEventListeners(meshContent);
}

function addColorEventListeners(element) {
    element.forEach(
        div => {
            div.addEventListener(
                "mouseover",
                e => {
                    e.currentTarget.classList.add(HOVER_CLASS_NAME);
                    if (isMouseDown) {
                        e.currentTarget.classList.add("clicked");
                    }
                }
            );
            div.addEventListener(
                "transitionend",
                e => e.currentTarget.classList.remove(HOVER_CLASS_NAME)
            );
            div.addEventListener(
                "mousedown",
                e => {
                    isMouseDown = true;
                    e.target.classList.add("clicked");
                }
            );
            div.addEventListener(
                "mouseup",
                e => {
                    isMouseDown = false;
                    e.target.classList.remove("clicked");
                }
            )
        }
    );
}
