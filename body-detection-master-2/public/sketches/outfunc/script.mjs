
import { detectBodies, bodyPartsList } from '../../lib/bodydetection.mjs'
import { drawImageWithOverlay, drawSolidCircle, drawCircle, drawStar, drawSolidRect } from '../../lib/drawing.mjs'
import { continuosly } from '../../lib/system.mjs'
import { createCameraFeed, facingMode } from '../../lib/camera.mjs'
//import { clamp } from '../../lib/util.mjs'

    let xStart = 320;
    let size = 60;
    let yStart = 240;
    let move = 20;
    let opacity = 0.5

    let hue = 300;
    let sat = 100;
    let lum = 50;
    let color = `hsl(${hue}, ${sat}%, ${lum}%)`;
 
    let xC = Math.random() * 640
    let yC = Math.random() * 480
    let radiusC = Math.random() * 200

    
    
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
    status.innerText = `Speed of fingers: right: ${speedRight} m/s , left: ${speedLeft} m/s`
  }
}

function drawParts(canvas, body) {
  if (body) {
 
    const nose = body.getBodyPart2D(bodyPartsList.nose)
    const rightIndex = body.getBodyPart2D(bodyPartsList.rightIndex)
    const leftIndex = body.getBodyPart2D(bodyPartsList.leftIndex)
    const rightKnee = body.getBodyPart2D(bodyPartsList.rightKnee)
    const leftKnee = body.getBodyPart2D(bodyPartsList.leftKnee)  

    const xDiffRight = (rightIndex.position.x - xStart);
    const yDiffRight = (rightIndex.position.y - yStart);
    const distanceR = Math.hypot(xDiffRight, yDiffRight);
    let clampedDistanceR = clamp(distanceR, 0, 700);
    let inOrOutR = size - distanceR;

    const xDiffLeft = (leftIndex.position.x - xStart);
    const yDiffLeft = (leftIndex.position.y - yStart);
    const distanceL = Math.hypot(xDiffLeft, yDiffLeft);
    let clampedDistanceL = clamp(distanceL, 0, 700); 
    let inOrOutL = size - distanceL;

    const xDiffNose = (nose.position.x - xStart);
    const yDiffNose = (nose.position.y - yStart);
    const distanceN = Math.hypot(xDiffNose, yDiffNose);
    let clampedDistanceN = clamp(distanceN, 0, 700); 
    let inOrOutN = size - distanceN;

    const xDiffRK = (rightKnee.position.x - xStart);
    const yDiffRK = (rightKnee.position.y - yStart);
    const distanceRK = Math.hypot(xDiffRK, yDiffRK);
    let clampedDistanceRK = clamp(distanceRK, 0, 700);
    let inOrOutRK = size - distanceRK;

    const xDiffLK = (leftKnee.position.x - xStart);
    const yDiffLK = (leftKnee.position.y - yStart);
    const distanceLK = Math.hypot(xDiffLK, yDiffLK);
    let clampedDistanceLK = clamp(distanceLK, 0, 700); 
    let inOrOutLK = size - distanceLK;

    const speedRight = body.getBodyPart3D(bodyPartsList.rightIndex).speed.absoluteSpeed.toFixed(2)
    const speedLeft = body.getBodyPart3D(bodyPartsList.leftIndex).speed.absoluteSpeed.toFixed(2)
    const speedNose = body.getBodyPart3D(bodyPartsList.nose).speed.absoluteSpeed.toFixed(2)
    const speedRK = body.getBodyPart3D(bodyPartsList.rightKnee).speed.absoluteSpeed.toFixed(2)
    const speedLK = body.getBodyPart3D(bodyPartsList.leftKnee).speed.absoluteSpeed.toFixed(2)

  


    // // draw a button
    // let rectX = 30;
    // let rectY = 30;
    // let rectSize = 50;
    // let rectColor = 'yellow';
    // drawSolidRect(canvas, rectX, rectY, rectSize, rectColor, 0.5);
     
    // if (rightIndex.position.x > 30 && rightIndex.position.x < 80 && rightIndex.position.y > 30 && rightIndex.position.y < 80) {
    //   hue = 60;
    //   console.log('click')
    // }
  


// console.log('R' + inOrOutR)
// console.log('L' + inOrOutL)

  
  // punching from the right
    if (speedRight > 0.6 && inOrOutR > -1) {
    xStart += move;
   // move = clamp((speedRight * 10), 0, 640);
    }

  // punching from the left
    if (speedLeft > 0.6 && inOrOutL > -1) {
    xStart -= move;
  }

  // nose punching from the top
  if (speedNose > 0.5 && inOrOutN > -1) {
    yStart += move;
  }

  // moving from the top
  // if (speedRight > 0.5 && inOrOutR > -1 && (rightIndex.position.y ))

    // kicking with right knee
    if (inOrOutRK > -1) {
      yStart -= move;
    }

    // kicking with left knee
    if (inOrOutLK > -1) {
      yStart -= move;
    }

    // // touching
    // hue = 60;
    // if (inOrOutR > -10) {
    //   hue = Math.random()*360;
    // } else if (inOrOutL > -10) {
    //   hue = Math.random()*360;
    // } 

    // change size
    const xDistHands = rightIndex.position.x - leftIndex.position.x
    const yDistHands = rightIndex.position.y - leftIndex.position.y
    let distHands = Math.hypot(xDistHands, yDistHands);
    let clampedDistHands = clamp(distHands, 0, 700);

    // console.log(clampedDistHands)
    if (inOrOutL > 1 && inOrOutR > 1) {
      size = clampedDistHands * 500
    }

    if (size <= 50) {
      size = 50;
    } else if (size >= 200) {
      size = 200;
    }
    
// console.log(size)
    
  // changing color
  // if (distanceL < 300 && distanceL > 61) {
  //   color = `hsl(${hue}, ${100 * clampedDistanceL}%, ${lum}%)`
  // } 
  
  // else if (distanceR < 300 && distanceR > 61) {
  //   color = `hsl(${hue}, ${sat}%, ${100 * clampedDistanceR}%)`
  // }
      
  // drawSolidCircle(canvas, xC, yC, radiusC, 'white', 0.5)

  drawCircle(canvas, xC, yC, radiusC);

  // draw a ball
  drawSolidCircle(canvas, xStart, yStart, size, color, opacity);

 
  

  // drawSolidCircle(canvas, nose.position.x, nose.position.y, 10, 'white')
  // drawSolidCircle(canvas, rightIndex.position.x, rightIndex.position.y, 10, 'white')
  // drawSolidCircle(canvas, leftIndex.position.x, leftIndex.position.y, 10, 'white')
  // drawSolidCircle(canvas, rightKnee.position.x, rightKnee.position.y, 10, 'white')
  // drawSolidCircle(canvas, leftKnee.position.x, leftKnee.position.y, 10, 'white')
  
  // setInterval(drawSolidCircle, 10)

   //${240 * distance}
  // console.log("R:" + inOrOutR);
  // console.log("L:" + inOrOutL);
  // console.log(clampedDistanceL);
 
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
    drawImageWithOverlay(canvas, video, () => 
    drawParts(canvas, latestBody))
    outputWristSpeed(status, latestBody)

  })
}
    
export { run }