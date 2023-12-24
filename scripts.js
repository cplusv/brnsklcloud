let isUploading = false;
function handleDroppedFile(file) {
    const fileInput = document.getElementById('fileInput');

    const fileList = new DataTransfer();
    fileList.items.add(file);

    fileInput.files = fileList.files;

    displayFileName();
}

document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleDroppedFile(file);
    });
});
async function downloadFile() {
    try {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'flex';
        let id = document.getElementById("fileId")
        const response = await fetch(`https://brnskl-file.onrender.com/downloadById?fileid=${id.value}`);
        let fileNameRes = await fetch(`https://brnskl-file.onrender.com/fileInfo?fileid=${id.value}`)
        let fileName = await fileNameRes.json()
        console.log(fileName)
        if (!response.ok) throw new Error(`Server responded with a non-OK status: ${response.status}`);
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        let filename = fileName.name;
        if (contentDispositionHeader) {
            const matches = contentDispositionHeader.match(/filename="?([^"]+)"?/);
            if (matches && matches[1]) {
                filename = matches[1];
            }
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        link.parentNode.removeChild(link);
    } catch (error) {
    } finally {
        hideOverlay();
    }
}
function uploadFile() {
    if (isUploading) {
        alert("File is currently being uploaded. Please wait.");
        return;
    }

    const fileInput = document.getElementById('fileInput');
    const fileSize = fileInput.files[0]?.size;
    const fileType = fileInput.files[0]?.type;
    const fileName = fileInput.files[0]?.name;
    if (!fileInput.files[0]) {
        alert("Please select a file.");
        return;
    }

    const fileExtension = fileName.split('.').pop().toLowerCase();

    const allowedFileExtensions = ['zip', 'rar', '7z', 'exe'];

    if (!allowedFileExtensions.includes(fileExtension)) {
        alert("invalid file type. only archives and .exe files are allowed.");
        return;
    }

    if (fileSize && fileSize > 20 * 1024 * 1024) {
        alert("file size exceeds the limit of 20 MB. please choose a smaller file.");
        return;
    }

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
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let fileidel = document.getElementById("fileid");
            let fileurl = document.getElementById("fileurl");
            fileidel.textContent = `file id: ${data.fileid}`;
            fileurl.textContent = `file url: https://cplusv.github.io/brnsklcloud/${data.fileid}`;
        })
        .catch(error => {
            alert("rate limited")
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
