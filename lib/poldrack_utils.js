

/* Class to track focus shifts during experiment
*  **Requires Jquery**
*
*/
var focus_tracker = function(win) {
  var self = this;
  this.shift_away = 0;

  this.get_shifts = function() {
    return this.shift_away;
  };

  this.reset = function() {
    this.shift_away = 0;
  };

  $(win).blur(function() {
    self.shift_away += 1;
  });
};

var focuser = new focus_tracker(window);


/**
* **For JsPsych Only **
* Adds the experiment ID as well as the number of focus shifts and whether the experiment was in
* full screen during that trial
* @param {exp_id} string to specify the experiment id
*/
function addID(exp_id) {
  var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen || (!window.screenTop && !window.screenY)
	jsPsych.data.addDataToLastTrial({
		exp_id: exp_id,
		full_screen: isFullScreen,
		focus_shifts: focuser.get_shifts()
	})
	focuser.reset()
}

/*
* Adds a display stage rather than the generic jsPsych background element
*/
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body');
  return $('<div class = display_stage></div>').appendTo('body');
}

function clearDisplay() {
  $('.display_stage').remove();
  $('.display_stage_background').remove();
}

/* shuffle is used in many places */
function shuffle(array) {
    let counter = array.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

// look up key codes, ex: 'i'' => 73
function keyLookup(key) {
  if (key == 'i') {
    return 73
  } else if (key == 'o') {
    return 79
  } else if (key == 'p') {
    return 80
  } else {
    return 'Error(keyLookup): No key match!'
  }
}

// look up key codes, ex: 73 => '1'
function mapKey(key) {
  if (key == 73) {
    return "1";
  } else if (key == 79) {
    return "2";
  } else if (key == 80) {
    return "3";
  } else {
    return 'Error(mapKey): No key match!'
  }
}
