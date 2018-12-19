//On page load, create game config
var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 695,
    backgroundColor: '#034',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            time: 0
        }
    }


};

var score =5;
    
//Instantiate the game with the config
var game = new Phaser.Game(config);

var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    // Bullet Constructor
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'ball');
        this.speed = 0.3;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        //this.setSize(12, 12, true);
    },

    // Fires a bullet from the player to the reticle
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y)
        {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else
        {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        //this.rotation = shooter.rotation; // angle bullet with shooters rotation
        this.born = 0; // Time since new bullet spawned
    },

    // Updates the position of the bullet each cycle
    update: function (time, delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 3800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

function preload(){
    this.load.image('ball', 'assets/ball.png');
    this.load.image('ship', 'assets/ship.png');
    this.load.image('player', 'assets/sub.png');
    this.load.image('sky','assets/sky.png');
    this.load.image('target','assets/target.png');
}

function create(){
    
    // world size
    this.physics.world.setBounds(0, 0, 1600, config.height);

    playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    
    // var sky = this.add.image(config.width/2,117,'sky');

    player = this.physics.add.sprite(config.width/2, 600, 'player').setCollideWorldBounds(true).setBounce(1).setScrollFactor(0);
    player.last_fire = 0;
    player.lives = 10;

    target = this.physics.add.image(player.x,player.y-80,'target');
    target.addx = 0;

    ships = this.physics.add.group({key: 'ship', frame: 0, repeat: 3, setXY: {x: 70, y: 200, stepX: 200}});
    ships.last_fire = 0;
    
    ships.children.iterate(function (ship) {
        ship.setBounce(0.95);
        ship.setCollideWorldBounds (true);
        ship.setVelocityX(Phaser.Math.Between(-300, 300));
        ship.last_fire = 0;
    });

    this.physics.add.collider(player, enemyBullets, enemyHitCallback, null, this);
    this.physics.add.collider(ships, playerBullets, playerHitCallback, null, this);
    
    //this.cameras.main.zoom = 0.8;
    //this.cameras.main.startFollow(player);

    cursors = this.input.keyboard.createCursorKeys();
    
    scoreText = this.add.text(16, 16, 'score: '+score+'\nlives: '+player.lives, { fontSize: '32px', fill: '#000' });
}

function update(time, delta){
    
    target.x = player.x+target.addx;

    if (cursors.left.isDown){
        if (cursors.shift.isDown){
            // if shift and left
            target.addx -=5;
        }
        else {
            //if left
            player.setVelocityX(-300);
        }
    }
    else if (cursors.right.isDown){
        if (cursors.shift.isDown){
            // if shift and right
            target.addx +=5;
        }
        else {
            // if right
            player.setVelocityX(300);
        }
    }

    if (cursors.up.isDown){
        // if up
        target.addx = 0;
        
    }
    else if (cursors.down.isDown){
        // if down 
        player.setVelocityX(0);
    }

    if (cursors.space.isDown){
        if (cursors.shift.isDown){
            // if shift and space


        }
        else {
            // if space
            if ((time - player.last_fire) > 200){
        
                player.last_fire = time;
    
                var bullet = playerBullets.get().setActive(true).setVisible(true);
                if (bullet){
                    bullet.fire(player, target);
                }
            }
        }
    }
    
    ships.children.iterate(function (ship) {
        enemyFire(ship, player, time, this);
    });

       //Update scoretext
       scoreText.setText = 'scsdsore: '+score+'\nlivess: '+player.lives;
 
}

function enemyFire(enemy, player, time, objr){

    if ((time - enemy.last_fire) > Phaser.Math.Between(3500, 8300)){
        
        enemy.last_fire = time;
    
        // Get bullet from bullets group
        var bullet = enemyBullets.get().setActive(true).setVisible(true);
        if (bullet) {
            bullet.fire(enemy, player);
        }
    }
}

function playerHitCallback(playerHit, bulletHit){
    score -=10;
    player.lives -=1;

    //Update scoretext
    scoreText.setText = 'playerHitscsdsore: '+score+'\nlivess: '+player.lives;

    bulletHit.setActive(false).setVisible(false);
    playerHit.setActive(false).setVisible(false);
}

function enemyHitCallback(playerHit, bulletHit){
    score +=10;

    //Update scoretext
    scoreText.setText = 'enemyHitscsdsore: '+score+'\nlivess: '+player.lives;

    bulletHit.setActive(false).setVisible(false);
}