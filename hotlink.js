
document.addEventListener('DOMContentLoaded', async () => {
    await getFile()
});


async function getFile() {
    let wurl = window.location.href
    let fileids = wurl.split("brnsklcloud/")
    const file = await fetch(`https://brnskl-file.onrender.com/fileInfo?fileid=${fileids[1]}`)
    const fdata = await file.json()
    console.log(fdata.name)
    if (fdata.name) {
        let filename = document.getElementById("filename")
        let fileid = document.getElementById("fileid")
        filename.textContent = fdata.name
        fileid.textContent = fileids[1]
        let downloadbtn = document.getElementById("downloadbtn")
        downloadbtn.style.display = "inline-block"
    }
}

async function downloadFile() {
    try {
        let wurl = window.location.href
        let fileids = wurl.split("brnsklcloud/")
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'flex';
        let id = document.getElementById("fileId")
        const response = await fetch(`https://brnskl-file.onrender.com/downloadById?fileid=${fileids[1]}`);
        let fileNameRes = await fetch(`https://brnskl-file.onrender.com/fileInfo?fileid=${fileids[1]}`)
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


function hideOverlay() {
    overlay.style.display = 'none';
}