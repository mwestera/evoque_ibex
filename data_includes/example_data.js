// var shuffleSequence = seq("sel", "intro", sepWith("sep", seq("practice", rshuffle("s1", "s2"))), sepWith("sep", rshuffle("q1", "q2")));
//var shuffleSequence = seq("fragment", "sep", "fragment");   // For now, the only thing to test
var shuffleSequence = sepWith("sep", "fragment");   // For now, the only thing to test
var practiceItemTypes = ["practice"];

var globalBuffer = "INIT";

var defaults = [
    "FragmentForm", {
        text: "",
        phase: "mid",
        saveReactionTime: true,
        continueOnReturn: true,
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
        hideProgressBar: true
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true
    }
];

var texts = [
    [["Until I took it off, I never realized how much I noticed my wedding band (chiming quietly against utensils, loosening its grip when I showered, orbiting my finger secretly throughout the day).",
     "There’s still an indentation where the ring sat for seven years, and I rub the smooth skin daily.",
     "She told me she never took hers off, even when she spent the night with him.",
     "Her voice sounded comforting, almost like an apology.",
     "Two months later, she left for good — laid her ring on the counter.",
     "Mine stayed on for two more years, pressing down, denting my skin, hoping."],
    [[1,3,5], [2,4]]],
    [["Today when I arrived at my community garden plot, it actually looked like a garden.",
    "Not a weedy mess with maybe some stuff growing in it if you know where to look.",
    "We had hit the typical mid-summer mess of fast-growing weeds and no time to do anything about it.",
    "Plus all the rain had made a huge swamp and it was hard to get a moment to work when it wasn't actively pouring.",
    "I put in a bunch of time this past week, and it's paying off.",
    "Along with free-standing non-weed-choked plants, I have now re-planted three of the beds with salad greens, spinach, and chard.",
    "And while the viability of the seeds was questionable, I accidentally unearthed some from the bed I planted 2 days ago and they had already started to sprout!",
    "This marks the first time I have reclaimed the garden from a weed problem and turned it back into a productive garden.",
    "Other years I've never managed to get the late summer planting done.",
    "I would've liked to get salad greens in 3 weeks ago, to harvest baby greens for salads along the way, but I'm still pretty pleased.",
    "I've also got a few ideas for improving the garden next year.",
    "For one thing, the radishes fall down all over the place and make a mess when they go to seed, and they really could be removed once flea-beetle season has passed, which I didn't think to do this year.",
    "They're attracting cool butterflies, but I might be able to do that with some less floppy flowers."],
    [[1,5,9], [2,6,10], [3,7,11], [4,8]]],
]

function generate_items(texts, max_num_questions) {
    var items = [];
    for (var i = 0; i < texts.length; i++) {
        sentences = texts[i][0];
        cuttings = texts[i][1];
        for (var j = 0; j < cuttings.length; j++) {
            cuts = cuttings[j];
            prev_cut = 0
            item = [["fragment", i]]
            for (var h = 0; h <= cuts.length; h++) {
                var text = "";
                if (h == cuts.length) {
                    if (prev_cut < sentences.length) {
                        text = sentences.slice(prev_cut, sentences.length).join(' ');
                    }
                } else if (cuts[h] > 0) {
                    text = sentences.slice(prev_cut, cuts[h]).join(' ');
                    prev_cut = cuts[h];
                }
                if (text != "") {
                    if (h == 0) {   // If it's the first chunk
                        item.push("FragmentForm");
                        item.push({type: "question", phase: "start", text: text});
                    } else { // If it's in the middle or end
                        item.push("FragmentForm");
                        item.push({type: "answer", text: text});
                        for (var k=1; k < max_num_questions; k++) { // Permit space for older questions too
                            item.push("FragmentForm");
                            item.push({type: "answer"});
                        }
                        if (h != cuts.length) {     // Everywhere except last, ask for a new question.
                            item.push("FragmentForm");
                            item.push({type: "question"});
                        }
                    }
                }
            }
            item.push("FragmentForm");
            item.push({type: "answer", text: "", phase: "end"});  // TODO Maybe have a separate "end" form with some questions.
            items.push(item);
        }
    }
    return items;
}


var items = [

    // New in Ibex 0.3-beta-9. You can now add a '__SendResults__' controller in your shuffle
    // sequence to send results before the experiment has finished. This is NOT intended to allow
    // for incremental sending of results -- you should send results exactly once per experiment.
    // However, it does permit additional messages to be displayed to participants once the
    // experiment itself is over. If you are manually inserting a '__SendResults__' controller into
    // the shuffle sequence, you must set the 'manualSendResults' configuration variable to 'true', since
    // otherwise, results are automatically sent at the end of the experiment.
    //
    //["sr", "__SendResults__", { }],

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

    ["intro", "Form", {
        html: { include: "example_intro.html" },
        validators: {
            age: function (s) { if (s.match(/^\d+$/)) return true; else return "Bad value for \u2018age\u2019"; }
        }
    } ],

];

items.push.apply(items, generate_items(texts, 3))
