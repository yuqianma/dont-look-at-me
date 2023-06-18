import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
const { FaceLandmarker, FilesetResolver } = vision;

const EYE_NOT_DETECTION_DELAY = 500;

// quick and dirty
export const handler = {
	onDetected: () => {},
	onNotDetected: () => {},
};

let faceLandmarker;
let webcamRunning = false;
const videoWidth = 480;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function loadFaceLandmarkModel() {
  // Read more `CopyWebpackPlugin`, copy wasm set from "https://cdn.skypack.dev/node_modules" to `/wasm`
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU"
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1
  });
}

const video = document.getElementById("webcam");

// Enable the live webcam view and start detection.
function enableCam() {
  if (!faceLandmarker) {
    console.log("Wait! faceLandmarker not loaded yet.");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
  } else {
    webcamRunning = true;
  }

  // getUsermedia parameters.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;
async function predictWebcam() {
  const radio = video.videoHeight / video.videoWidth;
  video.style.width = videoWidth + "px";
  video.style.height = videoWidth * radio + "px";
  
  let nowInMs = Date.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = faceLandmarker.detectForVideo(video, nowInMs);
		window._results = results;
  }

  // display faceBlendshapes in document
  if (results.faceBlendshapes[0]) {
    const faceBlendshapes = results.faceBlendshapes[0].categories;

    const detected = faceBlendshapes.filter((s) => s.categoryName.startsWith("eyeLook")).every((shape) => shape.score < 0.6);
    if (detected) {
      onDetected();
    } else {
      onNotDetected();
    }
  } else {
    // console.log("no faceBlendshapes");
    onNotDetected();
  }

  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
}

let lastDetected = false;
let eyeDetectionTimeoutId = undefined;

function onDetected() {
  if (eyeDetectionTimeoutId) {
    clearTimeout(eyeDetectionTimeoutId);
    eyeDetectionTimeoutId = undefined;
  }
  if (lastDetected === true) {
    return;
  }
  lastDetected = true;
  console.log("detected");
	handler.onDetected();
}

function _onNotDetected() {
  if (lastDetected === false) {
    return;
  }
  lastDetected = false;
  console.log("not detected");
	handler.onNotDetected();
}

function onNotDetected() {
  if (eyeDetectionTimeoutId) {
    // countdown is running
    return;
  }
  eyeDetectionTimeoutId = setTimeout(() => {
    eyeDetectionTimeoutId = undefined;
    _onNotDetected();
  }, EYE_NOT_DETECTION_DELAY);
}

function start() {
  enableCam();
}

async function main() {
	await loadFaceLandmarkModel();

  start();
}

main();
