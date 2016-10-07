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
    var grassMap = currentScene.getObjectByName("ground").material.map;
    grassMap.wrapS = THREE.RepeatWrapping;
    grassMap.wrapT = THREE.RepeatWrapping;
    grassMap.repeat.x = 5;
    grassMap.repeat.y = 3;

    var roadMap1 = currentScene.getObjectByName("road1").material.map;
    roadMap1.wrapS = THREE.RepeatWrapping;
    roadMap1.wrapT = THREE.RepeatWrapping;
    roadMap1.repeat.x = 10;

    var roadMap2 = currentScene.getObjectByName("road2").material.map;
    roadMap2.wrapS = THREE.RepeatWrapping;
    roadMap2.wrapT = THREE.RepeatWrapping;
    roadMap2.repeat.x = 10;

    var roadMap3 = currentScene.getObjectByName("road3").material.map;
    roadMap3.wrapS = THREE.RepeatWrapping;
    roadMap3.wrapT = THREE.RepeatWrapping;
    roadMap3.repeat.x = 10;

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
             var mat = new THREE.Matrix4();
             mat.set(
                1, 0, 0, 0,
                0, 1.5, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            //player.matrix.applyMatrix(mat);
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
        var distance = sceneNode.userData.speed;
        var radius;
        var axis = "z";
        switch (sceneNode.name){
            case "roller1":
                radius = sceneNode.geometry.parameters.radiusTop;
                axis = "y";
                break;
            case "donut":
                radius = sceneNode.geometry.parameters.radius + sceneNode.geometry.parameters.tube;
                break;
            case "ball":
                radius = sceneNode.geometry.parameters.radius;
                break;
        }
        var angle = 200 * distance / (radius * 2 * Math.PI);
        sceneNode.position.x += distance;
        if(axis == "z"){
            sceneNode.rotation.z += degree2rad(-angle);
        }else{
            sceneNode.rotation.y += degree2rad(angle);
        }

    }
}
function degree2rad(degree){
    return degree*(Math.PI/180);
}