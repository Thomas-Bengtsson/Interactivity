import { detectBodies, bodyPartsList } from '../../lib/bodydetection.mjs'
import { drawImageWithOverlay, drawSolidCircle, drawStar } from '../../lib/drawing.mjs'
import { continuosly } from '../../lib/system.mjs'
import { createCameraFeed, facingMode } from '../../lib/camera.mjs'

function outputNoseSpeed(status, body) {
if (body) {
const speedright = body.getBodyPart3D(bodyPartsList.rightWrist).speed.absoluteSpeed.toFixed(2)
const speedleft = body.getBodyPart3D(bodyPartsList.leftWrist).speed.absoluteSpeed.toFixed(2)
status.innerText = `Speed of right wrist: ${speedright} m/s,Speed of left wrist: ${speedleft} m/s`
}
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(30, 139, 195, 0.5)";
ctx.fillRect(0,0, canvas.width, canvas.height);

function drawNoseAndEyes(canvas, body) {

if (body) {
const rightWrist = body.getBodyPart2D(bodyPartsList.rightWrist)
const leftWrist = body.getBodyPart2D(bodyPartsList.leftWrist)
//const leftEye = body.getBodyPart2D(bodyPartsList.leftEye)
//const rightEye = body.getBodyPart2D(bodyPartsList.rightEye)

// nose
let a = Math.random()*1400
let b = Math.random()*800
//drawSolidCircle(canvas, a,b , 150, "rgba(30, 139, 195, 1)")*/


//console.log(leftWrist.position.x, leftWrist.position.y)
const speed = body.getBodyPart3D(bodyPartsList.leftWrist).speed.absoluteSpeed.toFixed(2)
console.log(speed);
//if ((speed > 0.5) && (speed< 2)) {
drawSolidCircle(canvas, rightWrist.position.x, rightWrist.position.y, 20, "white")
drawSolidCircle(canvas, leftWrist.position.x, leftWrist.position.y, 15, "red")

//drawSolidCircle(canvas, leftWrist.position.x, leftWrist.position.y, 70,"rgba(26, 82, 118, 1)" )
//drawSolidCircle(canvas, leftWrist.position.x, leftWrist.position.y, 150, "rgba(137, 196, 244, 1)")


//context.clearRect(0, 0, canvas.width, canvas.height)

}

// left and right eye
//drawStar(canvas, leftEye.position.x, leftEye.position.y, 5, 5, 13, 'yellow')
//drawStar(canvas, rightEye.position.x, rightEye.position.y, 5, 5, 13, 'yellow')

}

async function run(canvas, status) {
let latestBody

// create a video element connected to the camera
status.innerText = 'Setting up camera feed...'
const video = await createCameraFeed(canvas.width, canvas.height, facingMode.user)

const config = {
video: video,
multiPose: false,
sampleRate: 50,
flipHorizontal: false // true if webcam
}

status.innerText = 'Loading model...'
// start detecting bodies camera-feed a set latestBody to first (and only) body
detectBodies(config, (e) => latestBody = e.detail.bodies.listOfBodies[0])

// draw video with nose and eyes overlaid onto canvas continuously and output speed of nose
continuosly(() => {
// drawImageWithOverlay(canvas, video, () => drawNoseAndEyes(canvas, latestBody))
outputNoseSpeed(status, latestBody)
drawNoseAndEyes(canvas, latestBody)
})
}

export { run }