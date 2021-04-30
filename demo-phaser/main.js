var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
	height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var ground;
var meteors;
var nullos;
var scoreText;
var score = 0;

var game = new Phaser.Game(config);

function preload(){

    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('meteor', 'assets/meteor.png');
    this.load.spritesheet('perso', 'assets/neila.png',{ frameWidth: 256, frameHeight: 420 });

}


function create(){

    this.add.image(645, 320, 'sky');

    ground = this.physics.add.staticGroup();

    ground.create(645, 660, 'ground').setScale(0.8).setTint(0x800000).refreshBody();

    player = this.physics.add.sprite(600, 550, 'perso').setScale(0.15);

    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'perso', frame: 4 } ],
        frameRate: 10
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('perso', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();

    meteors = this.physics.add.group();

    this.physics.add.collider(meteors, ground, hitGround, null, this);

    this.physics.add.collider(player, meteors, hitMeteor, null, this);

    timedEvent = this.time.addEvent({ delay: 200, callback: onEvent, callbackScope: this, loop: true });

    timedEvent2 = this.time.addEvent({ delay: 200, callback: onEvent2, callbackScope: this, loop: true });

    scoreText = this.add.text(26, 26, 'Score : 0', { fontSize: '30px', fill: '#941b0c'});

    scoreEvent = this.time.addEvent({ delay: 200, callback: onEvent3, callbackScope: this, loop: true });

}

function update(){


    if (cursors.left.isDown){

        player.setVelocityX(-600);

        player.anims.play('left', true);
    }

    else if (cursors.right.isDown){

        player.setVelocityX(600);

        player.anims.play('right', true);
    }

    else{

        player.setVelocityX(0);

        player.anims.play('turn');
    }



}

function onEvent() {

    var meteor = meteors.create(Phaser.Math.Between(-50, 1400), 0, 'meteor');
    meteor.setScale(0.1);
    meteor.setVelocityY(Phaser.Math.Between(700, 1000));

}


function onEvent2() {

    var meteor = meteors.create(Phaser.Math.Between(-50, 1400), 0, 'meteor');
    meteor.setScale(0.1);
    meteor.setVelocityY(Phaser.Math.Between(700, 1000));

}

function onEvent3() {

    score += 10;
    scoreText.setText('Score: ' + score);

}


function hitMeteor (player, meteor){
        
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    timedEvent.remove(false);
    timedEvent2.remove(false);
    scoreEvent.remove(false);

    nullos = this.add.text(110, 180, 'GAME OVER', { fontSize: '200px', fill: '#941b0c'});

}

function hitGround(meteor, ground){

    meteor.destroy();


}