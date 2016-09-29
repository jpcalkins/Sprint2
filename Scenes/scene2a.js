/**
 * Created by Jacob on 9/29/16.
 */
var player;
var jumpLength = 1.25;
var animFrame = 0;
var JUMPING = false;
var direction = 1;
var increment = (jumpLength) / 10;

function scriptOnLoad(currentScene){
    player = currentScene.getObjectByName("Player");
}
function keyUpEvent(keyVal) {
    if(!JUMPING) {
        JUMPING = true;
        if (keyVal == 38) {
            direction = -1;
        } else if (keyVal == 40) {
            direction = 1;
        }
    }
}
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
function jumpScript(sceneNode){
    if(JUMPING && animFrame <= 10){
        player.position.z += (direction * increment);
        animFrame ++;
    }else{
        animFrame = 0;
        JUMPING = false;
    }
}