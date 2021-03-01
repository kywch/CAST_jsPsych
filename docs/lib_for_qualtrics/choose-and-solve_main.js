/**
 * choose-and-solve_main.js
 * Kyoung Whan Choe (https://github.com/kywch/)
 
MIT License

Copyright (c) 2018-2021 Kyoung whan Choe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
 
**/

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* this is an experiment */
//var maadm_experiment = [];

// generic task variables
var sbj_id = ""; // mturk id
var task_id = ""; // the prefix for the save file

var flag_debug = false;
var flag_save = false;
var time_psolve = 7000; // ms
var time_choice = 3000; // ms
var progress_bar =
    "<div class='progress_box'><div class='meter'> <span style='width: 100%'></span></div></div>";

if (flag_debug === false) {
    // not debugging -- actual setting
    var num_block = 5; // # of main blocks X 28 probs per block
    var mindur_psolve = 1500;
} else {
    // debugging
    var num_block = 1;
    var mindur_psolve = 300;
}

// practice-related indices
var curr_prac_word = 0;
var curr_prac_math = 0;
var curr_prac_choice = 0;
var prac_hard_choices = 0; // the number of hard choices
var curr_main_hard = 0;
var curr_block = 0;

// holding the problems
var problem_math = {};
var problem_word = {};
var problem_standby = {};
var problem_current = {};
var option_current = {};

// choice / point-related
var curr_probcate = ""; // math or word
var curr_choice = ""; // easy or hard
var curr_at_stake = 0;
var curr_correct = false;
var point_prac = 0;
var point_main = 0;
var point_block = 0;
var correct_block = 0;

/* ************************************ */
/* Helper functions */
/* ************************************ */

// YOU MUST GET YOUR OWN DROPBOX ACCESS TOKEN for uploading the file to your dropbox
// from https://dropbox.github.io/dropbox-api-v2-explorer/#files_upload
var dropbox_access_token = '';
var save_filename = '/' + task_id + '_' + sbj_id + '.json';

