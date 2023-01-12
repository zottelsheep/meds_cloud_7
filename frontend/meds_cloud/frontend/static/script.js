const dragDropZone = document.getElementById("drop_click_zone");
const containerTarget = document.getElementById("target_container");
const dragText = document.getElementById("drag_header");
const testIcon = document.getElementById("some_test");
const inputButton = document.getElementById("input");
const output = document.getElementById('create_output');

function drag_over() {
  dragText.textContent = "Release to upload";
  dragDropZone.classList.add("active");
  containerTarget.classList.add("active");
  testIcon.trigger = "loop";
}

function drag_leave() {
  dragText.textContent = "Drag & drop a picture";
  dragDropZone.classList.remove("active");
  containerTarget.classList.remove("active");
  testIcon.trigger = "empty";
}

function place_loading_icon() {
  let loadIcon = `<script src="https://cdn.lordicon.com/fudrjiwc.js"></script>
    <lord-icon
        src="https://cdn.lordicon.com/dpinvufc.json"
        trigger="loop"
        style="width:250px;height:250px;margin-top:80px;color="#53c1ec";>
    </lord-icon><p style="padding-bottom:20px;margin-top: 50px;">Classification in progress ...</p>`;

  dragDropZone.innerHTML = loadIcon;
}

async function upload_file(event) {
  dragText.textContent = "Drag & drop a picture";
  dragDropZone.classList.remove("active");
  testIcon.trigger = "empty";

  event.preventDefault();

  file = event.dataTransfer.files[0];

  let fileType = file.type;

  let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

  place_loading_icon();

  setTimeout(async () => {
    displayImages(validExtensions, fileType);
    display_output(await get_prediction(file));
  }, 3000)
}

async function upload_file_button(event) {
  dragText.textContent = "Drag & drop a picture";
  dragDropZone.classList.remove("active");
  testIcon.trigger = "empty";

  event.preventDefault();

  file = event.target.files[0];

  let fileType = file.type;

  let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

  place_loading_icon();

  setTimeout(async () => {
    displayImages(validExtensions, fileType);
    display_output(await get_prediction(file));
  }, 3000)
}

async function get_prediction(file) {
  var formdata = new FormData();
  formdata.append("image", file, file.name);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  const prediction = await fetch("./api/predict", requestOptions)
    .then(response => response.json())
    .then(data => { return data })
    .catch(error => console.log('error', error));

  return prediction['predictions']
}

function display_output(prediction) {
  const outputString = JSON.stringify(prediction);

  let outPutHTML = `
    <div id='output' class="output_zone">
      <div class="output_content_container">
        <div id="labels_output"></div>
        <div id="probability_output"></div>
      </div>
    </div>
  `
  output.innerHTML = outPutHTML;

  var regex1 = /label/g;
  var regex2 = /probability/g;

  const labels = [];
  const probabilities = [];

  while ((match = regex1.exec(outputString)) != null) {
    var firstChar = outputString.substring(match.index + 8);
    var str = firstChar.substring(0, firstChar.indexOf('"'));
    labels.push(str);
  }

  while ((match = regex2.exec(outputString)) != null) {
    var firstChar = outputString.substring(match.index + 13);
    var str = firstChar.substring(0, firstChar.indexOf('}'));
    probabilities.push(str);
  }

  let list = document.getElementById("labels_output");
  let list2 = document.getElementById("probability_output");
  const underline = /_/g;
  const subStr = ` `;

  labels.forEach((item) => {
    let labelList = document.createElement("div");
    labelList.innerText = item.replace(underline, subStr) + ': ';
    list.appendChild(labelList);
  })

  probabilities.forEach((item) => {
    let labelList = document.createElement("div");
    labelList.innerText = (item * 100).toFixed(1) + " %";
    list2.appendChild(labelList);
  })
}

function displayImages(validExtensions, fileType) {
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();

    fileReader.onload = () => {
      let fileURL = fileReader.result;
      let imgTag = `<div id="output_image" class="image"><img src="${fileURL}" alt="image"></div>`;
      dragDropZone.innerHTML = imgTag;
    }

    fileReader.readAsDataURL(file);
  }
  else {
    alert('The uploaded file is not an image!')
    dragDropZone.classList.remove("active");
  }
}

function file_explorer() {
  inputButton.click();
