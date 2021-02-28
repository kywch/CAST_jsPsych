/**
 * practice_problems.js
 * Kyoung whan Choe (https://github.com/kywch/)
**/

/* ************************************ */
/* Variable definitions */
/* ************************************ */
// the problems are in the order of appearance
var practice_word_problems = [];
var practice_math_problems = [];
// the problems will be shuffled
var practice_choice_math = [];
var practice_choice_word = [];


/* ************************************ */
/* practice_word_problems */
/* ************************************ */
practice_word_problems.push({
    "probid": "wp0143",
    "type": "w1",
    "problem": "QU?Z",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "3",
    "orgword": "QUIZ"
});
practice_word_problems.push({
    "probid": "wp0044",
    "type": "w1",
    "problem": "N9?SERY",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "2",
    "orgword": "NURSERY"
});
practice_word_problems.push({
    "probid": "wp0061",
    "type": "w1",
    "problem": "PL?N",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "1",
    "orgword": "PLAN"
});
practice_word_problems.push({
    "probid": "wp1372",
    "type": "w2",
    "problem": "A9?WORK",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "3",
    "orgword": "ARTWORK"
});
practice_word_problems.push({
    "probid": "wp0002",
    "type": "w3",
    "problem": "B9?UTY",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "1",
    "orgword": "BEAUTY"
});
practice_word_problems.push({
    "probid": "wp0018",
    "type": "w4",
    "problem": "G9?EN9ICH",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "2",
    "orgword": "GREENWICH"
});
practice_word_problems.push({
    "probid": "wp1716",
    "type": "w5",
    "problem": "O9?IS9IENT",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "1",
    "orgword": "OMNISCIENT"
});
practice_word_problems.push({
    "probid": "wp0013",
    "type": "w6",
    "problem": "S9?CI9LTY",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "2",
    "orgword": "SPECIALTY"
});
practice_word_problems.push({
    "probid": "wp1195",
    "type": "w6",
    "problem": "A9?ER9AT9VELY",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "3",
    "orgword": "ALTERNATIVELY"
});
practice_word_problems.push({
    "probid": "wp1279",
    "type": "w7",
    "problem": "AV?R",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "2",
    "orgword": "AVER"
});
practice_word_problems.push({
    "probid": "wp0160",
    "type": "w7",
    "problem": "P9?IARD",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "1",
    "orgword": "PONIARD"
});
practice_word_problems.push({
    "probid": "wp0838",
    "type": "w7",
    "problem": "T9?EL9GE",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "3",
    "orgword": "TUTELAGE"
});


/* ************************************ */
/* practice_math_problems */
/* ************************************ */
practice_math_problems.push({
    "probid": "mp1487",
    "type": "m1",
    "num1": "101",
    "num2": "3",
    "problem": "30?",
    "alt1": "2",
    "alt2": "3",
    "alt3": "4",
    "answer": "2"
});
practice_math_problems.push({
    "probid": "mp0003",
    "type": "m1",
    "num1": "231",
    "num2": "7",
    "problem": "161?",
    "alt1": "5",
    "alt2": "6",
    "alt3": "7",
    "answer": "3"
});
practice_math_problems.push({
    "probid": "mp1488",
    "type": "m1",
    "num1": "104",
    "num2": "5",
    "problem": "52?",
    "alt1": "0",
    "alt2": "1",
    "alt3": "2",
    "answer": "1"
});
practice_math_problems.push({
    "probid": "mp0009",
    "type": "m2",
    "num1": "110",
    "num2": "8",
    "problem": "8?0",
    "alt1": "6",
    "alt2": "7",
    "alt3": "8",
    "answer": "3"
});
practice_math_problems.push({
    "probid": "mp0004",
    "type": "m2",
    "num1": "155",
    "num2": "9",
    "problem": "139?",
    "alt1": "4",
    "alt2": "5",
    "alt3": "6",
    "answer": "2"
});
practice_math_problems.push({
    "probid": "mp0005",
    "type": "m2",
    "num1": "267",
    "num2": "7",
    "problem": "186?",
    "alt1": "9",
    "alt2": "0",
    "alt3": "1",
    "answer": "1"
});
practice_math_problems.push({
    "probid": "mp0014",
    "type": "m3",
    "num1": "432",
    "num2": "4",
    "problem": "17?8",
    "alt1": "2",
    "alt2": "3",
    "alt3": "4",
    "answer": "1"
});
practice_math_problems.push({
    "probid": "mp0013",
    "type": "m4",
    "num1": "496",
    "num2": "4",
    "problem": "19?4",
    "alt1": "7",
    "alt2": "8",
    "alt3": "9",
    "answer": "2"
});
practice_math_problems.push({
    "probid": "mp0044",
    "type": "m4",
    "num1": "130",
    "num2": "11",
    "problem": "14?0",
    "alt1": "1",
    "alt2": "2",
    "alt3": "3",
    "answer": "3"
});
practice_math_problems.push({
    "probid": "mp0011",
    "type": "m5",
    "num1": "173",
    "num2": "8",
    "problem": "13?4",
    "alt1": "8",
    "alt2": "9",
    "alt3": "0",
    "answer": "1"
});
practice_math_problems.push({
    "probid": "mp0018",
    "type": "m6",
    "num1": "527",
    "num2": "3",
    "problem": "15?1",
    "alt1": "6",
    "alt2": "7",
    "alt3": "8",
    "answer": "3"
});
practice_math_problems.push({
    "probid": "mp0019",
    "type": "m7",
    "num1": "364",
    "num2": "4",
    "problem": "1?56",
    "alt1": "3",
    "alt2": "4",
    "alt3": "5",
    "answer": "2"
});


