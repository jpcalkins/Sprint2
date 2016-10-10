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
var STRAFFING = false;
var direction = 1;
var jumpLength = 1.5;
var increment = 5;
var totalDistance = jumpLength / increment;

var lives = 3;
var READOUT = document.createElement('div');

var lifeDiv = document.createElement("h1");
lifeDiv.style['float'] = 'right';

var infoDiv = document.createElement("h1");
infoDiv.style['float'] = 'left';

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

    var roadMap;
    for(var i=1; i <= 3; i++){
        roadMap = currentScene.getObjectByName("road" + i).material.map;
        roadMap.wrapS = THREE.RepeatWrapping;
        roadMap.wrapT = THREE.RepeatWrapping;
        roadMap.repeat.x = 10;
    }

    // Create overlay as div element and set its style
//
    READOUT.style["position"] = "absolute";      // fixed on screen
    READOUT.style["width"] = "100%";             // full width of screen
    READOUT.style["text-align"] = "center";      // text alignment
    READOUT.style["bottom"] = "90%";             // bottom margin
    READOUT.style["color"] = "#ff0";             // text color

// Prepend to body so it shows up on top
//
    document.body.insertBefore(READOUT, document.body.firstChild);

    var livesCount = document.createTextNode("Lives: " + lives);
    lifeDiv.appendChild(livesCount);
    READOUT.appendChild(lifeDiv);

    var info = document.createTextNode(""); //placeholder text
    infoDiv.appendChild(info);
    READOUT.appendChild(infoDiv);

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
    if(player != null) {
        if (!JUMPING && !STRAFFING) {
            if (keyVal == 38) {
                JUMPING = true;
                player.scale.y = 2;
                direction = -1;
            } else if (keyVal == 40) {
                JUMPING = true;
                player.scale.y = 2;
                direction = 1;
            }
        }
        if (!STRAFFING && !JUMPING) {
            if (keyVal == 37) {
                STRAFFING = true;
                player.scale.y = 2;
                direction = -1;
            } else if (keyVal == 39) {
                STRAFFING = true;
                player.scale.y = 2;
                direction = 1;
            }
        }
        if(!PLAYING && lives >= 0){
            if(keyVal == 82){
                PLAYING = true;
                player.position.z = 4.5;
                lifeDiv.textContent = "Lives: " + lives;
                infoDiv.textContent = "";
            }
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
                        lives --;
                        if(lives < 0){
                            infoDiv.textContent = "You Lose!!!";
                            // var loserDiv = document.createElement("h1");
                            // var loser = document.createTextNode("You Lose!!!");
                            // loserDiv.appendChild(loser);
                            // READOUT.appendChild(loserDiv);
                        }else{
                            infoDiv.textContent = "Press \'r\' to try again!";
                            // var restart = document.createTextNode("Press \'r\' to try again!");
                            // restartDiv.style['float'] = "left";
                            // restartDiv.appendChild(restart);
                            // READOUT.appendChild(restartDiv);
                        }
                    }
                }
            }
            if (JUMPING && animFrame <= increment) {
                var rads = (animFrame / increment) * Math.PI;
                sceneNode.position.y = Math.sin(rads) + 0.5;
                sceneNode.position.z += (direction * totalDistance);
                animFrame++;
                var mat = new THREE.Matrix4();
                mat.set(
                    1, 0, 0, 0,
                    0, animFrame, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
                );
            }else if (STRAFFING && animFrame <= increment) {
                var rads = (animFrame / increment) * Math.PI;
                sceneNode.position.y = Math.sin(rads) + 0.5;
                sceneNode.position.x += (direction * totalDistance);
                animFrame++;
            }else if(animFrame > increment){
                animFrame = 1;
                JUMPING = false;
                player.scale.y = 0.5;
                STRAFFING = false;
            }else{
                player.scale.y = 1;
            }
        }
        checkForWin();
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
function checkForWin(){
    if(player != null && player.position.z < -4.48 && player.scale.y == 1){
        PLAYING = false;
        infoDiv.textContent = "Congratulations, you win!!!";

    }
}