/**
 * Created by Jacob on 9/29/16.
 */
var player;
var ball;
var donut;
var cylinder;
var playerBox;

var animFrame = 1;
var JUMPING = false;
var PLAYING = true;
var direction = 1;
var jumpLength = 1.5;
var increment = 5;
var totalDistance = jumpLength / increment;

function scriptOnLoad(currentScene){
    player = currentScene.getObjectByName("Player");
    ball = currentScene.getObjectByName("ball");
    donut = currentScene.getObjectByName("donut");
    cylinder = currentScene.getObjectByName("roller1");

    copyGeometry(ball, 6);
    copyGeometry(donut, 6);
    copyGeometry(cylinder, 6);
}

function copyGeometry(geometry, copies){
    var temp;
    for(var i=1; i<=copies; i++){
        temp = geometry.clone();
        temp.position.x += 4 * i;
        currentScene.add(temp);
    }
}
function keyUpEvent(keyVal) {
    if(!JUMPING) {
        if (keyVal == 38) {
            JUMPING = true;
            direction = -1;
        } else if (keyVal == 40) {
            JUMPING = true;
            direction = 1;
        }
    }
}

function jumpScript(sceneNode){
    if(PLAYING) {
        if(player != null) {
            playerBox = new THREE.Box3().setFromObject(player);
            playerBox.expandByScalar(-0.25);
            for (var i = 0; i < currentScene.children.length; i++) {
                if (
                    currentScene.children[i].name == "roller1" ||
                    currentScene.children[i].name == "donut" ||
                    currentScene.children[i].name == "ball") {
                    var temp = new THREE.Box3().setFromObject(currentScene.children[i]);
                    if (!isNaN(temp.max.x) && playerBox.intersectsBox(temp)) {
                        PLAYING = false;
                    }
                }
            }
        }
        if (JUMPING && animFrame <= increment) {
            var rads = (animFrame / increment) * Math.PI;
            sceneNode.position.y = Math.sin(rads) + 0.5;
            sceneNode.position.z += (direction * totalDistance);
            //alert(player.position.z);
            animFrame++;
            // var mat = new THREE.Matrix4();
            // mat.set(
            //     0, 0, 0, 0,
            //     0, 0.5, 0, 0,
            //     0, 0, 0, 0,
            //     0, 0, 0, 1
            // );
            // player.matrix.applyMatrix(mat);
        } else {
            animFrame = 1;
            JUMPING = false;
        }
    }
}

function rollScript(sceneNode){
    if(PLAYING) {
        if (sceneNode.position.x > 14) {
            sceneNode.position.x = -14
        } else if (sceneNode.position.x < -14) {
            sceneNode.position.x = 14
        }
        var distance = sceneNode.userData.speed;//0.2;
        var angle = (distance / sceneNode.geometry.parameters.radius * 4 * Math.PI);
        sceneNode.position.x += distance;
        //sceneNode.rotation.z += degree2rad(-angle);
    }
}
function degree2rad(degree){
    return degree*(Math.PI/180);
}