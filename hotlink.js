
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
        const response = await fetch(`https://brnskl-file.onrender.com/downloadById?fileid=${fileids[1]}`);
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


function hideOverlay() {
    overlay.style.display = 'none';
}