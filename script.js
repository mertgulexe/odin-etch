const mesh = document.querySelector(".mesh");
const meshHeight = mesh.clientHeight;
const meshWidth = mesh.clientWidth;

function setMeshSize(xAxis=10, yAxis=20) {
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

setMeshSize();