function save_data() {
    // if you prefer json-format, use jsPsych.data.get().json()
    // if you prefer csv-format, use jsPsych.data.get().csv()
    if (flag_debug) {
        console.log("Save data function called.");
        console.log(jsPsych.data.dataAsJSON());
    }
    try {
        if (flag_save) {
            var dbx = new Dropbox.Dropbox({
                fetch: fetch,
                accessToken: dropbox_access_token
            });
            dbx.filesUpload({
                    path: save_filename,
                    mode: 'overwrite',
                    mute: true,
                    contents: jsPsych.data.dataAsJSON()
                })
                .then(function (response) {
                    if (flag_debug) {
                        console.log(response);
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    } catch (err) {
        console.log("Save data function failed.", err);
    }
}

function generateChoiceHTML(option_info) {
    // these should be defined and passed along
    // typeLeft, stakeLeft, typeRight, stakeRight
    if (flag_debug) {
        console.log("generateChoiceHTML: ", option_info);
    }
    var disp_left = "<div class='left_box'></div>";
    var disp_right = "<div class='right_box'></div>";
    if (option_info.stakeLeft > 0) {
        disp_left = "<div class='left_box'><div class='choice_text'>" +
            "<p>" + option_info.typeLeft + "<br>" + option_info.probCate + "</p>" +
            "<p><span class='very-large'>" + option_info.stakeLeft + "</span></p>" +
            "</div></div>";
    }
    if (option_info.stakeRight > 0) {
        disp_right = "<div class='right_box'><div class='choice_text'>" +
            "<p>" + option_info.typeRight + "<br>" + option_info.probCate + "</p>" +
            "<p><span class='very-large'>" + option_info.stakeRight + "</span></p>" +
            "</div></div>";
    }
    return disp_left + disp_right;
}

function getChoiceKeys(option_info) {
    var choice_keys = [];
    if (option_info.stakeLeft > 0) {
        choice_keys.push('i');
    }
    if (option_info.stakeRight > 0) {
        choice_keys.push('p');
    }
    return choice_keys;
}

function debugProblemHTML(prob_info) {
    if (flag_debug) {
        return " (<b>" + prob_info.type + "</b>) ";
    } else {
        return "";
    }
}

function generateProblemHTML(prob_type, prob_info, flag_disp = 'problem') {
    if (flag_debug) {
        console.log("generateProblemHTML: ", prob_type, prob_info);
    }
    if (prob_type == 'math') {
        // answers
        let answer = parseInt(prob_info.num1) * parseInt(prob_info.num2);
        let html_num1 = prob_info.num1;
        let html_num2 = prob_info.num2;
        let html_prob = prob_info.problem;

        // filling up spaces with white 0 s
        if (html_num1.length == 3) {
            html_num1 = "<span style='color:white'>0</span>".concat(html_num1);
        }
        if (html_num2.length == 1) {
            html_num2 = "<span style='color:white'>00</span>".concat(html_num2);
        } else if (html_num2.length == 2) {
            html_num2 = "<span style='color:white'>0</span>".concat(html_num2);
        }
        if (html_prob.length == 3) {
            html_prob = "<span style='color:white'>0</span>".concat(html_prob);
        }
        html_prob = html_prob.replace("?", "<span class='math_square'>&#x25a1;</span>");

        if (flag_disp == 'problem') {
            return "<div class='math_question'><p>" + html_num1 + "</p><p>&times;" + html_num2 +
                "</p><hr>" + html_prob + "</p></div>" +
                "<div class='math_answer'><p><span class='math_alt'>" + prob_info.alt1 +
                "</span> <span class='math_alt'>" + prob_info.alt2 +
                "</span> <span class='math_alt'>" + prob_info.alt3 + "</span></p></div>";

        } else if (flag_disp == 'feedback') {
            answer = answer.toString();
            if (answer.length == 3) {
                answer = "<span style='color:white'>0</span>".concat(answer);
            }
            return "<div class='math_question'><p>" + html_num1 + "</p><p>&times;" + html_num2 +
                "</p><hr>" + answer + "</p></div>";

        } else {
            console.log("Error (generateProblemHTML): Wrong flag_disp.");
            return "<b>Error (generateProblemHTML): Wrong flag_disp.</b>";
        }

    } else if (prob_type == 'word') {
        let html_prob = prob_info.problem;

        html_prob = html_prob.replace(/9/g, "~");
        html_prob = html_prob.replace("?", "<span class='word_square'>&#x25a1;</span>");

        if (flag_disp == 'problem') {
            return "<div class='word_question'><p>" + html_prob + "</p></div>" +
                "<div class='word_answer'><p><span class='word_alt'>" + prob_info.alt1 +
                "</span> <span class='word_alt'>" + prob_info.alt2 +
                "</span> <span class='word_alt'>" + prob_info.alt3 + "</span></p></div>";

        } else if (flag_disp == 'feedback') {
            // require orgword
            return "<div class='word_question'><p>" + prob_info.orgword + "</p></div>";

        } else {
            console.log("Error (generateProblemHTML): Wrong flag_disp.");
            return "<b>Error (generateProblemHTML): Wrong flag_disp.</b>";
        }

    } else {
        console.log("Error (generateProblemHTML): Wrong problem type.");
        return "<b>Error (generateProblemHTML): Wrong problem type.</b>";
    }
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* Task practice - word
  - word instructions
  - use pre-determined problems of varioud difficulty: 1-1-1-2-3-4-5-6-6-7-7-7
  - show timer during the practice, max 7 sec
  - feedback always provided
*/

/* Word practice problems (12): 1-1-1-2-3-4-5-6-6-7-7-7
    wp0143 (1,3) - wp0044 (1,2) - wp0061 (1,1) -
    wp1372 (2,3) - wp0002 (3,1) - wp0018 (4,2) -
    wp1716 (5,1) - wp0013 (6,2) - wp1195 (6,3) -
    wp1279 (7,2) - wp0160 (7,1) - wp0838 (7,3)
*/
// require practice_word_problems, which should have been loaded successfully

var sequence_word_practice = [];

var enter_word_practice_page = {
    type: "text",
    cont_key: [13, 32], // space bar
    text: "<div class = centerbox><p class = block-text>" +
        "Press <strong>Enter</strong> or <strong>Space bar</strong> key to practice word problems.</p>" +
        "<p class = block-text>The instuctions are provided in the next page.</p></div>",
    timing_post_trial: 1000
};
sequence_word_practice.push(enter_word_practice_page);

/* define instructions block */
var word_instruct_page = {
    type: "text",
    data: {
        exp_stage: 'word_instruction'
    },
    cont_key: "p",
    text: "<div class = centerbox>" +
        "<p class = block-text>An incomplete English word, <b>including proper nouns (e.g. the names of specific places)</b>, " +
        "will appear in the center of the screen, and three letters will appear in the lower center of the screen.</p>" +
        "<p class = block-text>Your task is to make the word a correct English word by " +
        "filling in the <b><font color=blue>blue box</font></b> with one of the lower three letters. " +
        "Some letters were replaced with tildes (~) to make problems harder. </p>" +
        "<p class = block-text>Here, you will use 'i', 'o', and 'p' keys to <b>select the left (i), middle (o), and right (p) " +
        "letter</b> as an answer for each question.</p>" +
        "<p class = block-text>Press the correct answer key to continue.</p>" +
        "<div class='word_question'><p>Q~" + "<span class='word_square'>&#x25a1;</span>" + "Z</p></div>" +
        "<div class='word_answer'><p><span class='word_alt'>A</span> <span class='word_alt'>E</span> <span class='word_alt'>I</span></p></div>" +
        "</div>",
    timing_post_trial: 1000
};
sequence_word_practice.push(word_instruct_page);

var start_word_practice_page = {
    type: "text",
    cont_key: "o",
    text: "<div class = centerbox><p class = block-text>" +
        "Now, you will be presented with <b>12</b> word problems of varying difficulty levels.</p> " +
        "<p class = block-text>Each problem must be answered <b>within 7 seconds</b>. " +
        "Please note that the 7 sec timer will be shown to you <b>only</b> during the practice block. </p>" +
        "<p class = block-text><font color=red>If the key doesn't work, just press the same key multiple times.</font></p> " +
        "<p class = block-text>Press &quot;<b>o</b>&quot; key to begin a problem.</p>" +
        "</div>",
    timing_post_trial: 1000,
    data: {
        exp_stage: 'word_practice_block_start'
    },
    on_finish: function() {
        curr_prac_word = 0;
        if (flag_debug) {
            console.log("Starting the word practice ... ");
            console.log("Up next: ", practice_word_problems[curr_prac_word].orgword);
        }
    }
};
sequence_word_practice.push(start_word_practice_page);

// setting up the word practice, using practice_word_problems
for (var ii = 0; ii < practice_word_problems.length; ii++) {
    var problem_page = {
        type: 'single-stim-rev',
        is_html: true,
        timing_response: time_psolve,
        minimum_duration: mindur_psolve,
        choices: ['i', 'o', 'p'], // 73, 79, 80
        stimulus: "<div class = centerbox><p class = block-text>Fill in the <font color=blue>blue box</font> " +
            "to make a correct English word within 7 seconds. " +
            "Some letters were replaced with tildes (~) to make problems harder. " +
            "Use 'i', 'o', 'p' key to choose from the left, middle, and right letter. " +
            "<font color=red>If the key doesn't work, just press the same key multiple times.</font> " +
            debugProblemHTML(practice_word_problems[ii]) + "</p>" +
            generateProblemHTML('word', practice_word_problems[ii]) + progress_bar + "</div>",
        data: {
            exp_stage: 'word_practice',
            prob_id: practice_word_problems[ii].probid
        },
        timing_post_trial: 0,
        on_finish: function(data) {
            // evaluate the response
            if (mapKey(data.key_press) == practice_word_problems[curr_prac_word].answer) {
                curr_correct = true;
            } else {
                curr_correct = false;
            }
        }
    };
    sequence_word_practice.push(problem_page);

    var feedback_page = {
        type: 'text',
        cont_key: [13, 32], // space bar
        timing_post_trial: 1000, // give a 1-sec break
        text: function() {
            let feedback_string = "<span class='very-large'><br><font color='red'>Incorrect.</font></span>";
            if (curr_correct) {
                feedback_string = "<span class='very-large'><br><font color='green'>Correct!</font></span>";
            }
            return "<div class = centerbox><p class = block-text>Fill in the <font color=blue>blue box</font> " +
                "to make a correct English word within 7 seconds. " +
                "Some letters were replaced with tildes (~) to make problems harder. " +
                "Use 'i', 'o', 'p' key to choose from the left, middle, and right letter. " +
                "<font color=red>If the key doesn't work, just press the same key multiple times.</font> " +
                debugProblemHTML(practice_word_problems[curr_prac_word]) + "</p>" +
                generateProblemHTML('word', practice_word_problems[curr_prac_word], 'feedback') +
                '<p class = center-block-text>' + feedback_string + '</p>' +
                '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>' +
                '</div>';
        },
        data: function() {
            return {
                exp_stage: 'word_practice',
                trial_info: 'result',
                prob_id: practice_word_problems[curr_prac_word].probid,
                prob_type: practice_word_problems[curr_prac_word].type, // difficulty
                correct: curr_correct
            };
        },
        on_finish: function(data) {
            curr_prac_word++;
            if (flag_debug) {
                if (curr_prac_word < practice_word_problems.length) {
                    console.log("Up next: ", practice_word_problems[curr_prac_word].orgword);
                }
            }
        }
    };
    sequence_word_practice.push(feedback_page);
}

/*
maadm_experiment.push({
    timeline: sequence_word_practice
});
//*/



/* Task practice - math
  - math instructions
  - use pre-determined problems of varioud difficulty: 1-1-1-2-2-2-3-4-4-5-6-7
  - show timer during the practice, max 7 sec
  - feedback always provided
*/

/* Math practice problems (12): 1-1-1-2-2-2-3-4-4-5-6-7
    mp1487 (1,2) - mp0003 (1,3) - mp1488 (1,1) -
    mp0009 (2,3) - mp0004 (2,2) - mp0005 (2,1) -
    mp0014 (3,1) - mp0013 (4,2) - mp0044 (4,3) -
    mp0011 (5,1) - mp0018 (6,3) - mp0019 (7,2)
*/
// require practice_math_problems, which should have been loaded successfully

var sequence_math_practice = [];

var enter_math_practice_page = {
    type: "text",
    cont_key: [13, 32], // space bar
    text: "<div class = centerbox><p class = block-text>" +
        "Press <strong>Enter</strong> or <strong>Space bar</strong> key to practice math problems.</p>" +
        "<p class = block-text>The instuctions are provided in the next page.</p></div>",
    timing_post_trial: 1000
};
sequence_math_practice.push(enter_math_practice_page);

/* define instructions block */
var math_instruct_page = {
    type: "text",
    data: {
        exp_stage: 'math_instruction'
    },
    cont_key: "i",
    text: "<div class = centerbox>" +
        "<p class = block-text>An incomplete multiplication equation will appear in the center of the screen, " +
        "and three numbers will appear in the lower center of the screen.</p>" +
        "<p class = block-text>Your task is to make the equation correct by filling in the <b><font color=blue>blue box</font></b> with one of the lower three numbers.</p>" +
        "<p class = block-text>Here, you will use 'i', 'o', and 'p' keys to <b>select the left (i), middle (o), and right (p) " +
        "number</b> as an answer for each question.</p>" +
        "<p class = block-text>Press the answer key to continue.</p>" +
        "<div class='math_question'><p><span style='color:white'>0</span>123</p><p>&times;<span style='color:white'>00</span>2</p>" +
        "<hr>" +
        "<span style='color:white'>0</span>2" + "<span class='math_square'>&#x25a1;</span>" + "6</p></div>" +
        "<div class='math_answer'><p><span class='math_alt'>4</span> <span class='math_alt'>5</span> <span class='math_alt'>6</span></p></div>" +
        "</div>",
    timing_post_trial: 1000
};
sequence_math_practice.push(math_instruct_page);

var start_math_practice_page = {
    type: "text",
    cont_key: "o",
    text: "<div class = centerbox><p class = block-text>" +
        "Now, you will be presented with <b>12</b> math problems of varying difficulty levels. " +
        "<p class = block-text>Each problem must be answered <b>within 7 seconds</b>. " +
        "Please note that the 7 sec timer will be shown to you <b>only</b> during the practice block. </p>" +
        "<p class = block-text><font color=red>If the key doesn't work, just press the same key multiple times.</font></p> " +
        "<p class = block-text>Press &quot;<b>o</b>&quot; key to begin a problem.</p>" +
        "</div>",
    timing_post_trial: 1000,
    data: {
        exp_stage: 'math_practice_block_start'
    },
    on_finish: function() {
        curr_prac_math = 0;
        if (flag_debug) {
            let answer = parseInt(practice_math_problems[curr_prac_math].num1) * parseInt(practice_math_problems[curr_prac_math].num2);
            console.log("Starting the math practice ... ");
            console.log("Up next: ", answer);
        }
    }
};
sequence_math_practice.push(start_math_practice_page);

// setting up the word practice, using practice_word_problems
for (var ii = 0; ii < practice_math_problems.length; ii++) {
    var problem_page = {
        type: 'single-stim-rev',
        is_html: true,
        timing_response: time_psolve,
        minimum_duration: mindur_psolve,
        choices: ['i', 'o', 'p'], // 73, 79, 80
        stimulus: "<div class = centerbox><p class = block-text>Fill in the <font color=blue>blue box</font> " +
            "to make the equation correct within 7 seconds. " +
            "Use 'i', 'o', 'p' key to choose from the left, middle, and right option. " +
            "<font color=red>If the key doesn't work, just press the same key multiple times.</font> " +
            debugProblemHTML(practice_math_problems[ii]) + "</p>" +
            generateProblemHTML('math', practice_math_problems[ii]) + '<br><br>' + progress_bar + "</div>",
        data: {
            exp_stage: 'math_practice',
            prob_id: practice_math_problems[ii].probid
        },
        timing_post_trial: 0,
        on_finish: function(data) {
            // evaluate the response
            if (mapKey(data.key_press) == practice_math_problems[curr_prac_math].answer) {
                curr_correct = true;
            } else {
                curr_correct = false;
            }
        }
    };
    sequence_math_practice.push(problem_page);

    var feedback_page = {
        type: 'text',
        cont_key: [13, 32], // space bar
        timing_post_trial: 1000, // give a 1-sec break
        text: function() {
            let feedback_string = "<span class='very-large'><br><font color='red'>Incorrect.</font></span>";
            if (curr_correct) {
                feedback_string = "<span class='very-large'><br><font color='green'>Correct!</font></span>";
            }
            return "<div class = centerbox><p class = block-text>Fill in the <font color=blue>blue box</font> " +
                "to make the equation correct within 7 seconds. " +
                "Use 'i', 'o', 'p' key to choose from the left, middle, and right option. " +
                "<font color=red>If the key doesn't work, just press the same key multiple times.</font> " +
                debugProblemHTML(practice_math_problems[curr_prac_math]) + "</p>" +
                generateProblemHTML('math', practice_math_problems[curr_prac_math], 'feedback') +
                '<p class = center-block-text>' + feedback_string + '</p>' +
                '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>';
        },
        data: function() {
            return {
                exp_stage: 'math_practice',
                trial_info: 'result',
                prob_id: practice_math_problems[curr_prac_math].probid,
                prob_type: practice_math_problems[curr_prac_math].type, // difficulty
                correct: curr_correct
            };
        },
        on_finish: function(data) {
            curr_prac_math++;
            if (flag_debug) {
                if (curr_prac_math < practice_math_problems.length) {
                    let answer = parseInt(practice_math_problems[curr_prac_math].num1) * parseInt(practice_math_problems[curr_prac_math].num2);
                    console.log("Up next: ", answer);
                }
            }
        }
    };
    sequence_math_practice.push(feedback_page);
}

/*
maadm_experiment.push({
    timeline: sequence_math_practice
});
//*/



/* Task practice - math vs word choice
  Problems used here ... all level 1 (Easiest)
   - Math (8): "mp0064", "mp0118", "mp1489", "mp1490", "mp1531", "mp1532", "mp1533", "mp1534"
   - Word (8): "wp0003", "wp0006", "wp0024", "wp0025", "wp0038", "wp0045", "wp0046", "wp0053"
*/
// require practice_choice_math & practice_choice_word, which should have been loaded successfully
//practice_choice_math = shuffle(practice_choice_math);
//practice_choice_word = shuffle(practice_choice_word);

/* The adaptive procedure starts from the practice. */

// for getNextProb and getNextLevel functions to work
// these two variables are necessary
var problem_solved = []; // json data to send to the server
var history_hard = []; // json data to send to the server

function getNextProb(level) {
    // use problem_solved
    // map_level_prob should be one of this ...
    if (map_level_prob[level] === undefined) {
        console.log("Error(getNextProb): unrecognizable problem type, ", level);
        return "Error(getNextProb): unrecognizable problem type.";
    } else {
        let tmplist = map_level_prob[level];
        // from the candidate problems, remove the encountered problems
        for (var pp in problem_solved) {
            var idx = $.inArray(problem_solved[pp], tmplist);
            if (idx > -1) {
                tmplist.splice(idx, 1);
            }
        }
        // in this filtered array, randomly select one problem
        var pid = tmplist[Math.floor(Math.random() * tmplist.length)];
        if (flag_debug) {
            console.log("getNextProb (", level, "): ", problems_json[pid]);
        }
        return problems_json[pid];
    }
}

function getNextLevel(type, history) {
    let seq_level = [];
    let seq_corr = [];
    let next_level = "";
    // extracting only the relevant history
    for (var ii = 0; ii < history.length; ii++) {
        if (type[0] === history[ii].level[0]) { // whether its m or w
            seq_level.push(parseInt(history[ii].level[1]));
            seq_corr.push(history[ii].correct);
        }
    }
    if (seq_level.length < 1) {
        // no history .. then there is no point doing this
        console.log("Warning(getNextLevel): no previous history, so using default -- level 4");
        return type[0] + "4";
    } else if (seq_level.length == 1) {
        // if wrong, drop one level. if not, return the current one
        let last_level = seq_level[0];
        let last_corr = seq_corr[0];
        let tmp_level = last_level;
        if (last_corr == false) {
            tmp_level -= 1;
            tmp_level = Math.max(tmp_level, 1);
        }
        next_level = type[0] + tmp_level.toString();
        if (flag_debug) {
            console.log("getNextLevel (", type, -1, last_level, false, last_corr, "): ", next_level);
        }
    } else {
        // determine the level
        let last_level = seq_level[seq_level.length - 1];
        let last2_level = seq_level[seq_level.length - 2];
        let last_corr = seq_corr[seq_corr.length - 1];
        let last2_corr = seq_corr[seq_corr.length - 2];
        let tmp_level = last_level;
        // if wrong, drop one level
        if (last_corr == false) {
            tmp_level -= 1;
            // minimum level --> 2
            tmp_level = Math.max(tmp_level, 2);
        } else if (last_level == last2_level && last2_corr == true) {
            tmp_level += 1;
            tmp_level = Math.min(tmp_level, 7);
        }
        next_level = type[0] + tmp_level.toString();
        if (flag_debug) {
            console.log("getNextLevel (", type, last2_level, last_level, last2_corr, last_corr, "): ", next_level);
        }
    }
    return next_level;
}


/* define instructions block */
// this is how we define option
var choice_instruct_option = {
    probCate: 'Word',
    typeLeft: 'Easy',
    stakeLeft: 2,
    typeRight: 'Hard',
    stakeRight: 6
};

var practice_warning = "";
var pcate_options = ['Math', 'Word'];
var stake_easy = 2; // this is constant
var stake_hard = [2, 3, 4, 5, 6]; // vs. Easy option_pra
var curr_trial_type = '';
var max_points_block = 108;

var options_per_block = []; // typeLeft, stakeLeft, typeRight, stakeRight
for (var iCate = 0; iCate < pcate_options.length; iCate++) {
    // choice trials
    for (var iStk = 0; iStk < stake_hard.length; iStk++) {
        // Easy on Left
        options_per_block.push({
            probCate: pcate_options[iCate],
            typeLeft: 'Easy',
            stakeLeft: stake_easy,
            typeRight: 'Hard',
            stakeRight: stake_hard[iStk],
            stakeDiff: stake_hard[iStk] - stake_easy
        });
        // Easy on Right
        options_per_block.push({
            probCate: pcate_options[iCate],
            typeLeft: 'Hard',
            stakeLeft: stake_hard[iStk],
            typeRight: 'Easy',
            stakeRight: stake_easy,
            stakeDiff: stake_hard[iStk] - stake_easy
        });
    }

    // no choice trials
    options_per_block.push({
        probCate: pcate_options[iCate],
        typeLeft: '',
        stakeLeft: -1,
        typeRight: 'Hard',
        stakeRight: 5,
        stakeDiff: 5
    });
    options_per_block.push({
        probCate: pcate_options[iCate],
        typeLeft: 'Hard',
        stakeLeft: 5,
        typeRight: '',
        stakeRight: -1,
        stakeDiff: 5
    });
    options_per_block.push({
        probCate: pcate_options[iCate],
        typeLeft: '',
        stakeLeft: -1,
        typeRight: 'Easy',
        stakeRight: 2,
        stakeDiff: 2
    });
    options_per_block.push({
        probCate: pcate_options[iCate],
        typeLeft: 'Easy',
        stakeLeft: 2,
        typeRight: '',
        stakeRight: -1,
        stakeDiff: 2
    });
}

options_per_block = shuffle([...options_per_block]);
console.log("Choice options (practice): ", options_per_block);

var sequence_practice_choice = [];

var enter_choice_practice_page = {
    type: "text",
    cont_key: [13, 32], // space bar
    text: "<div class = centerbox><p class = block-text>" +
        "Press <strong>Enter</strong> or <strong>Space bar</strong> key to practice <i>choose-and-solve</i> trials</p>" +
        "<p class = block-text>The instuctions are provided in the next page.</p></div>",
    timing_post_trial: 1000
};
sequence_practice_choice.push(enter_choice_practice_page);

var choice_instruct_page = {
    type: "text",
    data: {
        exp_stage: 'choice_instruction'
    },
    cont_key: "p",
    text: "<div class = centerbox>" +
        "<p class = block-text>In each trial of the choose-and-solve task, " +
        "you will be provided the option of choosing to solve an easy or hard problem, " +
        "each with it's own reward points. In the example shown below, 2 and 6 " +
        "are the points at stake for the easy and hard problems, respectively.</p> " +
        "<p class = block-text>You should choose what type of problem you want to solve " +
        "otherwise you will be automatically directed to the easy problem with 1 point at stake. " +
        "Then, you will be presented with a problem of your choice, and " +
        "you will earn the points if you get the problem correct.</p>" +
        "<p class = block-text>Press &quot;<b>i</b>&quot; key for the left option " +
        "and &quot;<b>p</b>&quot; key for the right option.</p>" +
        "<p class = block-text>Choose the option with higher points to continue.</p>" +
        generateChoiceHTML(choice_instruct_option) + "</div>",
    timing_post_trial: 1000
};
sequence_practice_choice.push(choice_instruct_page);


var nochoice_instruct_option = {
    probCate: 'Word',
    typeLeft: 'Hard',
    stakeLeft: 5,
    typeRight: '',
    stakeRight: -1
};

var nochoice_instruct_page = {
    type: "text",
    data: {
        exp_stage: 'nochoice_instruction'
    },
    cont_key: "i",
    text: "<div class = centerbox>" +
        "<p class = block-text>Also, you will see no-choice trials, " +
        "in which you will be provided only one option. In the example shown below, " +
        "5 is the points at skate for solving the hard word problem. </p>" +
        "<p class = block-text>You should accept the option by indicating " +
        "where the option is presented using the left or right key. " +
        "You will earn the points if you get the problem correct.</p>" +
        "<p class = block-text>Press &quot;<b>i</b>&quot; key for left " +
        "and &quot;<b>p</b>&quot; key for right.</p>" +
        "<p class = block-text>To continue, please indicate where the option is presented.</p>" +
        generateChoiceHTML(nochoice_instruct_option) + "</div>",
    timing_post_trial: 1000
};
sequence_practice_choice.push(nochoice_instruct_page);


var start_choice_practice_page = {
    type: "text",
    cont_key: "o",
    text: "<div class = centerbox><p class = block-text>" +
        "In this practice block, you will be presented with <b>" + options_per_block.length.toString() + "</b> trials. " +
        "<p class = block-text>In Easy problems, we expect that you will get more than 90% correct. </p>" +
        "<p class = block-text>In Hard problems, the difficulty is adaptive to your competence, " +
        "so that you will perform at about 70% correct for both word and math problems. </p>" +
        "<p class = block-text>Each choice must be made <b>within 3 seconds</b>, " +
        "otherwise you will be automatically directed to the Easy problem with 1 point at stake.</p>" +
        "<p class = block-text>The maximum points you can earn in this block is <b>" + max_points_block.toString() + "</b> points. </p>" +
        "<p class = block-text>Press &quot;<b>o</b>&quot; key to begin a trial.</p>" +
        "</div>",
    timing_post_trial: 1000,
    data: {
        exp_stage: 'choice_practice_block_start'
    },
    on_finish: function() {
        curr_prac_choice = 0;
        correct_block = 0;
        let tmpopt = options_per_block[curr_prac_choice];
        if (flag_debug) {
            console.log("Starting the choose-and-solve ... ");
            console.log("Next options: ", tmpopt.probCate, tmpopt.typeLeft, tmpopt.stakeLeft, tmpopt.typeRight, tmpopt.stakeRight);
        }
    }
};
sequence_practice_choice.push(start_choice_practice_page);

for (var ii = 0; ii < options_per_block.length; ii++) {
    var choice_page = {
        type: 'single-stim-rev',
        is_html: true,
        timing_response: function() {
            option_current = options_per_block[curr_prac_choice];
            if ((option_current.stakeLeft * option_current.stakeRight) > 0) {
                curr_trial_type = 'chc'; // choice (choose-and-solve trial)
                return time_choice;
            } else {
                curr_trial_type = 'noc'; // no-choice (anticipation trial)
                // we will wait until the participant makes the choices
                // so that we don't allow Ps to avoid hard problems by not choosing
                return time_choice * 1000;
            }
        },
        choices: function() {
            // should be ['i', 'p'] for the normal options
            return getChoiceKeys(options_per_block[curr_prac_choice]);
        },
        stimulus: function() {
            if ((option_current.stakeLeft * option_current.stakeRight) > 0) {
                // choice (choose-and-solve trial)
                return "<div class = centerbox><p class = block-text>Choose your option. " +
                    "Press 'i' for the left and 'p' for the right option within 3 seconds.</p>" +
                    generateChoiceHTML(option_current) + "</div>";
            } else {
                // no-choice (anticipation trial)
                // we will wait until the participant makes the choices
                // so that we don't allow Ps to avoid hard problems by not choosing
                return "<div class = centerbox><p class = block-text>Accept the presented option " +
                    "by indicating where it is presented using the left ('i') or right ('p') key.</p>" +
                    generateChoiceHTML(option_current) + "</div>";
            }
        },
        data: function() {
            return {
                exp_stage: 'choice_practice_options',
                prob_cate: option_current.probCate.toLowerCase(),
                option_type: curr_trial_type,
                type_left: option_current.typeLeft.toLowerCase(),
                stake_left: option_current.stakeLeft,
                type_right: option_current.typeRight.toLowerCase(),
                stake_right: option_current.stakeRight,
                stake_diff: option_current.stakeDiff
            };
        },
        timing_post_trial: 1000,
        on_finish: function(data) {
            curr_probcate = option_current.probCate.toLowerCase();
            // evaluate the response
            if (data.rt < 0) { // no response?
                console.log("No choice has been made, automatically choose the easy option.");
                practice_warning = "<p class = block-text><font color='red'><b>WARNING! You have failed to make a choice within 3 seconds, " +
                    "so the Easy option with 1 point at stake was chosen automatically.</b></font></p>";
                curr_choice = "easy";
                curr_at_stake = 1; // late choice is always 1
            } else if (mapKey(data.key_press) == "1") {
                // intentionally chose left
                curr_choice = option_current.typeLeft.toLowerCase();
                curr_at_stake = option_current.stakeLeft;
            } else if (mapKey(data.key_press) == "3") {
                // intentionally chose right
                curr_choice = option_current.typeRight.toLowerCase();
                curr_at_stake = option_current.stakeRight;
            } else {
                console.log("Error(choice_practice_options): unrecognizable subject choice.");
                curr_choice = "????";
                curr_at_stake = -999;
            }
            if (curr_choice == "easy") {
                problem_current = getNextProb(curr_probcate[0] + '1');
            } else if (curr_choice == "hard") {
                problem_current = getNextProb(getNextLevel(curr_probcate, history_hard));
            } else {
                console.log("Error(choice_practice_choice): unrecognizable curr_probcate & curr_choice.");
                return "Error(choice_practice_choice): unrecognizable curr_probcate & curr_choice.";
            }
            if (flag_debug) {
                console.log("Selected: ", curr_probcate, curr_choice, curr_at_stake);
            }
        }
    }
    sequence_practice_choice.push(choice_page);

    var problem_page = {
        type: 'single-stim-rev',
        is_html: true,
        timing_response: time_psolve,
        minimum_duration: mindur_psolve,
        choices: ['i', 'o', 'p'], // 73, 79, 80
        stimulus: function() {
            if (curr_probcate == "math") {
                return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                    "to make the equation correct within 7 seconds. " +
                    "Use 'i', 'o', 'p' key to choose from the left, middle, and right option. " +
                    "If the key doesn't work, just press the same key multiple times. " +
                    debugProblemHTML(problem_current) + "</p>" +
                    generateProblemHTML('math', problem_current) + "</div>";
            } else if (curr_probcate == "word") {
                return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                    "to make a correct English word within 7 seconds. " +
                    "Some letters were replaced with tildes (~) to make problems harder. " +
                    "Use 'i', 'o', 'p' key to choose from the left, middle, and right letter. " +
                    "If the key doesn't work, just press the same key multiple times. " +
                    debugProblemHTML(problem_current) + "</p>" +
                    generateProblemHTML('word', problem_current) + "</div>";
            } else {
                console.log("Error(choice_practice_problem): unrecognizable curr_probcate.");
                return "Error(choice_practice_problem): unrecognizable curr_probcate.";
            }
        },
        data: function() {
            return {
                exp_stage: 'choice_practice_problem',
                prob_cate: curr_probcate,
                option_type: curr_trial_type,
                type_left: option_current.typeLeft.toLowerCase(),
                stake_left: option_current.stakeLeft,
                type_right: option_current.typeRight.toLowerCase(),
                stake_right: option_current.stakeRight,
                stake_diff: option_current.stakeDiff,
                choice: curr_choice,
                prob_id: problem_current.probid,
                prob_type: problem_current.type,
                curr_stake: curr_at_stake
            };
        },
        timing_post_trial: 0,
        on_finish: function(data) {
            // evaluate the response
            if (mapKey(data.key_press) == problem_current.answer) {
                curr_correct = true;
            } else {
                curr_correct = false;
            }
        }
    };
    sequence_practice_choice.push(problem_page);

    var feedback_page = {
        type: 'text',
        cont_key: [13, 32], // space bar
        timing_post_trial: 1000, // give a 1-sec break
        text: function() {
            let feedback_string = "<span class='very-large'><br><font color='red'>Incorrect.</font></span>";
            if (curr_correct) {
                feedback_string = "<span class='very-large'><br><font color='green'>Correct! (+" + curr_at_stake.toString() + ")</font></span>";
                point_prac += curr_at_stake;
            }
            let score_string = "In this block, you earned " + point_prac.toString() + " points and have " +
                (options_per_block.length - curr_prac_choice - 1).toString() + " trials to go."
            if (curr_probcate == "math") {
                return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                    "to make the equation correct within 7 seconds. " +
                    "Use 'i', 'o', 'p' key to choose from the left, middle, and right option. " +
                    "If the key doesn't work, just press the same key multiple times. " +
                    debugProblemHTML(problem_current) + "</p>" +
                    generateProblemHTML('math', problem_current, 'feedback') +
                    '<p class = center-block-text>' + feedback_string + '</p>' +
                    '<p class = center-block-text>' + score_string + '</p>' +
                    '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>';
            } else if (curr_probcate == "word") {
                return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                    "to make a correct English word within 7 seconds. " +
                    "Some letters were replaced with tildes (~) to make problems harder. " +
                    "Use 'i', 'o', 'p' key to choose from the left, middle, and right letter. " +
                    "If the key doesn't work, just press the same key multiple times. " +
                    debugProblemHTML(problem_current) + "</p>" +
                    generateProblemHTML('word', problem_current, 'feedback') +
                    '<p class = center-block-text>' + feedback_string + '</p>' +
                    '<p class = center-block-text>' + score_string + '</p>' +
                    '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>';
            } else {
                console.log("Error(choice_practice_feedback): unrecognizable curr_probcate.");
                return "Error(choice_practice_feedback): unrecognizable curr_probcate.";
            }
        },
        data: function() {
            if (curr_correct) {
                correct_block += 1;
            }
            let prob_id = problem_current.probid;
            let prob_type = problem_current.type;
            problem_solved.push(prob_id);
            if (curr_choice == "hard") {
                history_hard.push({
                    "level": prob_type,
                    "correct": curr_correct
                });
            }
            return {
                exp_stage: 'choice_practice_feedback',
                prob_cate: curr_probcate,
                option_type: curr_trial_type,
                type_left: option_current.typeLeft.toLowerCase(),
                stake_left: option_current.stakeLeft,
                type_right: option_current.typeRight.toLowerCase(),
                stake_right: option_current.stakeRight,
                stake_diff: option_current.stakeDiff,
                choice: curr_choice,
                prob_id: problem_current.probid,
                prob_type: problem_current.type,
                curr_stake: curr_at_stake,
                correct: curr_correct,
                points: point_prac
            };
        },
        on_finish: function(data) {
            curr_prac_choice++;
            practice_warning = "";
            if (flag_debug) {
                if (curr_prac_choice < options_per_block.length) {
                    let tmpopt = options_per_block[curr_prac_choice];
                    console.log("Next options: ", tmpopt.probCate, tmpopt.typeLeft, tmpopt.stakeLeft, tmpopt.typeRight, tmpopt.stakeRight);
                }
            }
        }
    };
    sequence_practice_choice.push(feedback_page);
}

var finish_choice_practice_page = {
    type: "text",
    cont_key: [13, 32], // space bar
    text: function() {
        return "<div class = centerbox><p class = block-text>" +
            "In this practice block, you earned <span class='very-large'><font color='blue'>" +
            point_prac.toString() + "</font></span> out of " + max_points_block.toString() + " points. </p>" +
            "<p class = block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to finish the practice and proceed.</p>" +
            "</div>";
    },
    data: {
        exp_stage: 'choice_practice_block_finish'
    },
    timing_post_trial: 1000,
    on_finish: function() {
        save_data();
    }
};
sequence_practice_choice.push(finish_choice_practice_page);


/*
maadm_experiment.push({
    timeline: sequence_practice_choice
});
//*/

// main block info
var choice_main = []; // format: me (math_easy), mh0-5(math_hard + stake_diff), we (word_easy), wh0-5 (word_hard + stake_diff)
var correct_main = [];
var solvetime_main = [];
var choice_level = [];

var option_main = [];
for (var iB = 0; iB < num_block; iB++) {
    option_main.push(shuffle([...options_per_block]));
}


/* Main task - Hard block */
var enter_mainexp_page = {
    type: "text",
    cont_key: [13, 32], // space bar
    text: function() {
        prac_hard_choices = history_hard.length; // mark the # of hard choices --> will be used later
        return "<div class = centerbox><p class = center-block-text>" +
            "<font color=red><b>ATTENTION!</b></font> Your bonus will be determined based on " +
            "your points earned in the next " + num_block.toString() + " blocks.</p>" +
            "<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start.</p></div>"
    },
    timing_post_trial: 1000
};


function generate_main_block(block_count) {
    // assume that option_main is defined
    var opt_list_name = "option_main[" + block_count.toString() + "]";
    var option_this = eval(opt_list_name);
    var block_sequence = [];
    var flag_feedback = true; // can be passed as an argument if necessary

    var start_main_block_page = {
        type: "text",
        cont_key: "o",
        text: function() {
            curr_main_hard = 0;
            point_block = 0;
            correct_block = 0;
            curr_block = (block_count + 1);
            return "<div class = centerbox><p class = block-text>" +
                "<span class='very-large'>Main block " + curr_block.toString() + " / " + num_block.toString() + "</span></p>" +
                "<p class = block-text>In this block, you will be presented with <b>" +
                option_this.length.toString() + "</b> trials. " +
                "<p class = block-text>In Easy problems, we expect that you will get more than 90% correct. </p>" +
                "<p class = block-text>In Hard problems, the difficulty is adaptive to your competence, " +
                "so that you will perform at about 70% correct for both word and math problems. </p>" +
                "<p class = block-text>Each choice must be made <b>within 3 seconds</b>, " +
                "otherwise you will be automatically directed to the Easy problem with 1 point at stake.</p>" +
                "<p class = block-text>The maximum points you can earn in this block is <b>" +
                max_points_block.toString() + "</b> points. </p>" +
                "<p class = block-text>Press &quot;<b>o</b>&quot; key to begin a trial.</p>" +
                "</div>";
        },
        timing_post_trial: 1000,
        data: {
            exp_stage: 'main_block_' + (block_count + 1).toString() + '_start'
        },
        on_finish: function() {
            console.log("Starting the Main block... ");
            if (flag_debug) {
                let tmpopt = eval(opt_list_name + "[curr_main_hard]");
                console.log("Next options: ", tmpopt.probCate, tmpopt.typeLeft, tmpopt.stakeLeft, tmpopt.typeRight, tmpopt.stakeRight);
            }
        }
    };
    block_sequence.push(start_main_block_page);

    for (var ii = 0; ii < option_this.length; ii++) {
        var choice_page = {
            type: 'single-stim-rev',
            is_html: true,
            timing_response: function() {
                option_current = eval(opt_list_name + "[curr_main_hard]");
            	if ((option_current.stakeLeft * option_current.stakeRight) > 0) {
                	curr_trial_type = 'chc'; // choice (choose-and-solve trial)
                	return time_choice;
            	} else {
                	curr_trial_type = 'noc'; // no-choice (anticipation trial)
                	// we will wait until the participant makes the choices
                	// so that we don't allow Ps to avoid hard problems by not choosing
                	return time_choice * 1000;
            	}
        	},
        	choices: function() {
            	// should be ['i', 'p'] for the normal options
            	return getChoiceKeys(option_current);
        	},
            stimulus: function() {
            	if ((option_current.stakeLeft * option_current.stakeRight) > 0) {
                	// choice (choose-and-solve trial)
                	return "<div class = centerbox><p class = block-text>Choose your option. " +
                    	"Press 'i' for the left and 'p' for the right option within 3 seconds.</p>" +
                    	generateChoiceHTML(option_current) + "</div>";
            	} else {
                	// no-choice (anticipation trial)
                	// we will wait until the participant makes the choices
                	// so that we don't allow Ps to avoid hard problems by not choosing
                	return "<div class = centerbox><p class = block-text>Accept the presented option " +
                    	"by indicating where it is presented using the left ('i') or right ('p') key.</p>" +
                    	generateChoiceHTML(option_current) + "</div>";
            	}
        	},
            data: function() {
                return {
                    exp_stage: 'main_options',
                    prob_cate: option_current.probCate.toLowerCase(),
                    option_type: curr_trial_type,
                    type_left: option_current.typeLeft.toLowerCase(),
                    stake_left: option_current.stakeLeft,
                    type_right: option_current.typeRight.toLowerCase(),
                    stake_right: option_current.stakeRight,
                    stake_diff: option_current.stakeDiff
                };
            },
            timing_post_trial: 1000,
            on_finish: function(data) {
                curr_probcate = option_current.probCate.toLowerCase();
                // evaluate the response
                if (data.rt < 0) { // no response?
                    console.log("No choice has been made, automatically choose the easy option.");
                    practice_warning = "<p class = block-text><font color='red'><b>WARNING! You have failed to make a choice within 3 seconds, " +
                        "so the Easy option with 1 point at stake was chosen automatically.</b></font></p>";
                    curr_choice = "easy";
                    curr_at_stake = 1; // Late choice is always 1
                } else if (mapKey(data.key_press) == "1") {
                    // intentionally chose left
                    curr_choice = option_current.typeLeft.toLowerCase();
                    curr_at_stake = option_current.stakeLeft;
                } else if (mapKey(data.key_press) == "3") {
                    // intentionally chose right
                    curr_choice = option_current.typeRight.toLowerCase();
                    curr_at_stake = option_current.stakeRight;
                } else {
                    console.log("Error(main_options): unrecognizable subject choice.");
                    curr_choice = "????";
                    curr_at_stake = -999;
                }
                if (curr_choice == "easy") {
                    problem_current = getNextProb(curr_probcate[0] + '1');
                    choice_main.push( curr_probcate[0] + curr_choice[0] + option_current.stakeDiff.toString() ); // me or we
                } else if (curr_choice == "hard") {
                    problem_current = getNextProb(getNextLevel(curr_probcate, history_hard));
                    choice_main.push( curr_probcate[0] + curr_choice[0] + option_current.stakeDiff.toString() );
                    choice_level.push(problem_current.type);
                } else {
                    console.log("Error(main_options): unrecognizable curr_probcate & curr_choice.");
                    return "Error(main_options): unrecognizable curr_probcate & curr_choice.";
                }
                if (flag_debug) {
                    console.log("Selected: ", curr_probcate, curr_choice, curr_at_stake);
                }
            }
        }
        block_sequence.push(choice_page);

        var problem_page = {
            type: 'single-stim-rev',
            is_html: true,
            timing_response: time_psolve,
            minimum_duration: mindur_psolve,
            choices: ['i', 'o', 'p'], // 73, 79, 80
            stimulus: function() {
                if (curr_probcate == "math") {
                    return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                        "to make the equation correct within 7 seconds. " +
                        "Use 'i', 'o', 'p' key to choose from the left, middle, and right option. " +
                        "If the key doesn't work, just press the same key multiple times. " +
                        debugProblemHTML(problem_current) + "</p>" +
                        generateProblemHTML('math', problem_current) + "</div>";
                } else if (curr_probcate == "word") {
                    return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                        "to make a correct English word within 7 seconds. " +
                        "Some letters were replaced with tildes (~) to make problems harder. " +
                        "Use 'i', 'o', 'p' key to choose from the left, middle, and right letter. " +
                        "If the key doesn't work, just press the same key multiple times. " +
                        debugProblemHTML(problem_current) + "</p>" +
                        generateProblemHTML('word', problem_current) + "</div>";
                } else {
                    console.log("Error(main_problem): unrecognizable curr_probcate.");
                    return "Error(main_problem): unrecognizable curr_probcate.";
                }
            },
            data: function() {
                return {
                    exp_stage: 'main_problem',
                    prob_cate: curr_probcate,
                    option_type: curr_trial_type,
                    type_left: option_current.typeLeft.toLowerCase(),
                    stake_left: option_current.stakeLeft,
                    type_right: option_current.typeRight.toLowerCase(),
                    stake_right: option_current.stakeRight,
                    stake_diff: option_current.stakeDiff,
                    choice: curr_choice,
                    prob_id: problem_current.probid,
                    prob_type: problem_current.type,
                    curr_stake: curr_at_stake
                };
            },
            timing_post_trial: 0,
            on_finish: function(data) {
                // evaluate the response
                if (mapKey(data.key_press) == problem_current.answer) {
                    curr_correct = true;
                    correct_main.push(true);
                } else {
                    curr_correct = false;
                    correct_main.push(false);
                }
                if (data.rt > 0) {
                    solvetime_main.push( data.rt );
                } else {
                	solvetime_main.push( time_psolve );
                }
            }
        };
        block_sequence.push(problem_page);

        var feedback_page = {
            type: 'text',
            cont_key: [13, 32], // space bar
            timing_post_trial: 1000, // give a 1-sec break
            text: function() {
                if (curr_correct) {
                    point_main += curr_at_stake;
                    point_block += curr_at_stake;
                }
                if (flag_feedback) {
                    let feedback_string = "<span class='very-large'><br><font color='red'>Incorrect.</font></span>";
                    if (curr_correct) {
                        feedback_string = "<span class='very-large'><br><font color='green'>Correct! (+" + curr_at_stake.toString() + ")</font></span>";
                    }
                    let score_string = "In this block, you earned " + point_block.toString() + " points and have " +
                        (option_this.length - curr_main_hard - 1).toString() + " trials to go."
                    if (curr_probcate == "math") {
                        return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                            "to make the equation correct within 7 seconds. " +
                            "Use 'i', 'o', 'p' key to choose from the left, middle, and right option. " +
                            "If the key doesn't work, just press the same key multiple times. " +
                            debugProblemHTML(problem_current) + "</p>" +
                            generateProblemHTML('math', problem_current, 'feedback') +
                            '<p class = center-block-text>' + feedback_string + '</p>' +
                            '<p class = center-block-text>' + score_string + '</p>' +
                            '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>';
                    } else if (curr_probcate == "word") {
                        return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                            "to make a correct English word within 7 seconds. " +
                            "Some letters were replaced with tildes (~) to make problems harder. " +
                            "Use 'i', 'o', 'p' key to choose from the left, middle, and right letter. " +
                            "If the key doesn't work, just press the same key multiple times. " +
                            debugProblemHTML(problem_current) + "</p>" +
                            generateProblemHTML('word', problem_current, 'feedback') +
                            '<p class = center-block-text>' + feedback_string + '</p>' +
                            '<p class = center-block-text>' + score_string + '</p>' +
                            '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>';
                    } else {
                        console.log("Error(main_feedback): unrecognizable curr_probcate.");
                        return "Error(main_feedback): unrecognizable curr_probcate.";
                    }

                } else {
                    let next_string = "No feedback block. You have " + (option_this.length - curr_main_hard - 1).toString() + " trials to go."
                    if (curr_probcate == "math") {
                        return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                            "to make the equation correct within 7 seconds. " +
                            "Use 'i', 'o', 'p' key to choose from the left, middle, and right option. " +
                            "If the key doesn't work, just press the same key multiple times. " +
                            debugProblemHTML(problem_current) + "</p>" +
                            '<p class = center-block-text><br><br>' + next_string + '</p>' +
                            '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>';
                    } else if (curr_probcate == "word") {
                        return "<div class = centerbox>" + practice_warning + "<p class = block-text>Fill in the <font color=blue>blue box</font> " +
                            "to make a correct English word within 7 seconds. " +
                            "Some letters were replaced with tildes (~) to make problems harder. " +
                            "Use 'i', 'o', 'p' key to choose from the left, middle, and right letter. " +
                            "If the key doesn't work, just press the same key multiple times. " +
                            debugProblemHTML(problem_current) + "</p>" +
                            '<p class = center-block-text><br><br>' + next_string + '</p>' +
                            '<p class = center-block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to start the next trial.</p></div>';
                    } else {
                        console.log("Error(main_feedback): unrecognizable curr_probcate.");
                        return "Error(main_feedback): unrecognizable curr_probcate.";
                    }
                }

            },
            data: function() {
                if (curr_correct) {
                    correct_block += 1;
                }
                let prob_id = problem_current.probid;
                let prob_type = problem_current.type;
                problem_solved.push(prob_id);
                if (curr_choice == "hard") {
                    history_hard.push({
                        "level": prob_type,
                        "correct": curr_correct
                    });
                }
                return {
                    exp_stage: 'main_feedback',
                    prob_cate: curr_probcate,
                    option_type: curr_trial_type,
                    type_left: option_current.typeLeft.toLowerCase(),
                    stake_left: option_current.stakeLeft,
                    type_right: option_current.typeRight.toLowerCase(),
                    stake_right: option_current.stakeRight,
                    stake_diff: option_current.stakeDiff,
                    choice: curr_choice,
                    prob_id: problem_current.probid,
                    prob_type: problem_current.type,
                    curr_stake: curr_at_stake,
                    correct: curr_correct,
                    points: point_main,
                    feedback: flag_feedback
                };
            },
            on_finish: function(data) {
                curr_main_hard++;
                practice_warning = "";
                if (flag_debug) {
                    if (curr_main_hard < option_this.length) {
                        let tmpopt = eval(opt_list_name + "[curr_main_hard]");
                        console.log("Next options: ", tmpopt.probCate, tmpopt.typeLeft, tmpopt.stakeLeft, tmpopt.typeRight, tmpopt.stakeRight);
                    }
                }
            }
        };
        block_sequence.push(feedback_page);
    }

    var finish_main_block_page = {
        type: "text",
        cont_key: [13, 32], // space bar
        text: function() {
            let block_finish_str = "start the next block.";
            if (num_block == curr_block) {
                block_finish_str = "finish the task.";
            }
            return "<div class = centerbox><p class = block-text>" +
                "<span class='very-large'>Main block " + curr_block.toString() + " / " + num_block.toString() + "</span></p>" +
                "<p class = block-text>In this block, you earned <span class='very-large'><font color='blue'>" +
                point_block.toString() + "</font></span> out of " + max_points_block.toString() + " points. </p>" +
                "<p class = block-text>So far, you earned <span class='very-large'><font color='blue'>" +
                point_main.toString() + "</font></span> points. </p>" +
                "<p class = block-text>Press <strong>Enter</strong> or <strong>Space bar</strong> key to " +
                block_finish_str + "</div>";
        },
        data: {
            exp_stage: 'main_block_' + (block_count + 1).toString() + '_finish'
        },
        timing_post_trial: 1000,
        on_finish: function() {
            save_data();
        }
    };
    block_sequence.push(finish_main_block_page);

    return block_sequence;
}
