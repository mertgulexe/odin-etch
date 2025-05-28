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
    })
});

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
    const meshContent = document.querySelectorAll(".mesh-content");
    meshContent.forEach(
        div => {
            div.style.width = `${meshWidth / yAxis}px`;
            div.style.height = `${meshHeight / xAxis}px`;
        }
    );
}

