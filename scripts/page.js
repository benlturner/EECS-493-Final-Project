////  Page-scoped globals  ////

// Counters
var snowballIdx   = 1;
var projectileIdx = 1;
var enemyIdx = 1;
var bunkerIdx = 1;

// Size Constants
var MAX_PROJECTILE_SIZE   = 50;
var MIN_PROJECTILE_SIZE   = 15;
var PROJECTILE_SIZE     = 40;
var PROJECTILE_SPEED      = 5;
var SNOWBALL_SPEED        = 10;
var SNOWMAN_SPEED          = 25;
var ENEMY_DOUBLE_RATIO = 0.5;
var ENEMY_SPEED = 2;
var ENEMY_DIRECTION = "right";
var OBJECT_REFRESH_RATE = 50;    // ms
var SCORE_UNIT_PROJECTILE          = 5;   // scoring is in 100-point units
var SCORE_UNIT_HIT          = 50;   // scoring is in 100-point units
var SCORE_UNIT_KILL          = 100;   // scoring is in 100-point units
var PROJECTILE_SPAWN_RATE = 1200;  // ms
var SNOWBALL_RECHARGE = 400;
var SNOWBALL_TIMER = 0;
var GAME_OVER = false;
var NUM_BUNKERS = 4;
var CUR_LEVEL = 1;
var LEVEL_SPEED = 2;
var GAME_PAUSED = false;
var ENEMY_SIZE = 100;

// Size vars
var maxSnowmanPosX, maxSnowmanPosY, maxEnemyPosX;

// Global Window Handles (gwh__)  --> replaced with Vue.js
var gwhGame, gwhOver, gwhStatus;

// Global Object Handles
var snowman;

var KEYS = {
  left    : 37,
  up      : 38,
  right   : 39,
  down    : 40,
  shift   : 16,
  spacebar: 32
}

// Temporary Storage of Level Data
var ENEMY_PATTERN = [7,1,8] // scale
var threshold = Math.ceil(ENEMY_DOUBLE_RATIO * ENEMY_PATTERN[2] * ENEMY_PATTERN[1]);
var NUM_ENEMIES = ENEMY_PATTERN[1] * ENEMY_PATTERN[0]

////  Functional Code  ////

// Main
$(document).ready( function() {
  // Now that the elements have loaded, populate with Vue.js
  createVueObjects();

  console.log("Ready!");

  // Set global handles (now that the page is loaded)
  gwhGame   = $('.game-window');
  gwhOver   = $('.game-over');
  gwhStatus = $('.status-window');
  snowman   = $('#enterprise');  // set the global snowman handle

  // Set global positions
  maxSnowmanPosX = gwhGame.width() - snowman.width() - 5;
  maxSnowmanPosY = gwhGame.height() - 75;
  
  SNOWMAN_OBJ.snowmanStyle.top = maxSnowmanPosY
  $(window).keydown(keydownRouter);

// show rules first
  gwhGame.hide();
  gwhStatus.hide();
  setTimeout(function () {
    $('#titleScreen').hide();
    $('#levelScreen').hide();
    $('#splashScreen').hide();
    gwhGame.show();
    gwhStatus.show();

    // Periodically check for collisions (instead of checking every position-update)
    let ch_co_id = setInterval( function() {
      checkCollisions();  // Remove elements if there are collisions
    }, 100);

    // Update Snowball reload
    let rl_sb_id = setInterval (function() {
      SNOWBALL_TIMER = SNOWBALL_TIMER + 100;
    },100);
    // Create enemies 

    maxEnemyPosX = gwhGame.width() - ENEMY_SIZE - 5;
    createEnemies();
    createBunkers();
    // Move enemies
    let mv_en_id = setInterval ( function() {
      moveEnemies();
      if (NUM_ENEMIES === 0) {
        newLevel()
      }

      if (GAME_OVER) {
        // Remove all game elements
        snowman.remove();
        $('.snowball').remove();
        $('.projectile').remove();
        $('.enemy').remove();

        // Hide primary windows
        gwhGame.hide();
        // gwhStatus.hide();
  
        // Show "Game Over" screen
        gwhOver.show();
  
        clearInterval(ch_co_id);
        clearInterval(rl_sb_id);
        clearInterval(mv_en_id);
        clearInterval(cr_prj_id);
      }
    }, 100);

    let cr_prj_id = setInterval(function() {
      createProjectile();
    }, PROJECTILE_SPAWN_RATE)
  }, 5000)

});


