# The Choose-And-Solve Task problem set

We created a large pool of 3-alternative choice math and word problems (1,999 math and 1,858 word) for the CAST. 
For details about creating and validating these problems, please see the section, titled "The CAST: Creation and validation of the problem set," in the Supplementary Material file (ChoeEtal2019_aay1062_SM.pdf).

The problem set validation summary:<br>
<img src="https://raw.githubusercontent.com/kywch/CAST_jsPsych/master/problem-set/Summary.gif" width="600"/>

## Description of the problem set CSV files
<img src="https://raw.githubusercontent.com/kywch/CAST_jsPsych/master/problem-set/Problem_format.jpg" width="600"/>

* Math problem: The problem strings contain '?', like <b>'2?84'</b>, which was converted into <font color=blue>the blue square</font>.
* Word problems: The problem strings contain '?' and '9', like <b>'E9?MI9ED'</b> (original word: 'EXAMINED'). The csv file also contains the original words.  
  * '?' was converted into <font color=blue>the blue square</font>. 
  * '9' was converted into '~', which replaced some characters to make problems harder.
