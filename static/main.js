let files = [];
let fileContainer, progressBar, fileSelector;
let uploading = false;

window.onload = () => {
    progressBar = document.getElementById("upload-progress");
    fileContainer = document.getElementById("file-container");
    fileSelector = document.getElementById("file-selector");
    progressBar.style.width = "0%";
};

function dropHandler(event) {
    event.preventDefault();
    if (event.dataTransfer.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === "file") {
                const file = event.dataTransfer.items[i].getAsFile();
                files.push(file);
            }
        }
    } else {
        files = [...files, ...ev.dataTransfer.files];
    }
    updateFileDisplay();
}

function dragOverHandler(event) {
    event.preventDefault();
}

function selectFiles() {
    fileSelector.click();
}

function onFileSelected() {
    files = [...files, ...fileSelector.files];
    updateFileDisplay();
    fileSelector.value = "";
}

async function upload() {
    if (!uploading) {
        uploading = true;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`file${i}`, files[i]);
        }
        const xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.onload = () => {
            uploading = false;
            progressBar.style.width = "0%";
            clearFiles();
            showMessage(xhr.response.error, xhr.response.message);
        };
        xhr.upload.onprogress = ev => {
            const percentage = (ev.loaded / ev.total) * 100;
            progressBar.style.width = `${Math.floor(percentage)}%`;
        };
        xhr.open("POST", "/upload");
        xhr.send(formData);
    }
}

function clearFiles() {
    files = [];
    fileContainer.innerHTML = "";
}

function removeFile(index) {
    files.splice(index, 1);
    updateFileDisplay();
}

function updateFileDisplay() {
    let html = "";
    files.forEach((file, index) => {
        html += `<div class="file" onclick="removeFile(${index})">
        <p class="file-name">${file.name}</p>
        <p class="file-size">${file.size}</p>
        </div>`;
    });
    fileContainer.innerHTML = html;
}

function showMessage(error, message) {
    if (uploading) return;
    uploading = true;
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    x.style.backgroundColor = error ? "#ff022c" : "#04e684";
    setTimeout(function() {
        uploading = false;
        x.className = x.className.replace("show", "");
    }, 3000);
}
