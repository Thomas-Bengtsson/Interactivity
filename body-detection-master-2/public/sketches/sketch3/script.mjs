
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

function outputWristSpeed(status, body) {
  if (body) {
    const speedRight = body.getBodyPart3D(bodyPartsList.rightWrist).speed.absoluteSpeed.toFixed(2)
    const speedLeft = body.getBodyPart3D(bodyPartsList.leftWrist).speed.absoluteSpeed.toFixed(2)
    status.innerText = `Speed of wrists: right: ${speedRight} m/s , left: ${speedLeft} m/s`
  }
}

function drawWrists(canvas, body) {
  if (body) {
    const rightWrist = body.getBodyPart2D(bodyPartsList.rightWrist)
    const leftWrist = body.getBodyPart2D(bodyPartsList.leftWrist)

    // wrists
    drawSolidCircle(canvas, rightWrist.position.x, rightWrist.position.y, 10, 'red')
    drawSolidCircle(canvas, leftWrist.position.x, leftWrist.position.y, 10, 'red')

    let xStart = 320;
    let size = 70;
    let yStart = 240;
    let hue = 300;
    let sat = 100;
    let lum = 50;
    let color = `hsl(${hue}, ${sat}%, ${lum}%)`;

    const xDiffRight = (rightWrist.position.x - xStart);
    const yDiffRight = (rightWrist.position.y - yStart);
    const distanceR = Math.hypot(xDiffRight, yDiffRight);

    const xDiffLeft = (leftWrist.position.x - xStart);
    const yDiffLeft = (leftWrist.position.y - yStart);
    const distanceL = Math.hypot(xDiffLeft, yDiffLeft);

    let clampedDistanceR = clamp(distanceR, 0, 700);
    let clampedDistanceL = clamp(distanceL, 0, 700); 

    let inOrOutR = size - distanceR;
    let inOrOutL = size - distanceL;

    const speedRight = body.getBodyPart3D(bodyPartsList.rightWrist).speed.absoluteSpeed.toFixed(2)
    const speedLeft = body.getBodyPart3D(bodyPartsList.leftWrist).speed.absoluteSpeed.toFixed(2)

  // punching from the right
    if (speedRight > 1 && inOrOutR > -1) {
    xStart = 600;
  }

  // punching from the left
    if (speedLeft > 1 && inOrOutL > -1) {
    xStart = 40;
  }

  // touching
    if (inOrOutR > -1) {
      lum = 10;
    } else if (inOrOutL > -1) {
      lum = 10;
    }

  // changing color
  if (distanceL < 300) {
    color = `hsl(${hue}, ${100 * clampedDistanceL}%, ${lum}%)`
  } else if (distanceR < 300) {
    color = `hsl(${hue}, ${sat}%, ${100 * clampedDistanceR}%)`
  }

  

    drawSolidCircle(canvas, xStart, yStart, size, color);

   //${240 * distance}
  console.log(distanceL);
  console.log(clampedDistanceL)
    
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
    drawImageWithOverlay(canvas, video, () => drawWrists(canvas, latestBody))
    outputWristSpeed(status, latestBody)
  })
}

export { run }