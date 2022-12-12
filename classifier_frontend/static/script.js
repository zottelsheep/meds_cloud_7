const target = document.getElementById("drop_target");
const containerTarget = document.getElementById("target_container");
const dragText = document.getElementById("drag_header");
const testIcon = document.getElementById("some_test");
const inputButton = document.getElementById("input");

function drag_over() {
    dragText.textContent = "Release to upload";
    target.classList.add("active");
    containerTarget.classList.add("active");
    testIcon.trigger = "loop";
}

function drag_leave() {
    dragText.textContent = "Drag & drop a picture";
    target.classList.remove("active");
    containerTarget.classList.remove("active");
    testIcon.trigger = "empty";
}

function upload_file(event) {
    dragText.textContent = "Drag & drop a picture";
    target.classList.remove("active");
    testIcon.trigger = "empty";

    file = event.dataTransfer.files[0];

    let fileType = file.type;

    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

    let loadIcon = `<script src="https://cdn.lordicon.com/fudrjiwc.js"></script>
    <lord-icon
        src="https://cdn.lordicon.com/dpinvufc.json"
        trigger="loop"
        style="width:250px;height:250px;margin-top:80px;color="#53c1ec";>
    </lord-icon><p>Classification in progress ...</p>`;

    target.innerHTML = loadIcon;

    // if (validExtensions.includes(fileType)) {
    //     let fileReader = new FileReader();

    //     fileReader.onload = () => {
    //         let fileURL = fileReader.result;
    //         let imgTag = `<img src="${fileURL}" alt="">`;
    //         target.innerHTML = imgTag;
    //         //containerTarget.innerHTML = imgTag;
    //     }

    //     fileReader.readAsDataURL(file);
    // } else {
    //     alert('The uploaded file is not an image!')
    //     target.classList.remove("active");
    // }
}

function file_explorer() {
    inputButton.click();
}