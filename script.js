let isUploading = false;

async function downloadFile() {
    try {
        const overlay = document.getElementById('overlay');

        overlay.style.display = 'flex';
        let id = document.getElementById("fileId")
        const response = await fetch(`https://brnskl-file.onrender.com/downloadById?fileid=${id.value}`);
        const data = await response.json();
        if (data.url) {
            window.open(data.url, '_blank');

            hideOverlay();
        }
        else {
            hideOverlay();
        }

    } catch (error) {
        hideOverlay();

    }


}

function uploadFile() {
    if (isUploading) {
        alert("file is currently being uploaded. please wait.");
        return;
    }

    const fileInput = document.getElementById('fileInput');
    const fileSize = fileInput.files[0]?.size;

    if (fileSize && fileSize > 20 * 1024 * 1024) {
        alert("file size exceeds the limit of 20 MB. please choose a smaller file.");
        return;
    }

    var form = document.getElementById("uploadForm");
    var formData = new FormData();
    formData.append('file', fileInput.files[0]);

    isUploading = true;
    const overlay = document.getElementById('overlay');

    overlay.style.display = 'flex';
    fetch("https://brnskl-file.onrender.com/upload", {
        method: "POST",
        body: formData
    })
        .then(response => {
            isUploading = false;
            hideOverlay();
            if (!response.ok) {
                throw new Error("network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let fileidel = document.getElementById("fileid");
            fileidel.textContent = `file id: ${data.fileid}`;
        })
        .catch(error => {
            console.error("Error:", error);
            hideOverlay();
        });
}

function displayFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');

    fileNameDisplay.textContent = `selected file: ${fileInput.files[0].name}`;
}


function hideOverlay() {
    overlay.style.display = 'none';
}
