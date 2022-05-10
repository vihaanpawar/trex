var trex, trex_running,trex_collided;
var ground, groundImg;
var invisibleGround;
var cloud, cloudimg;
var obstacle, obImg1, obImg2, obImg3, obImg4, obImg5, obImg6;
var score = 0;
var play = 1;
var end = 0;
var gameState = play;
var gameOver,gameOverImg;
var restart,restartImg;
var jumpSound,dieSound,checkSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  groundImg = loadImage("ground2.png");
  cloudimg = loadImage("cloud.png");
  obImg1 = loadImage("obstacle1.png");
  obImg2 = loadImage("obstacle2.png");
  obImg3 = loadImage("obstacle3.png");
  obImg4 = loadImage("obstacle4.png");
  obImg5 = loadImage("obstacle5.png");
  obImg6 = loadImage("obstacle6.png");
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkSound=loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  //create the trex sprite.
  trex = createSprite(60,height-70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  trex.debug=false;

  //create ground sprite.
  ground = createSprite(width/2,height-30,width, 20);
  ground.addImage(groundImg);
  ground.velocityX = -3;
  ground.x = ground.width / 2;

  gameOver= createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale=3

  restart=createSprite(width/2,height/2+30);
  restart.addImage(restartImg);
  restart.scale=0.5;

  //creating invisible ground.
  invisibleGround = createSprite(width/2,height-25,width, 20);
  invisibleGround.visible = false;

  
  //create edge sprites.
  edges = createEdgeSprites();

  obstaclesGroup = new Group();
  cloudsGroup = new Group();


}

function draw() {
  background("white");
  textSize(30);
  text("score: " + score, width-190, 50);
  if(score>0&&score%100===0){
    checkSound.play()
  }

  if (gameState === play) {
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    ground.velocityX = -(4+3*score/100);
    score = score + Math.round(getFrameRate()/60);

    // jump trex when space is pressed
    if ((touches.lenght>0 ||keyDown("space")) && trex.y >= 100) {
      trex.velocityY = -10;
      jumpSound.play()
      touches=[]
    }

    restart.visible=false;
    gameOver.visible=false;

    //adding gravity
    trex.velocityY = trex.velocityY + 0.5;
    SpawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)) {
      gameState = end;
      dieSound.play();
    }
  } else if (gameState === end) {
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    restart.visible=true;
    gameOver.visible=true;
    if(mousePressedOver(restart)){
      reset();
    }
  }

  //stop trex from falling down.
  trex.collide(invisibleGround);

  
  drawSprites();
}

function SpawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width-30,120, 40, 10);
    cloud.addImage(cloudimg);
    cloud.y = Math.round(random(10, 60));
    cloud.velocityX = -3;
    cloud.lifetime = 520;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(width-30, height-50, 10, 40);
    obstacle.velocityX = -(6+score/100);
    obstacle.scale = 0.5;
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
    obstacle.lifetime = 300;
    var ran = Math.round(random(1, 6));
    switch (ran) {
      case 1:
        obstacle.addImage(obImg1);
        break;
      case 2:
        obstacle.addImage(obImg2);
        break;
      case 3:
        obstacle.addImage(obImg3);
        break;
      case 4:
        obstacle.addImage(obImg4);
        break;
      case 5:
        obstacle.addImage(obImg5);
        break;
      case 6:
        obstacle.addImage(obImg6);
        break;
      default:
        break;
    }
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState=play;
  restart.visible=false;
  gameOver.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
}