function keydownRouter(e) {
  switch (e.which) {
    case KEYS.spacebar: {
		if (SNOWBALL_TIMER > SNOWBALL_RECHARGE) {
			fireSnowball();
		}
      break; 
	}
    case KEYS.left:
    case KEYS.right:
      moveSnowman(e.which);
      break;
    default:
      console.log("Invalid input!");
  }
  e.Handled = true;
}

// Check for any collisions and update/remove the appropriate object if needed
function checkCollisions() {

  if(!GAME_PAUSED){
    // First, check for snow-ball projectile interactions
    $('.snowball').each( function() {
      var $curSnowball = $(this);  // define a local handle for this rocket
      $('.projectile').each( function() {
        var $curProjectile = $(this);  // define a local handle for this asteroid

        // For each rocket and asteroid, check for collisions
        if (isColliding($curSnowball, $curProjectile, 0)) {
          // If a rocket and asteroid collide, destroy both
          $curSnowball.remove();
          $curProjectile.remove();
          SCORE_OBJ.score += SCORE_UNIT_PROJECTILE;
        }
      });
    });

    // Next, check for snowball-enemy interactions
    $('.snowball').each( function() {
      var $curSnowball = $(this);  // define a local handle for this snowball
      $('.enemy').each( function() {
        var $curEnemy = $(this);  // define a local handle for this enemy

        // For each snowball and enemy, check for collisions
        if (isColliding($curSnowball, $curEnemy, 12)) {
          // If a snowball and enemy collide, remove a ball from the enemy
          switch ($curEnemy.children('img').attr('src')) {
            case 'img/snowman.png': {
              $curEnemy.children('img').attr('src', 'img/snowman2balls.png');
              $curSnowball.remove();
              $curEnemy.css('height', 60);
              SCORE_OBJ.score += SCORE_UNIT_HIT;
              break;
            }
            case 'img/snowman2balls.png': {
              $curEnemy.children('img').attr('src', 'img/snowman1ball.png');
              $curSnowball.remove();
              $curEnemy.css('height', 30);
              SCORE_OBJ.score += SCORE_UNIT_HIT;
              break;
            }
            case 'img/snowman1ball.png': {
              $curEnemy.remove();
              $curSnowball.remove();
              NUM_ENEMIES--;
              SCORE_OBJ.score += SCORE_UNIT_KILL;
            }
          }
        }
      });
    });

    // Next, check for snowball-gift interactions
    $('.snowball').each( function() {
      var $curSnowball = $(this);  // define a local handle for this snowball
      $('.bunker').each( function() {
        var $curBunker = $(this);  // define a local handle for this enemy
        if (isColliding($curSnowball, $curBunker, 10)) {
          $curSnowball.remove();
        }
      });
    });

    // Next, check for projectile-gift interactions
    $('.bunker').each( function() {
      var $curBunker = $(this);  // define a local handle for this rocket
      $('.projectile').each( function() {
        var $curProjectile = $(this);  // define a local handle for this asteroid

        // For each projectile and bunker, check for collisions
        if (isColliding($curBunker, $curProjectile, 10)) {
          console.log($curBunker.children('img').attr('src'));
          // If a projectile and bunker collide, take a layer off the bunker
          switch ($curBunker.children('img').attr('src')) {
            case 'img/gift.png': {
              $curBunker.children('img').attr('src', 'img/gift1.png');
              $curProjectile.remove();
              let bunkerHeight = parseInt($curBunker.css('height'));
              break;
            }
            case 'img/gift1.png': {
              $curBunker.children('img').attr('src', 'img/gift2.png');
              $curProjectile.remove();
              break;
            }
            case 'img/gift2.png': {
              $curBunker.children('img').attr('src', 'img/gift3.png');
              $curProjectile.remove();
              break;
            }
            case 'img/gift3.png': {
              $curBunker.children('img').attr('src', 'img/gift4.png');
              $curProjectile.remove();
              break;
            }
            case 'img/gift4.png': {
              $curBunker.remove();
              $curProjectile.remove();
            }
          }
        }
      });
    });


    // Next, check for enemy-snowman interactions
    $('.enemy').each( function() {
      var $curEnemy = $(this);
      if (isColliding($curEnemy, snowman, 0)) {
        GAME_OVER = true;
      }
    });

    // Next, check for projectile-snowman interactions
    $('.projectile').each( function() {
      var $curProjectile = $(this);
      if (isColliding($curProjectile, snowman, 0)) {
        GAME_OVER = true;
      }
    });

  }
  
}

