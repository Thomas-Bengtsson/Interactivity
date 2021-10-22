
import { detectBodies, bodyPartsList } from '../../lib/bodydetection.mjs'
import { drawImageWithOverlay, drawSolidCircle, drawStar, drawSolidRect } from '../../lib/drawing.mjs'
import { continuosly } from '../../lib/system.mjs'
import { createCameraFeed, facingMode } from '../../lib/camera.mjs'
//import { clamp } from '../../lib/util.mjs'
 
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
    const speedRight = body.getBodyPart3D(bodyPartsList.rightPinky).speed.absoluteSpeed.toFixed(2)
    const speedLeft = body.getBodyPart3D(bodyPartsList.leftPinky).speed.absoluteSpeed.toFixed(2)
    status.innerText = `Speed of nose: ${speedRight} m/s , ${speedLeft} m/s`
  }
}

function clamp2 (v, min, max) {
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

function drawNoseAndEyes(canvas, body) {
  if (body) {
    const rightPinky = body.getBodyPart2D(bodyPartsList.rightPinky)
    const leftPinky = body.getBodyPart2D(bodyPartsList.leftPinky)
    //const leftEye = body.getBodyPart2D(bodyPartsList.leftEye)
    //const rightEye = body.getBodyPart2D(bodyPartsList.rightEye)

    // nose
    drawSolidCircle(canvas, rightPinky.position.x, rightPinky.position.y, 10, 'red')
    drawSolidCircle(canvas, leftPinky.position.x, leftPinky.position.y, 10, 'red')

   let xStart = 40;
   let size = 30;
   let yStart = 50;
    // left and right eye

    const xDiff = (rightPinky.position.x - xStart);
    const yDiff = (rightPinky.position.y - yStart);
    const distance = Math.hypot(xDiff, yDiff);
    let clampedDistance = clamp2(distance, 0, 700); 
 
    let color = `rgb(${255 * clampedDistance}, 0, 0)`
    drawSolidRect(canvas, xStart, yStart, size, color)
    

  
    
   //${240 * distance}
    //console.log(`x: ${leftEye.position.x} y: ${leftEye.position.y}`);
    console.log(clampedDistance);
  }
}

async function run(canvas, status) {
  let latestBody

  // create a video element connected to the camera 
  status.innerText = 'Setting up camera feed...'
  const video = await createCameraFeed(canvas.width, canvas.height, facingMode.environment)

  const config = {
    video: video,
    multiPose: false,
    sampleRate: 100,
    flipHorizontal: true // true if webcam
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