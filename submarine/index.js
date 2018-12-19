//On page load, create game config
var config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 695,
    backgroundColor: '#034',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
    
//Instantiate the game with the config
var game = new Phaser.Game(config);

var cursors;
var camera;
var text;
var sky;
var horizon;
var torpedo = false;

var x_left_limit = -10000;
var x_right_limit = 10000;

var z_horizon = -20000;

xAxis = new Phaser.Math.Vector3(1, 0, 0);
yAxis = new Phaser.Math.Vector3(0, 1, 0);
zAxis = new Phaser.Math.Vector3(0, 0, 1);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('horizon', 'assets/ball.png');
    this.load.image('tree', 'assets/greenbar.png');
    this.load.image('ship1','assets/ship1.png');
}

function create ()
{
    camera = this.cameras3d.add(80).setPosition(0, -10, 0);
    
    sky = this.add.image(config.width/2, 178, 'sky').setDepth(-5000);
    //horizon = this.add.image(config.width/2, 355, 'horizon').setDepth(-4000);
    //sky = camera.create(0, 0,z_horizon-2500,'sky');
    
    //ships = camera.add.group();

    //ships = camera.createMultiple (6,'ship1');

    /*ships.children.iterate (function (ship){
        ship.x = 100;
        ship.y = 0;
        ship.z = 100;
    });*/

    ship1 = camera.create(0,0,z_horizon,'ship1');
    camera.createRect({ x: 2, y: 1, z: 8 }, {x:250 , y: 1 , z: 500}, 'horizon');
    //dot = camera.add(0,0,0,'horizon');
    /*
    ship2 = camera.create(2000,0,z_horizon,'ship1');
    ship3 = camera.create(5000,0,z_horizon,'ship1');
    ship4 = camera.create(10000,0,z_horizon,'ship1');
    ship5 = camera.create(-3000,0,z_horizon,'ship1');
    ship6 = camera.create(-5500,0,z_horizon,'ship1');
    ship7 = camera.create(-10000,0,z_horizon,'ship1');
    ship8 = camera.create(-15000,0,z_horizon,'ship1');
    
    */

    for (var z = 0; z < 3; z++)
    {
        for (var x = 0; x < 3; x++)
        {
            var xDiff = Phaser.Math.Between(-40, 40);
            var zDiff = Phaser.Math.Between(-160, -60);

            var bx = (x * 100) + xDiff;
            var bz = (z * -100) + zDiff-3000;

            camera.create(bx, 0, bz, 'tree');
        }
    }

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update ()
{
    if (torpedo){
        dot.z -=100;
    }

    if (cursors.left.isDown){
        if (cursors.shift.isDown){
            camera.rotate(0.01, yAxis);
        }
        else {
            camera.x = Phaser.Math.Clamp(camera.x - 40, x_left_limit, x_right_limit);
        }
    }
    else if (cursors.right.isDown){
        if (cursors.shift.isDown){
            camera.rotate(-0.01, yAxis);
        }
        else {
            camera.x = Phaser.Math.Clamp(camera.x + 40, x_left_limit, x_right_limit);
        }
    }

    if (cursors.up.isDown){
        camera.y = Phaser.Math.Clamp(camera.y - 10, -200, 0);
    }
    else if (cursors.down.isDown){
        camera.y = Phaser.Math.Clamp(camera.y + 10, -200, 0);
    }

    if (cursors.space.isDown){
        if (cursors.shift.isDown){
            //ship1.z -=500;
        }
        else {
            torpedo = true;
            //ship1.z += 500;
        }
    }

    text.setText([
        'camera.x: ' + camera.x,
        'camera.y: ' + camera.y,
        'camera.z: ' + camera.z,
        'ship.z:' 
    ]);
}
