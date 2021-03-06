
import { detectBodies, bodyPartsList } from '../../lib/bodydetection.mjs'
import { drawImageWithOverlay, drawSolidCircle, drawStar, drawSolidRect } from '../../lib/drawing.mjs'
import { continuosly } from '../../lib/system.mjs'
import { createCameraFeed, facingMode } from '../../lib/camera.mjs'
//import { clamp } from '../../lib/util.mjs'

// function poke {
//   const speedRight = body.getBodyPart3D(bodyPartsList.rightWrist).speed.absoluteSpeed.toFixed(2)
//   const speedLeft = body.getBodyPart3D(bodyPartsList.leftWrist).speed.absoluteSpeed.toFixed(2)
//   if (speedLeft > 0.5 && inOrOut > -1) {
//     xStart = 150;
//   }
// }
 
function clamp(v, min, max) {
  if (isNaN(v)) throw Error("value is NaN");
 
  // eg: clamp(101, 0, 100) returns 100, because the max is 100
  // eg: clamp(-5, 0, 100) returns 0, because the minimum is 0
  // eg: clamp(60, 0, 100) returns 60, because it's within the bounds
  if (v < min) 
    v = min;
  if (v > max)
    v = max;
  let range = max - min;

  return ((v - min) / (range));
} 

function outputNoseSpeed(status, body) {
  if (body) {
    const speedRight = body.getBodyPart3D(bodyPartsList.rightWrist).speed.absoluteSpeed.toFixed(2)
    const speedLeft = body.getBodyPart3D(bodyPartsList.leftWrist).speed.absoluteSpeed.toFixed(2)
    status.innerText = `Speed of wrists: ${speedRight} m/s , ${speedLeft} m/s`
  }
}

function drawNoseAndEyes(canvas, body) {
  if (body) {
    const rightWrist = body.getBodyPart2D(bodyPartsList.rightWrist)
    const leftWrist = body.getBodyPart2D(bodyPartsList.leftWrist)
    // const rightPinky = body.getBodyPart2D(bodyPartsList.rightPinky)
    // const leftWrist = body.getBodyPart2D(bodyPartsList.leftWrist)

    const speedRight = body.getBodyPart3D(bodyPartsList.rightWrist).speed.absoluteSpeed.toFixed(2)
    const speedLeft = body.getBodyPart3D(bodyPartsList.leftWrist).speed.absoluteSpeed.toFixed(2)
   
    // wrists
    drawSolidCircle(canvas, rightWrist.position.x, rightWrist.position.y, 10, 'red')
    drawSolidCircle(canvas, leftWrist.position.x, leftWrist.position.y, 10, 'red')

    let xStart = 320;
    let size = 70;
    let yStart = 340;
    let hue = 300;
    let sat = 100;
    let lum = 50;

    const xDiff = (rightWrist.position.x - xStart);
    const yDiff = (rightWrist.position.y - yStart);
    const distance = Math.hypot(xDiff, yDiff);

    let clampedDistance = clamp(distance, 0, 700); 

    let inOrOut = size - distance;

  // punching from the right
    if (speedRight > 1 && inOrOut > -1) {
    xStart = 480;
  }

  // touching
    if (inOrOut > -1) {
      lum = 10;
    };

    let color = `hsl(${hue}, ${sat}%, ${lum}%)`;

    drawSolidCircle(canvas, xStart, yStart, size, color);

   //${240 * distance}
    //console.log(`x: ${leftEye.position.x} y: ${leftEye.position.y}`);
    // console.log(clampedDistance);

    // if (rightWrist.position.x > 280 && rightWrist.position.x < 370 && rightWrist.position.y > 300 && rightWrist.position.y < 390 && leftWrist.position.x > 280 && leftWrist.position.x < 370 && leftWrist.position.y > 300 && leftWrist.position.y < 390) {
    //   // let color = `rgb(${255 * clampedDistance}, 0, 0)`;
    //   console.log("close")
    // };
    // console.log(inOrOut);
  }
};



async function run(canvas, status) {
  let latestBody

  // create a video element connected to the camera 
  status.innerText = 'Setting up camera feed...'
  const video = await createCameraFeed(canvas.width, canvas.height, facingMode.environment)

  const config = {
    video: video,
    multiPose: false,
    sampleRate: 100,
    flipHorizontal: false // true if webcam
  }

  status.innerText = 'Loading model...'
  // start detecting bodies camera-feed a set latestBody to first (and only) body
  detectBodies(config, (e) => latestBody = e.detail.bodies.listOfBodies[0])

  // draw video with nose and eyes overlaid onto canvas continuously and output speed of nose
  continuosly(() => {
    drawImageWithOverlay(canvas, video, () => drawNoseAndEyes(canvas, latestBody))
    outputNoseSpeed(status, latestBody)
  })
}

export { run }