/**
 * choose-and-solve_qualtrics.js
 * Kyoung Whan Choe (https://github.com/kywch/)
 
MIT License

Copyright (c) 2021 Kyoung whan Choe

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

Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* PLEASE CHECK:
        TO RUN THIS SCRIPT PROPERLY, THE EMBEDDED VARIABLES
        
            points, bonus
            easy_math_cnt, easy_acc_math, easy_RT_math 
            easy_word_cnt, easy_acc_word, easy_RT_word
            hard_math_cnt, hard_level_math, hard_acc_math, hard_RT_math 
            hard_word_cnt, hard_level_word, hard_acc_word, hard_RT_word
            hcp_h2e2_math, hcp_h3e2_math, hcp_h4e2_math, hcp_h5e2_math, hcp_h6e2_math, hcp_h456e2_math
            hcp_h2e2_word, hcp_h3e2_word, hcp_h4e2_word, hcp_h5e2_word, hcp_h6e2_word, hcp_h456e2_word
            cnt_per_cond

        MUST BE DEFINED.
    */

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and loading required resources */
    // `requiredResources` must include all the required JS files
    var task_github = "https://kywch.github.io/CAST_jsPsych/lib_for_qualtrics/"; // https://<your-github-username>.github.io/<your-experiment-name>
    var requiredResources = [
        "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/4.0.30/Dropbox-sdk.min.js",
        task_github + "jquery.min.js",
        task_github + "jspsych.js",
        task_github + "jspsych-text.js",
        task_github + "jspsych-poldrack-instructions.js",
        task_github + "jspsych-single-stim-rev.js",
        task_github + "poldrack_utils.js",
        task_github + "probset.js",
        task_github + "practice_problems.js",
        task_github + "choose-and-solve_main.js"
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 3: Wrapping jsPsych.init() in a function */
    function initExp() {

        // get Mturk participant id
        sbj_id = "${e://Field/workerId}";
        sbj_id = sbj_id.trim();
        if (sbj_id.length == 0) {
            console.log("No participant id. Stopping the experiment.");
            //return false;
        }

        // instruction image location
        var task_instruct_page1 = '<div class = centerbox><p class = block-text>Welcome to the choose-and-solve task!</p></div>';
        var task_instruct_page2 =
            '<div class = centerbox><p class = block-text>This task consists of four parts.</p>  ' +
            '<p class = block-text>Your performance-based cash bonus will be determined in the last block of 140 trials.</p>' +
            '<p class = block-text>1. Word practice (12 problems)</p>' +
            '<p class = block-text>2. Math practice (12 problems)</p>' +
            '<p class = block-text>3. Choose-and-solve practice (28 trials)</p>' +
            '<p class = block-text>4. Five blocks of choose-and-solve trials (140 trials)</p></div>'
        var task_instruct_page = {
            type: 'poldrack-instructions',
            data: {
                exp_stage: 'task_instruction',
                participant: sbj_id,
            },
            pages: [task_instruct_page1, task_instruct_page2],
            allow_keys: false,
            show_clickable_nav: true,
            timing_post_trial: 1000
        };

        // NOTE that the functions used below are defined in `choose-and-solve_main.js` for readability
        var maadm_experiment = [];
        maadm_experiment.push(task_instruct_page);
        maadm_experiment.push({
            timeline: sequence_word_practice
        });
        maadm_experiment.push({
            timeline: sequence_math_practice
        });
        maadm_experiment.push({
            timeline: sequence_practice_choice
        });
        maadm_experiment.push(enter_mainexp_page);
        for (var ii = 0; ii < num_block; ii++) {
            maadm_experiment.push({
                timeline: generate_main_block(ii)
            });
        }

        jsPsych.init({
            display_element: "getDisplayElement",
            timeline: maadm_experiment,
            fullscreen: true,

            on_finish: function () {

                /* Change 4: Summarize the data */

                // generate the key & summary stats
                var cnt_trial_type = {};
                // for math trials
                cnt_trial_type["me0"] = 0; // # of hard math chosen / solved when 2 vs 2
                cnt_trial_type["me2"] = 0; //                no choice trials, easy reward 2
                cnt_trial_type["mh0"] = 0; // # of hard math chosen / solved when 2 vs 2
                cnt_trial_type["mh1"] = 0; //                when 3 vs 2
                cnt_trial_type["mh2"] = 0; //                when 4 vs 2
                cnt_trial_type["mh3"] = 0; //                when 5 vs 2
                cnt_trial_type["mh4"] = 0; //                when 6 vs 2
                cnt_trial_type["mh5"] = 0; //                no choice trials, hard reward 5
                // for word trials
                cnt_trial_type["we0"] = 0; // # of hard word chosen / solved when 2 vs 2
                cnt_trial_type["we2"] = 0; //                no choice trials, easy reward 2
                cnt_trial_type["wh0"] = 0; // # of hard word chosen / solved when 2 vs 2
                cnt_trial_type["wh1"] = 0; //                when 3 vs 2
                cnt_trial_type["wh2"] = 0; //                when 4 vs 2
                cnt_trial_type["wh3"] = 0; //                when 5 vs 2
                cnt_trial_type["wh4"] = 0; //                when 6 vs 2
                cnt_trial_type["wh5"] = 0; //                no choice trials, hard reward 5
                // count the me, mh, we, wh trials
                cnt_trial_type["me_cnt"] = 0;
                cnt_trial_type["mh_cnt"] = 0;
                cnt_trial_type["we_cnt"] = 0;
                cnt_trial_type["wh_cnt"] = 0;
                // count correct trials
                cnt_trial_type["me_corr"] = 0; // # of correct for easy math
                cnt_trial_type["mh_corr"] = 0; //              for hard math
                cnt_trial_type["we_corr"] = 0; //              for easy word
                cnt_trial_type["wh_corr"] = 0; //              for hard word
                // adding problem-solving RTs to get the average
                cnt_trial_type["me_rt"] = 0;
                cnt_trial_type["mh_rt"] = 0;
                cnt_trial_type["we_rt"] = 0;
                cnt_trial_type["wh_rt"] = 0;

                for (var ii = 0; ii < choice_main.length; ii++) {
                    // counting the # of trial types to get the choice probabilities
                    // all the problem types need to be defined above.
                    cnt_trial_type[choice_main[ii]]++;
                    // add up the # of corrects and RT
                    let curr_type = choice_main[ii].substring(0, 2);
                    cnt_trial_type[curr_type + "_cnt"]++;
                    cnt_trial_type[curr_type + "_corr"] += correct_main[ii];
                    cnt_trial_type[curr_type + "_rt"] += solvetime_main[ii];
                }

                var mwlevel = {}; // based on history_hard
                mwlevel["m"] = 0;
                mwlevel["w"] = 0;
                for (var ii = 0; ii < choice_level.length; ii++) {
                    mwlevel[choice_level[ii][0]] += Number(choice_level[ii][1]);
                }
                var rtsum = 0;
                for (var ii = 0; ii < solvetime_main.length; ii++) {
                    // add all the problem-solving RT to see how much time P spent
                    rtsum += solvetime_main[ii];
                }


                /* Change 5: Saving the trial-level data and finishing up */

                // Overall
                Qualtrics.SurveyEngine.setEmbeddedData("points", point_main);
                Qualtrics.SurveyEngine.setEmbeddedData("bonus", point_main); // 1 cent/point

                // easy_math_cnt, easy_acc_math, easy_RT_math 
                Qualtrics.SurveyEngine.setEmbeddedData("easy_math_cnt", cnt_trial_type["me_cnt"] );
                Qualtrics.SurveyEngine.setEmbeddedData("easy_acc_math", (cnt_trial_type["me_corr"]/cnt_trial_type["me_cnt"]).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("easy_RT_math", Math.round(cnt_trial_type["me_rt"]/cnt_trial_type["me_cnt"]) );

                // easy_word_cnt, easy_acc_word, easy_RT_word
                Qualtrics.SurveyEngine.setEmbeddedData("easy_word_cnt", cnt_trial_type["we_cnt"] );
                Qualtrics.SurveyEngine.setEmbeddedData("easy_acc_word", (cnt_trial_type["we_corr"]/cnt_trial_type["we_cnt"]).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("easy_RT_word", Math.round(cnt_trial_type["we_rt"]/cnt_trial_type["we_cnt"]) );

                // hard_math_cnt, hard_level_math, hard_acc_math, hard_RT_math
                Qualtrics.SurveyEngine.setEmbeddedData("hard_math_cnt", cnt_trial_type["mh_cnt"] );
                Qualtrics.SurveyEngine.setEmbeddedData("hard_level_math", (mwlevel["m"]/cnt_trial_type["mh_cnt"]).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hard_acc_math", (cnt_trial_type["mh_corr"]/cnt_trial_type["mh_cnt"]).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hard_RT_math", Math.round(cnt_trial_type["mh_rt"]/cnt_trial_type["mh_cnt"]) );

                // hard_word_cnt, hard_level_word, hard_acc_word, hard_RT_word                
                Qualtrics.SurveyEngine.setEmbeddedData("hard_word_cnt", cnt_trial_type["wh_cnt"] );
                Qualtrics.SurveyEngine.setEmbeddedData("hard_level_word", (mwlevel["w"]/cnt_trial_type["wh_cnt"]).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hard_acc_word", (cnt_trial_type["wh_corr"]/cnt_trial_type["wh_cnt"]).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hard_RT_word", Math.round(cnt_trial_type["wh_rt"]/cnt_trial_type["wh_cnt"]) );

                // hard choice probabilities of math trials : hcp_h2e2_math, hcp_h3e2_math, hcp_h4e2_math, hcp_h5e2_math, hcp_h6e2_math, hcp_h456e2_math
                let numPerCond = 2*num_block;
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h2e2_math", (cnt_trial_type["mh0"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h3e2_math", (cnt_trial_type["mh1"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h4e2_math", (cnt_trial_type["mh2"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h5e2_math", (cnt_trial_type["mh3"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h6e2_math", (cnt_trial_type["mh4"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h456e2_math",
                        ((cnt_trial_type["mh2"]+cnt_trial_type["mh3"]+cnt_trial_type["mh4"])/(3*numPerCond)).toFixed(4) );

                // hard choice probabilities of word trials : hcp_h2e2_word, hcp_h3e2_word, hcp_h4e2_word, hcp_h5e2_word, hcp_h6e2_word, hcp_h456e2_word
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h2e2_word", (cnt_trial_type["wh0"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h3e2_word", (cnt_trial_type["wh1"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h4e2_word", (cnt_trial_type["wh2"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h5e2_word", (cnt_trial_type["wh3"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h6e2_word", (cnt_trial_type["wh4"]/numPerCond).toFixed(4) );
                Qualtrics.SurveyEngine.setEmbeddedData("hcp_h456e2_word",
                        ((cnt_trial_type["wh2"]+cnt_trial_type["wh3"]+cnt_trial_type["wh4"])/(3*numPerCond)).toFixed(4) );

                Qualtrics.SurveyEngine.setEmbeddedData("cnt_per_cond", numPerCond );

                // finishing up
                function sleep(time) {
                    return new Promise((resolve) => setTimeout(resolve, time));
                }

                sleep(500).then(() => {
                    // clear the stage
                    jQuery('.display_stage').remove();
                    jQuery('.display_stage_background').remove();

                    // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                    qthis.clickNextButton();
                });
            }
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
