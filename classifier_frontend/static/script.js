const target2 = document.getElementById("drop_target");
const containerTarget = document.getElementById("target_container");
const dragText = document.getElementById("drag_header");
const testIcon = document.getElementById("some_test");
const inputButton = document.getElementById("input");

function drag_over() {
    dragText.textContent = "Release to upload";
    target2.classList.add("active");
    containerTarget.classList.add("active");
    testIcon.trigger = "loop";
}

function drag_leave() {
    dragText.textContent = "Drag & drop a picture";
    target2.classList.remove("active");
    containerTarget.classList.remove("active");
    testIcon.trigger = "empty";
}

function upload_file(event) {
    dragText.textContent = "Drag & drop a picture";
    target2.classList.remove("active");
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

    target2.innerHTML = loadIcon;
}

//inputButton.addEventListener("click", upload_file_button);

function upload_file_button(event) {

    console.log("Funktioniert!");

    let reader = new FileReader()

    let myFile = document.getElementById("input").files;

    console.log(event.target.files[0]);

    reader.readAsDataURL(event.target.files[0])
    reader.onload = () => {
        this.setState({
            queryImage: reader.result
        })
    }

    // setImagePath = e => {
    //     reader.readAsDataURL(e.target.files[0])

    //     console.log(reader.result);

    //     reader.onload = () => {
    //         this.setState({
    //             queryImage: reader.result
    //         })
    //     }
    // }

    // postImage = () => {
    //     fetch("https://theplantaeapi.herokuapp.com/api/v1/id", {
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(this.state.queryImage)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             //test
    //         })
    // }
}

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



function file_explorer() {
    inputButton.click();
}