// Check if two objects are colliding
function isColliding(o1, o2, offset) {
  // Define input direction mappings for easier referencing
  o1D = { 'left': parseInt(o1.css('left')),
          'right': parseInt(o1.css('left')) + o1.width(),
          'top': parseInt(o1.css('top')),
          'bottom': parseInt(o1.css('top')) + o1.height()
        };
  o2D = { 'left': parseInt(o2.css('left')) + offset,
          'right': parseInt(o2.css('left')) + o2.width() - offset,
          'top': parseInt(o2.css('top')),
          'bottom': parseInt(o2.css('top')) + o2.height()
        };

  // If horizontally overlapping...
  if (o1D.left <= o2D.right &&
    o1D.right >= o2D.left &&
    o1D.top <= o2D.bottom &&
    o1D.bottom >= o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Return a string corresponding to a random HEX color code
function getRandomColor() {
  // Return a random color. Note that we don't check to make sure the color does not match the background
  return '#' + (Math.random()*0xFFFFFF<<0).toString(16);
}

// Handles enemy creation
function createEnemies() {
	console.log('Spawning enemies...');
	var enemyOffset = 1.1*ENEMY_SIZE;
	var enemyX = 0;
	var enemyY = 0;
	var i;
	for (i = 0; i < ENEMY_PATTERN[0]; i++) {
		var j;
		for (j = 0; j < ENEMY_PATTERN[1]; j++) {
			var enemyDivStr = "<div id='e-" + enemyIdx + "' class='enemy'></div>"
			gwhGame.append(enemyDivStr);
			var $curEnemy = $('#e-'+enemyIdx);
			$curEnemy.css('position',"absolute");
			$curEnemy.css('left', (5 + (i * enemyOffset)) + "px");
			$curEnemy.css('top', (5 + (j * enemyOffset)) + "px");
			$curEnemy.css('width', ENEMY_SIZE + "px");
			$curEnemy.css('height', ENEMY_SIZE + "px");
			$curEnemy.append("<img src='img/snowman.png' height ='" + ENEMY_SIZE + " width =" + ENEMY_SIZE + "'/>");
			$curEnemy.children('img').attr('position', 'absolute');
			enemyIdx++;
		}
	}
}

function createBunkers() {
  console.log('Creating bunkers...');
  var bunkerX = 0;
  var bunkerY = 0;
  var bunkerSize = Math.floor(900 / (NUM_BUNKERS * 2));

  var i;
  for (i = 0; i < NUM_BUNKERS; i++) {
    var bunkerDivStr = "<div id='b-" + bunkerIdx + "' class='bunker'></div>"
		gwhGame.append(bunkerDivStr);
		var $curBunker = $('#b-'+bunkerIdx);
		$curBunker.css('position',"absolute");
		$curBunker.css('left', ((bunkerSize/2) + (i * bunkerSize * 2)) + "px");
		$curBunker.css('top', ((parseInt(gwhGame.height()) - 225) + "px"));
		$curBunker.css('width', bunkerSize + "px");
		$curBunker.css('height', bunkerSize + "px");
		$curBunker.append("<img src='img/gift.png' height ='" + bunkerSize + " width =" + bunkerSize + "'/>");
		$curBunker.children('img').attr('position', 'absolute');
		bunkerIdx++;
  }

}

//Handles enemy movement
function moveEnemies() {
  if(!GAME_PAUSED){
    if (ENEMY_DIRECTION === "left") {
      $('.enemy').each( function() {
        var $curEnemy = $(this);
        if ((parseInt($curEnemy.css('left')) - ENEMY_SPEED) < 5) {
          ENEMY_DIRECTION = "right";
          $('.enemy').each( function() {
            var $curEnemy = $(this);
            $curEnemy.css('top', parseInt($curEnemy.css('top')) + (ENEMY_SIZE / 10))
            if (parseInt($curEnemy.css('top')) > 450) {
              GAME_OVER = true;
            }
          });
          return false;
        }
      });
      if (ENEMY_DIRECTION === "left") {
        $('.enemy').each( function() {
        var $curEnemy = $(this);
        $curEnemy.css('left', parseInt($curEnemy.css('left')) - ENEMY_SPEED)
        });
      }
    }
    else {
      $('.enemy').each( function() {
        var $curEnemy = $(this);
        if ((parseInt($curEnemy.css('left')) + ENEMY_SPEED) > maxEnemyPosX) {
          ENEMY_DIRECTION = "left";
          $('.enemy').each( function() {
            var $curEnemy = $(this);
            $curEnemy.css('top', parseInt($curEnemy.css('top')) + (ENEMY_SIZE / 10))
            if (parseInt($curEnemy.css('top')) > 450) {
              GAME_OVER = true;
            }
          });
          return false;
        }
      });
      if (ENEMY_DIRECTION === "right") {
        $('.enemy').each( function() {
        var $curEnemy = $(this);
        $curEnemy.css('left', parseInt($curEnemy.css('left')) + ENEMY_SPEED)
        });
      }
    }
    if (NUM_ENEMIES < threshold) {
      ENEMY_SPEED = ENEMY_SPEED*2;
      console.log(ENEMY_SPEED);
      threshold = Math.ceil(threshold*ENEMY_DOUBLE_RATIO);
    }
  }	
}

// Handle projectile creation events
function createProjectile() {
  console.log('Spawning projectile...');

  if (!GAME_PAUSED){
    // NOTE: source - http://www.clipartlord.com/wp-content/uploads/2016/04/aestroid.png
    var projectileDivStr = "<div id='a-" + projectileIdx + "' class='projectile'></div>"
    // Add the snowball to the screen
    gwhGame.append(projectileDivStr);
    // Create and projectile handle based on newest index
    var $curProjectile = $('#a-'+projectileIdx);

    projectileIdx++;  // update the index to maintain uniqueness next time

    // Set size of the projectile (semi-randomized)
    var projectileEnemyID = Math.floor(Math.random() * NUM_ENEMIES);   
    var astrSize = (MAX_PROJECTILE_SIZE + MIN_PROJECTILE_SIZE)/2;
    $curProjectile.css('width', astrSize+"px");
    $curProjectile.css('height', astrSize+"px");

    if(Math.random() < 1/4){
      $curProjectile.append("<img src='img/blueBook.png' height='" + astrSize + "'/>")
    } else if(Math.random() < 1/2) {
      $curProjectile.append("<img src='img/icicle.png' height='" + astrSize + "'/>")
    } else if(Math.random() < 3/4) {
      $curProjectile.append("<img src='img/corona.png' height='" + astrSize + "'/>")
    } else {
      $curProjectile.append("<img src='img/glasses.png' height='" + astrSize + "'/>")
    } 

    var index = 0
    let startingPositionLeft;
    let startingPositionBottom;
    $('.enemy').each( function() {
      var $curEnemy = $(this);
      if(index === projectileEnemyID){
        startingPositionLeft = parseInt($curEnemy.css('left')) + parseInt($curEnemy.css('width'))/2.5
        startingPositionBottom = parseInt($curEnemy.css('top')) + parseInt($curEnemy.css('height'))
      }
      index++
    });

    // Pick a random starting position within the game window
    // Using 50px as the size of the projectile (since no instance exists yet)

    // Set the instance-specific properties
    $curProjectile.css('left', startingPositionLeft+"px");
    $curProjectile.css('top', startingPositionBottom+"px");

    // Make the projectiles fall towards the bottom
    setInterval( function() {
      $curProjectile.css('top', parseInt($curProjectile.css('top'))+PROJECTILE_SPEED);
      // Check to see if the projectile has left the game/viewing window
      if (parseInt($curProjectile.css('top')) > (gwhGame.height() - $curProjectile.height())) {
        $curProjectile.remove();
      }
    }, OBJECT_REFRESH_RATE);
  }
  
}

// Handle "fire" [snowball] events
function fireSnowball() {
  if(!GAME_PAUSED){
    console.log('Firing snowball...');

    // NOTE: source - https://www.raspberrypi.org/learning/microbit-game-controller/images/missile.png
    var snowballDivStr = "<div id='r-" + snowballIdx + "' class='snowball'><img src='img/snowball.png'/></div>";
    // Add the snowball to the screen
    gwhGame.append(snowballDivStr);
    // Create and snowball handle based on newest index
    var curSnowball = $('#r-'+snowballIdx);
    let curImg = $('#r-'+snowballIdx + ' img');
    snowballIdx++;  // update the index to maintain uniqueness next time

    // Set vertical position
    curSnowball.css('top', SNOWMAN_OBJ.snowmanStyle.top);
    // Set horizontal position
    var rxPos = SNOWMAN_OBJ.snowmanStyle.left + snowman.width()/4;  // In order to center the snowball, shift by half the div size (recall: origin [0,0] is top-left of div)
    curSnowball.css('left', rxPos+"px");
    curSnowball.css('height', "20px");
    curSnowball.css('width', "20px");
    curImg.css('height', "20px");
    curImg.css('width', "20px");


    // Create movement update handler
    setInterval( function() {
      curSnowball.css('top', parseInt(curSnowball.css('top'))-SNOWBALL_SPEED);
      // Check to see if the snowball has left the game/viewing window
      if (parseInt(curSnowball.css('top')) < 0) {
        //curSnowball.hide();
        curSnowball.remove();
      }
    }, OBJECT_REFRESH_RATE);
    SNOWBALL_TIMER = 0;

  }
  
}

// Handle snowman movement events
function moveSnowman(arrow) {
  if(!GAME_PAUSED){
    switch (arrow) {
      case KEYS.left:   // left arrow
        SNOWMAN_OBJ.snowmanStyle.left = Math.max(5, SNOWMAN_OBJ.snowmanStyle.left - SNOWMAN_SPEED);
      break;
      case KEYS.right:  // right arrow
        SNOWMAN_OBJ.snowmanStyle.left = Math.min(maxSnowmanPosX, SNOWMAN_OBJ.snowmanStyle.left + SNOWMAN_SPEED);
      break;
    }
  }
}

function newLevel(ENEMY_SIZE){
  $('.snowball').remove();
  $('.projectile').remove();
  LEVEL_OBJ.level += 1
  $('#levelScreen').toggle();
  gwhGame.toggle();
  CUR_LEVEL++;
  LEVEL_SPEED++;
  ENEMY_SPEED = LEVEL_SPEED;
  PROJECTILE_SPAWN_RATE -= 50;
  GAME_PAUSED = true
  threshold = Math.ceil(ENEMY_DOUBLE_RATIO * ENEMY_PATTERN[2] * ENEMY_PATTERN[1]);
  NUM_ENEMIES = ENEMY_PATTERN[1] * ENEMY_PATTERN[0]
  createEnemies();
  createBunkers();
  
  setTimeout(function() {
    $('#levelScreen').hide();
    gwhGame.show();       
    GAME_PAUSED = false;
  }, 5000)
}

/* Things added
    game size parameters are hardcoded now
    speed threshold function re-added
    enemy movement speed, pojectile launch, and snowball generation sped up, make the game more realistic
    points for hitting projectile
    hit box for projectile and player
    detecting enemy-player collisions better
    game over when enemies get too low
    end level when enemies are eliminated
    stop intervals when level is over
      currently goes to game over screen, but when levels are added that will be easy to fix
    destructible bunkers (each is an image broken into multiple vertical cuts that independently detect collisions with snowballs and enemy collisons)
      may need to make snowball slightly smaller
    multiple levels
    theme the game to UofM more? Maybe make the background more UofM, the snowman have UofM colors on its scarf etc.
*/

/* Things we need/want
		[x] make everything (including movement speed) scale to the screen size.
		[x] detecting enemy-player collisions better
			only need to cheeck that they are below a y-value threshold and overlapping horizontally with player
		[x] destructible bunkers (each is an image broken into multiple vertical cuts that independently detect collisions with snowballs and enemy collisons)
      may need to make snowball slightly smaller
    [x] if number is equal to zero, end the level
    [x] if enemy 'top' gets to where the player is, game over
		[x] multiple enemies
		[x] randomly choosing enemy to shoot projectile
			should only bottom enemies be able to shoot like in the game?
				if we wanted this, we would keep track of each column of enemies' lowest member and on death, would update.
		random enemies like the UFO in space invaders?
		a shop
			lives and upgrades to firing speed or new weapons? Cosmetics?
		the ability to move and shoot (store last two inputs and on update, execute: < + S = left and shoot, < [null] = left, < > = nothing, etc.)
		[x] multiple levels
		a better rule overlay
		a transition screen between levels
		[x] theme the game to UofM more? Maybe make the background more UofM, the snowman have UofM colors on its scarf etc.
		comment everything, remove useless code, replace magic numbers with variables
*/
