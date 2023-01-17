class app {
  constructor(
    api_endpoint = "./api/predict",
    validExtensions = ['image/jpeg', 'image/jpg', 'image/png'],
    time_to_wait_before_request = 0
  ) {
    // Configs
    this.api_endpoint = api_endpoint;
    this.validExtensions = validExtensions;
    this.time_to_wait_before_request = time_to_wait_before_request
    this.last_image = null;

    // Targets
    this.dragDropZone = document.getElementById("drop_target");
    this.containerTarget = document.getElementById("target_container");
    this.dragText = document.getElementById("drag_header");
    this.inputButton = document.getElementById("input");
    this.output = document.getElementById('output_container');
    this.createButtonZone = document.getElementById("create_button");
    this.requestButton = document.getElementById('request_button');

    this.requestButton.classList.add("active");
  }

  async get_prediction(file) {
    var formdata = new FormData();
    formdata.append("image", file, file.name);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    const prediction = await fetch(api_endpoint, requestOptions)
      .then(response => response.json())
      .then(data => { return data })
      .catch(error => {
        console.log('Prediction-Error:', error);
        return null
      });

    if (prediction) {
      return prediction['predictions']
    }
    else {
      return null
    }
  }

  drag_over() {
    this.dragText.textContent = "Release to upload";
    this.dragDropZone.classList.add("active");
    this.containerTarget.classList.add("active");
  }

  drag_leave() {
    this.dragText.textContent = "Drag & drop a picture";
    this.dragDropZone.classList.remove("active");
    this.containerTarget.classList.remove("active");
  }

  place_loading_icon_output() {
    let loadIcon = ` <lord-icon
                        src="https://cdn.lordicon.com/dpinvufc.json"
                        trigger="loop"
                        style="margin-top: 35%; width:150px;height:150px;">
                    </lord-icon>`;

    this.output.innerHTML = loadIcon;
  }

  display_output(prediction) {

    // Remove all output nodes
    this.output.innerText = ''

    var table = document.createElement('table')
    table = this.output.appendChild(table)

    var lables = document.createElement('td')
    lables = table.appendChild(lables)
    lables.classList.add('label_output')

    var probabilities = document.createElement('td')
    probabilities = table.appendChild(probabilities)
    probabilities.classList.add('probability_output')

    if (!prediction){
      let error = document.createElement('tr')
      error.innerText = 'Could not get prediction. Please try again later'
      lables.appendChild(error)
      return
    }
    prediction.forEach(element => {
      let label = document.createElement('tr')
      label.textContent = element.label.replace("_"," ") + ': ';
      lables.appendChild(label)

      let probability = document.createElement('tr')
      probability.textContent = (element.probability * 100).toFixed(1) + " %";
      probabilities.appendChild(probability)
    });


  }

  displayImage(file) {
    let fileReader = new FileReader();

    fileReader.onload = () => {
      let fileURL = fileReader.result;
      let imgTag = `<div id="output_image" class="image"><img src="${fileURL}" alt="uploaded_image"></div>`;
      this.dragDropZone.innerHTML = imgTag;
    }

    fileReader.readAsDataURL(file);
  }

  file_explorer() {
    // Create an input element
    var inputElement = document.createElement("input");

    // Set its type to file
    inputElement.type = "file";

    // Set accept to the file types you want the user to select. 
    // Include both the file extension and the mime type
    inputElement.accept = this.validExtensions;

    // set onchange event to call callback when user has selected file
    // callback execution context needs to be bound to object
    inputElement.addEventListener("change", this.upload_file.bind(this))
    
    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click")); 

    // Remove node
    inputElement.remove()

  }

  async make_prediction(file) {

    this.last_image = file

    this.place_loading_icon_output();

    this.displayImage(file);

    setTimeout(async () => {
      this.display_output(await this.get_prediction(file));
    }, this.time_to_wait_before_request)

    this.requestButton.classList.remove("active");
  }

  async upload_file(event) {
    this.dragDropZone.classList.remove("active");

    event.preventDefault();

    var image = null

    if (event.type == "drop"){
      image = event.dataTransfer.files[0];
    }
    else {
      image = event.target.files[0];
    }

    if (!this.validExtensions.includes(image.type)) {
      alert('The uploaded file is not an image!')
      return
    }

    this.make_prediction(image)

  }

  async resend_request_button() {
    if (!this.last_image) {
      alert('No available request to reload. Make sure you have inserted an image first!');
      return
    }
    this.make_prediction(this.last_image)
  }

}


