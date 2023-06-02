import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

const EYE_NOT_DETECTION_DELAY = 500;

let faceLandmarker;
let webcamRunning = false;
const videoWidth = 480;

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function runDemo() {
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

	// enableCam();
}
runDemo();

const reflectionVideo1 = document.getElementById("reflection-video-1");
const reflectionVideo2 = document.getElementById("reflection-video-2");

const video = document.getElementById("webcam");
const canvasElement = document.getElementById(
  "output_canvas"
);

const canvasCtx = canvasElement.getContext("2d");

document.addEventListener("keydown", (event) => {
	if (event.code === "Space") {
    start();
	}
});

function start() {
		enableCam();
    startTyping();
}

// Enable the live webcam view and start detection.
function enableCam(event) {
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
const drawingUtils = new DrawingUtils(canvasCtx);
async function predictWebcam() {
  const radio = video.videoHeight / video.videoWidth;
  video.style.width = videoWidth + "px";
  video.style.height = videoWidth * radio + "px";
  canvasElement.style.width = videoWidth + "px";
  canvasElement.style.height = videoWidth * radio + "px";
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;
  
  let nowInMs = Date.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = faceLandmarker.detectForVideo(video, nowInMs);
		window._results = results;
  }
  if (results.faceLandmarks) {
    for (const landmarks of results.faceLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
        { color: "#FF3030" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
        { color: "#30FF30" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
        { color: "#FF3030" }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
        { color: "#30FF30" }
      );
    }
  }

  // display faceBlendshapes in document
  if (results.faceBlendshapes[0]) {
    const faceBlendshapesElement = document.getElementById(
      "faceBlendshapes"
    );
    const faceBlendshapes = results.faceBlendshapes[0].categories;
    let htmlMaker = "";
    faceBlendshapes.filter((s) => s.categoryName.startsWith("eye")).forEach((shape) => {
      htmlMaker += `
      <li class="blend-shapes-item">
        <span class="blend-shapes-label">${
          shape.displayName || shape.categoryName
        }</span>
        <span class="blend-shapes-value" style="width: calc(${
          +shape.score * 100
        }% - 120px)">${(+shape.score).toFixed(4)}</span>
      </li>
    `;
    });
    faceBlendshapesElement.innerHTML = htmlMaker;

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
  // document.body.style.backgroundColor = "#e55";
  stopTyping();
}

function _onNotDetected() {
  if (lastDetected === false) {
    return;
  }
  lastDetected = false;
  console.log("not detected");
  // document.body.style.backgroundColor = "";
  startTyping();
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

let editor;
let fileHistoryJSON;

require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.38.0/min/vs' } });

require(['vs/editor/editor.main'], async function () {
  monaco.editor.defineTheme("myCustomTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#00000000",
    }
  });
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
    language: 'javascript',
    minimap: {
      enabled: false
    },
    theme: "myCustomTheme",
  });

  window._editor = editor;

  feedEditor(editor);
});

const TYPING_INTERVAL = 100;

let isReplaying = false;
let historyIndex = 0;
let lastTypingTime = Date.now();

function typeNext() {
  historyIndex = (++historyIndex) % fileHistoryJSON.history.length;
  const history = fileHistoryJSON.history[historyIndex];
  // console.log(historyIndex, history);
  if (historyIndex === 0) {
    editor.revealLineInCenter(1);
  }

  editor.setValue(history.content);
  if (history.from_line_number) {
    // console.log("revealLineInCenter", history.from_line_number);
    editor.revealLineInCenter(history.from_line_number, monaco.editor.ScrollType.Smooth);
  }
}

function replayTyping() {
  const now = Date.now();
  if (now - lastTypingTime > TYPING_INTERVAL) {
    lastTypingTime = now;
    typeNext();
  }

  if (isReplaying) {
    requestAnimationFrame(replayTyping);
  }
}

function startTyping() {
  isReplaying = true;
  reflectionVideo1.style.display = "";
  reflectionVideo2.style.display = "none";
  reflectionVideo2.pause();
  reflectionVideo2.currentTime = 0;
  replayTyping();
}

function stopTyping() {
  isReplaying = false;
  reflectionVideo2.style.display = "";
  reflectionVideo1.style.display = "none";
  reflectionVideo2.play();
}

async function feedEditor(editor) {
  fileHistoryJSON = await fetch("./data/file-history.json").then((res) => res.json());
  editor.setValue(fileHistoryJSON.history[0].content);
}
