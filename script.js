let isUploading = false;

function downloadFile() {
    var form = document.getElementById("downloadForm");
    var formData = new FormData(form);
    let id = document.getElementById("fileId")
    fetch("https://test2-i2dn.onrender.com/downloadById?fileid=" + id.value, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        })
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = id.value;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function uploadFile() {
    if (isUploading) {
        alert("File is currently being uploaded. Please wait.");
        return;
    }

    const fileInput = document.getElementById('fileInput');
    const fileSize = fileInput.files[0]?.size;

    if (fileSize && fileSize > 500 * 1024 * 1024) {
        alert("File size exceeds the limit of 500 MB. please choose a smaller file.");
        return;
    }

    var form = document.getElementById("uploadForm");
    var formData = new FormData();
    formData.append('file', fileInput.files[0]);

    isUploading = true;

    fetch("https://test2-i2dn.onrender.com/upload", {
        method: "POST",
        body: formData
    })
        .then(response => {
            isUploading = false;
            if (!response.ok) {
                alert("Too many requests");
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
        });
}

function displayFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');

    fileNameDisplay.textContent = `selected file: ${fileInput.files[0].name}`;
}