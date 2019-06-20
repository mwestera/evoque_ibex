//var shuffleSequence = seq("consent", "introform", sepWith("sep", "fragment"));
var shuffleSequence = seq(sepWith("sep", "fragment"), "submit", "thanks");    // Without intro
//var shuffleSequence = seq("setcounter", sepWith("sep", "fragment"));    // Without intro, with counter
var practiceItemTypes = ["practice"];

var globalBuffer = "INIT";

var numQuestionsDone = 0;
var numAnswersDone = 0;
var numTextsDone = 0;

var manualSendResults = true;

var defaults = [
    "FragmentForm", {
        text: [],
        phase: "mid",
        saveReactionTime: true,
        continueOnReturn: true,
        excerpt_id: "",
        cutoff_points: [],
        current_chunk: -1,
    },
    "Separator", {
        transfer: 1000,
        normalMessage: "Please wait for the next fragment.",
        errorMessage: "Wrong. Please wait for the next sentence."
    },
    "DashedSentence", {
        mode: "self-paced reading"
    },
    "AcceptabilityJudgment", {
        as: ["1", "2", "3", "4", "5", "6", "7"],
        presentAsScale: true,
        instructions: "Use number keys or click boxes to answer.",
        leftComment: "(Bad)", rightComment: "(Good)"
    },
    "Question", {
        hasCorrect: true
    },
    "Message", {
        hideProgressBar: false
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true
    },
    "TweakedForm", {
        hideProgressBar: false,
        continueOnReturn: true,
        saveReactionTime: true
    },
];


var items = [

    // New in Ibex 0.3-beta-9. You can now add a '__SendResults__' controller in your shuffle
    // sequence to send results before the experiment has finished. This is NOT intended to allow
    // for incremental sending of results -- you should send results exactly once per experiment.
    // However, it does permit additional messages to be displayed to participants once the
    // experiment itself is over. If you are manually inserting a '__SendResults__' controller into
    // the shuffle sequence, you must set the 'manualSendResults' configuration variable to 'true', since
    // otherwise, results are automatically sent at the end of the experiment.
    //
    ["submit", "__SendResults__", { }],

    ["sep", "Separator", { }],

    // New in Ibex 0.3-beta19. You can now determine the point in the experiment at which the counter
    // for latin square designs will be updated. (Previously, this was always updated upon completion
    // of the experiment.) To do this, insert the special '__SetCounter__' controller at the desired
    // point in your running order. If given no options, the counter is incremented by one. If given
    // an 'inc' option, the counter is incremented by the specified amount. If given a 'set' option,
    // the counter is set to the given number. (E.g., { set: 100 }, { inc: -1 })
    //
    //["setcounter", "__SetCounter__", { }],

    // NOTE: You could also use the 'Message' controller for the experiment intro (this provides a simple
    // consent checkbox).

    ["consent",
    "Message", {
        html: { include: "consent.html" },
        },
    ],

    ["thanks",
    "Message", {
        html: "<b>The results were successfully sent to the server. Thank you!</b><br><br><b>Your completion code for Mechanical Turk is: <mark style='font-size: 18pt'>sharkbubbles</mark></b>",
        hideProgressBar: false,
        transfer: null,
        },
    ],

    ["introform",
    "TweakedForm", {
            html: { include: "intro.html" },
            validators: {
                age: function (s) { console.log(s); if (s.match(/^\d+$/)) return true; else return "*"; },
            }
        },
    ],

    // The following is needed to do Latin Square through MTurk.
    // Taken from: https://tmalsburg.github.io/latin-squares-with-ibex.html
    ["setcounter", "__SetCounter__", { }],

[['fragment', 1], "FragmentForm", {type: "question", phase: "start", text: ["Even if we're on 'vacation', potty re-learning goes on.", "There's not much success yet.", "Or must I say, no success yet."], excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "0"}, "FragmentForm", {type: "answer", text: ["He still won't sit on the toilet and do his thing.", "Though he wants me to dump his poopie in the toilet, and insists that he flushes the toilet on his own.", "However yesterday was a different story."], excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "1"}, "FragmentForm", {type: "answer", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "1"}, "FragmentForm", {type: "question", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "1"}, "FragmentForm", {type: "answer", text: ["I was watching Nicktoons, and the little boy was hiding in the closet playing, when he bursted out crying for help.", "And it went like this: Mommy.", "Please help, with clasp hands on his chest, pleading."], excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "2"}, "FragmentForm", {type: "answer", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "2"}, "FragmentForm", {type: "question", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "2"}, "FragmentForm", {type: "answer", text: ["My almost 3yo is really funny and cute.", "Sometimes.", "I don't find him funny and cute when he pesters me."], excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "3"}, "FragmentForm", {type: "answer", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "3"}, "FragmentForm", {type: "question", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "3"}, "FragmentForm", {type: "answer", text: ["So I dashed him to the bathroom with no resistance.", "But as usual, it was too late.", "He did it on his nappy, and it was mushy, since he's back taking antibiotics (oh, not again!"], excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "4"}, "FragmentForm", {type: "answer", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "4"}, "FragmentForm", {type: "question", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "4"}, "FragmentForm", {type: "answer", text: ["), which the hotel doctor prescribed him late Monday night, due to wheezing, that we can hear everytime he breaths.", "He hasn't pooped yet today, so we'll see if I could time it properly; meaning, poopie in the big potty."], excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "5"}, "FragmentForm", {type: "answer", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "5"}, "FragmentForm", {type: "end", phase: "end", excerpt_id: "personabank_a013", cutoff_points: "0 3 6 9 12 15 18", current_chunk: "5"}],


];