/* ************************************ */
/* practice_choice_math */
/* ************************************ */
practice_choice_math.push({
    "probid": "mp0064",
    "type": "m1",
    "num1": "111",
    "num2": "6",
    "problem": "66?",
    "alt1": "6",
    "alt2": "7",
    "alt3": "8",
    "answer": "1"
});
practice_choice_math.push({
    "probid": "mp0118",
    "type": "m1",
    "num1": "573",
    "num2": "3",
    "problem": "171?",
    "alt1": "8",
    "alt2": "9",
    "alt3": "0",
    "answer": "2"
});
practice_choice_math.push({
    "probid": "mp1489",
    "type": "m1",
    "num1": "106",
    "num2": "5",
    "problem": "53?",
    "alt1": "8",
    "alt2": "9",
    "alt3": "0",
    "answer": "3"
});
practice_choice_math.push({
    "probid": "mp1490",
    "type": "m1",
    "num1": "107",
    "num2": "3",
    "problem": "32?",
    "alt1": "0",
    "alt2": "1",
    "alt3": "2",
    "answer": "2"
});
practice_choice_math.push({
    "probid": "mp1531",
    "type": "m1",
    "num1": "165",
    "num2": "4",
    "problem": "66?",
    "alt1": "8",
    "alt2": "9",
    "alt3": "0",
    "answer": "3"
});
practice_choice_math.push({
    "probid": "mp1532",
    "type": "m1",
    "num1": "172",
    "num2": "2",
    "problem": "34?",
    "alt1": "3",
    "alt2": "4",
    "alt3": "5",
    "answer": "2"
});
practice_choice_math.push({
    "probid": "mp1533",
    "type": "m1",
    "num1": "175",
    "num2": "2",
    "problem": "35?",
    "alt1": "0",
    "alt2": "1",
    "alt3": "2",
    "answer": "1"
});
practice_choice_math.push({
    "probid": "mp1534",
    "type": "m1",
    "num1": "176",
    "num2": "4",
    "problem": "70?",
    "alt1": "2",
    "alt2": "3",
    "alt3": "4",
    "answer": "3"
});

practice_choice_math.push({
    "probid": "mp1629",
    "type": "m1",
    "num1": "337",
    "num2": "5",
    "problem": "168?",
    "alt1": "5",
    "alt2": "6",
    "alt3": "7",
    "answer": "1"
});

practice_choice_math.push({
    "probid": "mp1630",
    "type": "m1",
    "num1": "345",
    "num2": "2",
    "problem": "69?",
    "alt1": "8",
    "alt2": "9",
    "alt3": "0",
    "answer": "3"
});

practice_choice_math.push({
    "probid": "mp1631",
    "type": "m1",
    "num1": "346",
    "num2": "4",
    "problem": "138?",
    "alt1": "3",
    "alt2": "4",
    "alt3": "5",
    "answer": "2"
});

practice_choice_math.push({
    "probid": "mp1632",
    "type": "m1",
    "num1": "347",
    "num2": "2",
    "problem": "69?",
    "alt1": "4",
    "alt2": "5",
    "alt3": "6",
    "answer": "1"
});


/* ************************************ */
/* practice_choice_word */
/* ************************************ */
practice_choice_word.push({
    "probid": "wp0003",
    "type": "w1",
    "problem": "US?GE",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "1",
    "orgword": "USAGE"
});
practice_choice_word.push({
    "probid": "wp0006",
    "type": "w1",
    "problem": "B9?ZI9IAN",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "1",
    "orgword": "BRAZILIAN"
});
practice_choice_word.push({
    "probid": "wp0024",
    "type": "w1",
    "problem": "B9?DAL",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "3",
    "orgword": "BRIDAL"
});
practice_choice_word.push({
    "probid": "wp0025",
    "type": "w1",
    "problem": "S9?SS9RS",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "3",
    "orgword": "SCISSORS"
});
practice_choice_word.push({
    "probid": "wp0038",
    "type": "w1",
    "problem": "C9?DE9ELLA",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "1",
    "orgword": "CINDERELLA"
});
practice_choice_word.push({
    "probid": "wp0045",
    "type": "w1",
    "problem": "W9?RIOR",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "2",
    "orgword": "WARRIOR"
});
practice_choice_word.push({
    "probid": "wp0046",
    "type": "w1",
    "problem": "B9?MUDA",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "2",
    "orgword": "BERMUDA"
});
practice_choice_word.push({
    "probid": "wp0053",
    "type": "w1",
    "problem": "M9?OR9YCLE",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "3",
    "orgword": "MOTORCYCLE"
});

practice_choice_word.push({
    "probid": "wp0039",
    "type": "w1",
    "problem": "S9?ONYM",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "1",
    "orgword": "SYNONYM"
});

practice_choice_word.push({
    "probid": "wp0131",
    "type": "w1",
    "problem": "T9?SDAY",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "2",
    "orgword": "TUESDAY"
});

practice_choice_word.push({
    "probid": "wp0132",
    "type": "w1",
    "problem": "E9?RG9NCY",
    "alt1": "A",
    "alt2": "E",
    "alt3": "I",
    "answer": "2",
    "orgword": "EMERGENCY"
});

practice_choice_word.push({
    "probid": "wp0234",
    "type": "w1",
    "problem": "L9?TUCE",
    "alt1": "N",
    "alt2": "R",
    "alt3": "T",
    "answer": "3",
    "orgword": "LETTUCE"
});
