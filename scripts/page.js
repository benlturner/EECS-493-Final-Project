////  Page-scoped globals  ////

// Counters
var snowballIdx   = 1;
var projectileIdx = 1;

// Size Constants
var MAX_PROJECTILE_SIZE   = 50;
var MIN_PROJECTILE_SIZE   = 15;
var PROJECTILE_SIZE     = 40;
var PROJECTILE_SPEED      = 5;
var SNOWBALL_SPEED        = 10;
var SNOWMAN_SPEED          = 25;
var OBJECT_REFRESH_RATE = 50;    // ms
var SCORE_UNIT          = 100;   // scoring is in 100-point units
var PROJECTILE_SPAWN_RATE = 1000;  // ms

// Size vars
var maxSnowmanPosX, maxSnowmanPosY;

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
  maxSnowmanPosX = gwhGame.width() - snowman.width();
  maxSnowmanPosY = gwhGame.height() - snowman.height();
  
  SNOWMAN_OBJ.snowmanStyle.top = maxSnowmanPosY

  $(window).keydown(keydownRouter);

  // Periodically check for collisions (instead of checking every position-update)
  setInterval( function() {
    checkCollisions();  // Remove elements if there are collisions
  }, 100);

  // Create a new projectile regularly
  setInterval( function() {
    createProjectile();
  }, PROJECTILE_SPAWN_RATE);
});


function keydownRouter(e) {
  switch (e.which) {
    case KEYS.spacebar:
      fireSnowball();
      break;
    case KEYS.left:
    case KEYS.right:
      moveSnowman(e.which);
      break;
    default:
      console.log("Invalid input!");
  }
}

// Check for any collisions and remove the appropriate object if needed
function checkCollisions() {
  // First, check for snowball-projectile checkCollisions
  $('.snowball').each( function() {
    var $curSnowball = $(this);  // define a local handle for this snowball
    $('.projectile').each( function() {
      var $curProjectile = $(this);  // define a local handle for this projectile

      // For each snowball and projectile, check for collisions
      if (isColliding($curSnowball,$curProjectile)) {
        // If a snowball and projectile collide, destroy both
        $curSnowball.remove();
        $curProjectile.remove();

        // Score points for hitting an projectile! Smaller projectile --> higher score
        var points = Math.ceil(MAX_PROJECTILE_SIZE-$curProjectile.width()) * SCORE_UNIT;
        // Update the visible score
        SCORE_OBJ.score += points;
      }
    });
  });


  // Next, check for projectile-snowman interactions
  $('.projectile').each( function() {
    var $curProjectile = $(this);
    if (isColliding($curProjectile, snowman)) {
 
      // Remove all game elements
      snowman.remove();
      $('.snowball').remove();  // remove all snowballs
      $('.projectile').remove();  // remove all projectiles

      // Hide primary windows
      gwhGame.hide();
      gwhStatus.hide();

      // Show "Game Over" screen
      gwhOver.show();
    }
  });
}

// Check if two objects are colliding
function isColliding(o1, o2) {
  // Define input direction mappings for easier referencing
  o1D = { 'left': parseInt(o1.css('left')),
          'right': parseInt(o1.css('left')) + o1.width(),
          'top': parseInt(o1.css('top')),
          'bottom': parseInt(o1.css('top')) + o1.height()
        };
  o2D = { 'left': parseInt(o2.css('left')),
          'right': parseInt(o2.css('left')) + o2.width(),
          'top': parseInt(o2.css('top')),
          'bottom': parseInt(o2.css('top')) + o1.height()
        };

  // If horizontally overlapping...
  if ( (o1D.left < o2D.left && o1D.right > o2D.left) ||
       (o1D.left < o2D.right && o1D.right > o2D.right) ||
       (o1D.left < o2D.right && o1D.right > o2D.left) ) {

    if ( (o1D.top > o2D.top && o1D.top < o2D.bottom) ||
         (o1D.top < o2D.top && o1D.top > o2D.bottom) ||
         (o1D.top > o2D.top && o1D.bottom < o2D.bottom) ) {

      // Collision!
      return true;
    }
  }
  return false;
}

