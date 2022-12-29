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

async function upload_file(event) {
  dragText.textContent = "Drag & drop a picture";
  target2.classList.remove("active");
  testIcon.trigger = "empty";

  event.preventDefault();

  file = event.dataTransfer.files[0];

  // Damit funktioniert der Butten aber Drag & Drop mag das so leider nicht :/
  //file = event.target.files[0];

  let fileType = file.type;

  let validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

  let loadIcon = `<script src="https://cdn.lordicon.com/fudrjiwc.js"></script>
    <lord-icon
        src="https://cdn.lordicon.com/dpinvufc.json"
        trigger="loop"
        style="width:250px;height:250px;margin-top:80px;color="#53c1ec";>
    </lord-icon><p>Classification in progress ...</p>`;

  target2.innerHTML = loadIcon;

  display_output(await get_prediction(file));
}

async function get_prediction(file) {
  var formdata = new FormData();
  formdata.append("image", file, file.name);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  const prediction = await fetch("http://localhost:5001/predict", requestOptions)
    .then(response => response.json())
    .then(data => { return data })
    .catch(error => console.log('error', error));

  return prediction['predictions']
}

function display_output(prediction) {
  var output = document.getElementById('create_output');
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

//inputButton.addEventListener("click", upload_file_button);
// class Test extends React.Component {
//     upload_file_button(event) {

//         let reader = new FileReader()

//         //let myFile = document.getElementById("input").files;

//         console.log(event.target.files[0]);

//         reader.readAsDataURL(event.target.files[0])

//         reader.onload = () => {
//             //console.log("Results are:" + reader.result);
//             this.setState({
//                 queryImage: reader.result
//             })
//         }

//         // setImagePath = e => {
//         //     reader.readAsDataURL(e.target.files[0])

//         //     console.log(reader.result);

//         //     reader.onload = () => {
//         //         this.setState({
//         //             queryImage: reader.result
//         //         })
//         //     }
//         // }

//         // postImage = () => {
//         //     fetch("https://theplantaeapi.herokuapp.com/api/v1/id", {
//         //         method: "POST",
//         //         headers: { 'Content-Type': 'application/json' },
//         //         body: JSON.stringify(this.state.queryImage)
//         //     })
//         //         .then(res => res.json())
//         //         .then(data => {
//         //             //test
//         //         })
//         // }
//     }
// }

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



// function file_explorer() {
//   inputButton.click();
// }
