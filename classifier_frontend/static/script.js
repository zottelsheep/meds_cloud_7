const target = document.getElementById("drop_target");
const dragText = document.getElementById("drag_header");
const testIcon = document.getElementById("some_test");

function drag_over() {
    dragText.textContent = "Release to upload";
    target.classList.add("active");
    testIcon.trigger = "loop";
}

function drag_leave() {
    dragText.textContent = "Drag & drop a picture";
    target.classList.remove("active");
    testIcon.trigger = "empty"
}