// Return a string corresponding to a random HEX color code
function getRandomColor() {
  // Return a random color. Note that we don't check to make sure the color does not match the background
  return '#' + (Math.random()*0xFFFFFF<<0).toString(16);
}

// Handle projectile creation events
function createProjectile() {
  console.log('Spawning projectile...');

  // NOTE: source - http://www.clipartlord.com/wp-content/uploads/2016/04/aestroid.png
  var projectileDivStr = "<div id='a-" + projectileIdx + "' class='projectile'></div>"
  // Add the snowball to the screen
  gwhGame.append(projectileDivStr);
  // Create and projectile handle based on newest index
  var $curProjectile = $('#a-'+projectileIdx);

  projectileIdx++;  // update the index to maintain uniqueness next time

  // Set size of the projectile (semi-randomized)
  var astrSize = (MAX_PROJECTILE_SIZE + MIN_PROJECTILE_SIZE)/2;
  $curProjectile.css('width', astrSize+"px");
  $curProjectile.css('height', astrSize+"px");
  if(Math.random() > 0.5){
    $curProjectile.append("<img src='img/blueBook.png' height='" + astrSize + "'/>")
  } else {
    $curProjectile.append("<img src='img/icicle.png' height='" + astrSize + "'/>")
  }

  // Pick a random starting position within the game window
  var startingPosition = Math.random() * (gwhGame.width()-astrSize);  // Using 50px as the size of the projectile (since no instance exists yet)

  // Set the instance-specific properties
  $curProjectile.css('left', startingPosition+"px");

  // Make the projectiles fall towards the bottom
  setInterval( function() {
    $curProjectile.css('top', parseInt($curProjectile.css('top'))+PROJECTILE_SPEED);
    // Check to see if the projectile has left the game/viewing window
    if (parseInt($curProjectile.css('top')) > (gwhGame.height() - $curProjectile.height())) {
      $curProjectile.remove();
    }
  }, OBJECT_REFRESH_RATE);
}

// Handle "fire" [snowball] events
function fireSnowball() {
  console.log('Firing snowball...');

  // NOTE: source - https://www.raspberrypi.org/learning/microbit-game-controller/images/missile.png
  var snowballDivStr = "<div id='r-" + snowballIdx + "' class='snowball'><img src='img/snowball.png'/></div>";
  // Add the snowball to the screen
  gwhGame.append(snowballDivStr);
  // Create and snowball handle based on newest index
  var curSnowball = $('#r-'+snowballIdx);
  snowballIdx++;  // update the index to maintain uniqueness next time

  // Set vertical position
  curSnowball.css('top', SNOWMAN_OBJ.snowmanStyle.top);
  // Set horizontal position
  var rxPos = SNOWMAN_OBJ.snowmanStyle.left;  // In order to center the snowball, shift by half the div size (recall: origin [0,0] is top-left of div)
  curSnowball.css('left', rxPos+"px");

  // Create movement update handler
  setInterval( function() {
    curSnowball.css('top', parseInt(curSnowball.css('top'))-SNOWBALL_SPEED);
    // Check to see if the snowball has left the game/viewing window
    if (parseInt(curSnowball.css('top')) < curSnowball.height()) {
      //curSnowball.hide();
      curSnowball.remove();
    }
  }, OBJECT_REFRESH_RATE);
}

// Handle snowman movement events
function moveSnowman(arrow) {
  switch (arrow) {
    case KEYS.left:   // left arrow
      SNOWMAN_OBJ.snowmanStyle.left = Math.max(0, SNOWMAN_OBJ.snowmanStyle.left - SNOWMAN_SPEED);
    break;
    case KEYS.right:  // right arrow
      SNOWMAN_OBJ.snowmanStyle.left = Math.min(maxSnowmanPosX, SNOWMAN_OBJ.snowmanStyle.left + SNOWMAN_SPEED);
    break;
  }
}
