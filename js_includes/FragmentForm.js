/* This software is licensed under a BSD license; see the LICENSE file for details. */


define_ibex_controller({
name: "FragmentForm",

jqueryWidget: {
    _init: function () {
        this.cssPrefix = this.options._cssPrefix;
        this.finishedCallback = this.options._finishedCallback;
        this.utils = this.options._utils;
        this.phase = dget(this.options, "phase");
        this.type = dget(this.options, "type");

        if (this.type == "question") {
            this.html = { include: "fragment_question.html" };
        } else if (this.type == "answer") {
            this.html = { include: "fragment_answer.html" };
        }

        // TODO Communicating these through global vars is probably not the proper way
        if (this.phase == "start") {
            window.text_thusfar = "";
            window.text = ""; // to be overwritten below
            window.highlights_thusfar = [];
            window.questions_thusfar = [];
        }

        window.can_skip = dget(this.options, "can_skip");
        var new_text = dget(this.options, "text");
        window.increment = (new_text != "");

        if (window.increment) {
            if (window.text_thusfar != "") {
                window.text_thusfar += " ";
            }
            if (window.text != undefined) {
                window.text_thusfar += window.text;
            }
            window.text = new_text;
        }


//        console.log(window.text_thusfar)
//        console.log(window.text)
//        console.log(window.increment)
//        console.log(window.can_skip)
//        console.log("-----------")

        this.continueOnReturn = dget(this.options, "continueOnReturn", false);
        this.continueMessage = dget(this.options, "continueMessage", "Click here to continue");
        this.checkedValue = dget(this.options, "checkedValue", "yes");
        this.uncheckedValue = dget(this.options, "uncheckedValue", "no");
        this.validators = dget(this.options, "validators", { });
        this.errorCSSClass = dget(this.options, "errorCSSClass", "error");
        this.saveReactionTime = dget(this.options, "saveReactionTime", false);
        this.obligatoryErrorGenerator =
            dget(this.options, "obligatoryErrorGenerator",
                 function (field) { return "The \u2018" + field + "\u2019 field is obligatory."; });
        this.obligatoryCheckboxErrorGenerator =
            dget(this.options, "obligatoryCheckboxErrorGenerator",
                 function (field) { return "You must check the " + field + " checkbox to continue."; });
        this.obligatoryRadioErrorGenerator =
            dget(this.options, "obligatoryRadioErrorGenerator",
                 function (field) { return "You must select an option for \u2018" + field + "\u2019."; });

        var t = this;

        function alertOrAddError(name, error) {
            var ae = $("label." + escape(t.errorCSSClass) + "[for=__ALL_FIELDS__]");
            if (ae.length > 0) {
                ae.addClass(t.cssPrefix + "error-text").text(error);
                return;
            }

            var e = $("label." + escape(t.errorCSSClass) + "[for=" + escape(name) + "]");
            if (e.length > 0)
                e.addClass(t.cssPrefix + "error-text").text(error);
            else
                alert(error);
        }

        var HAS_LOADED = false;

        function handleClick(dom) {
            return function (e) {
                if ( !quality_check() ) return false;    // TODO This is probably ugly: it refers to the a function defined in the form's html file...

                var answerTime = new Date().getTime();

                e.preventDefault();
                if (! HAS_LOADED) return;

                // Get rid of any previous errors.
                $("." + t.cssPrefix + "error-text").empty();

                var rlines = [];

                var inps = $(dom).find("input[type=text]");
                var tas = $(dom).find("textarea");
                for (var i = 0; i < tas.length; ++i) { inps.push(tas[i]); }

                for (var i = 0; i < inps.length; ++i) {
                    var inp = $(inps[i]);

                    if (inp.hasClass("obligatory") && ((! inp.attr('value')) || inp.attr('value').match(/^\s*$/))) {
                        alertOrAddError(inp.attr('name'), t.obligatoryErrorGenerator(inp.attr('name')));
                        return;
                    }

                    if (t.validators[inp.attr('name')]) {
                        var er = t.validators[inp.attr('name')](inp.attr('value'));
                        if (typeof(er) == "string") {
                            alertOrAddError(inp.attr('name'), er);
                            return;
                        }
                    }

                    rlines.push([["Field name", csv_url_encode(inp.attr('name'))],
                                 ["Field value", csv_url_encode(inp.attr('value'))]]);
                }

                var checks = $(dom).find("input[type=checkbox]");
                for (var i = 0; i < checks.length; ++i) {
                    var check = $(checks[i]);

                    // Checkboxes with the 'obligatory' class must be checked.
                    if (! check.attr('checked') && check.hasClass('obligatory')) {
                        alertOrAddError(check.attr('name'), t.obligatoryCheckboxErrorGenerator(check.attr('name')));
                        return;
                    }

                    rlines.push([["Field name", check.attr('name')],
                                 ["Field value", check.attr('checked') ? t.checkedValue : t.uncheckedValue]]);
                }

                var rads = $(dom).find("input[type=radio]");
                // Sort by name.
                var rgs = { };
                for (var i = 0; i < rads.length; ++i) {
                    var rad = $(rads[i]);
                    if (rad.attr('name')) {
                        if (! rgs[rad.attr('name')])
                            rgs[rad.attr('name')] = [];
                        rgs[rad.attr('name')].push(rad);
                    }
                }
                for (k in rgs) {
                    // Check if it's oblig.
                    var oblig = false;
                    var oneIsSelected = false;
                    var oneThatWasSelected;
                    var val;
                    for (var i = 0; i < rgs[k].length; ++i) {
                        if (rgs[k][i].hasClass('obligatory')) oblig = true;
                        if (rgs[k][i].attr('checked')) {
                            oneIsSelected = true;
                            oneThatWasSelected = i;
                            val = rgs[k][i].attr('value');
                        }
                    }
                    if (oblig && (! oneIsSelected)) {
                        alertOrAddError(rgs[k][0].attr('name'), t.obligatoryRadioErrorGenerator(rgs[k][0].attr('name')));
                        return;
                    }
                    if (oneIsSelected) {
                        rlines.push([["Field name", rgs[k][0].attr('name')],
                                     ["Field value", rgs[k][oneThatWasSelected].attr('value')]]);
                    }
                }

                if (t.saveReactionTime) {
                    rlines.push([["Field name", "_REACTION_TIME_"],
                                 ["Field value", answerTime - t.creationTime]]);
                }
                t.finishedCallback(rlines);
            }
        }

        var dom = htmlCodeToDOM(this.html, function (dom) {
            HAS_LOADED = true;

            if (t.continueOnReturn) {
                t.safeBind($(dom).find("input[type=text]"), 'keydown', function (e) { if (e.keyCode == 13) { console.log("H"); return handler(e);  } });
            }
        });
        var handler = handleClick(dom);

        this.element.append(dom);

        if (this.continueMessage) {
            this.element.append($('<div id="div_containing_continue-link" style="visibility: hidden"><p>').append($('<a id="continue_link">').attr('href', '').text("\u2192 " + this.continueMessage)
                                                .addClass(ibex_controller_name_to_css_prefix("Message") + "continue-link")
                                                .click(handler)));
        }

        this.creationTime = new Date().getTime();
    }
},

properties: {
    obligatory: ["phase", "text"],
    countsForProgressBar: false,
    htmlDescription: function (opts) {
        return htmlCodeToDOM(opts.html);
    }
}
});



// Some more custom code:

// Helper function for delayed hiding/showing
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function for flashing an element and then displaying
async function flashMessage(e) {
    e.style.visibility = "visible";
    await sleep(500);
    e.style.visibility = "hidden";
    await sleep(300);
    e.style.visibility = "visible";
    await sleep(500);
}

async function addTypedText(e, s) {
    for ( var i = 0; i < s.length; i++ ) {
        e.innerHTML += s.charAt(i);
        await sleep(3);
    }
}

// returns selection, but only when it exists wholly inside the "selector" field, and later than from_idx
function getSelection(selector_field, selector_from_idx) {

    var selection = document.getSelection();

    if (selection.anchorNode == null) return null;

    if (
        selection.anchorNode.parentNode == selector_field &&
        selection.focusNode.parentNode == selector_field &&
        selection.anchorOffset != selection.focusOffset
    ) {

        // determine start and end character based on anchor (where you click) and focus (where you release)
        start = Math.min(selection.anchorOffset, selection.focusOffset)+1;
        end = Math.max(selection.anchorOffset, selection.focusOffset)-1;

        // Select only whole words.
        var text = selector_field.innerHTML;
        while (start > 0) {
            if (text[start-1] == " " || text[start-1] == "’") {
                break;
            }
            start -= 1;
        }
        while (end < text.length) {
            if (text[end] == " " || text[end] == "," || text[end] == "." || text[end] == ";" || text[end] == ":" || text[end] == ")" || text[end] == "'" || text[end] == '"' || text[end] == "’" || text[end] == "”") {
                break;
            }
            end += 1;
        }

        // clear selection:
        if (selection.removeAllRanges) {
            selection.removeAllRanges();
        } else if (selection.empty) {
            selection.empty();
        }

        // Select only in appropriate region.
        if (start < selector_from_idx) {
            return null;
        };

        return [start, end];

    }
    return null;
};

// Called whenever mouse is released, used only for grabbing selection
document.onmouseup = document.onkeyup = function() {

    var sel = getSelection(window.selector, window.selector_fromidx);
    // Only do something if you've actually selected something (in the proper field):
    if ( sel != null ) {

        var text = window.selector.innerHTML;

        document.getElementById("selection_start").value = sel[0];
        document.getElementById("selection_end").value = sel[1];
        document.getElementById("selection_text").value = text.substring(sel[0], sel[1]);

        // Add highlighting, store in "highlighter" field displayed behind the "selector".
        document.getElementById("fragment_highlighter").innerHTML =
            text.substring(0, sel[0]) +
            '<mark style="color: transparent; background-color: #76bef8">' + text.substring(sel[0], sel[1]) + "</mark>" +
            text.substring(sel[1], text.length);

    }
};

// To be defined in form htmls
var selector = null;
var selector_fromidx = null;
var radio_buttons_yesno = [];
var radio_buttons_5 = [];

// For keyboard shortcuts of radio buttons
window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    var name = document.activeElement.name;

    if (isInArray(name, radio_buttons_5)) {
        if (key >= 49 && key <= 53) {

            key = key - 48;

            document.getElementById(name + key).click();
        }
    } else if (isInArray(name, radio_buttons_yesno)) {
        if (key == 49 || key == 89) {
            key = "yes"
        } else if (key == 50 || key == 48 || key == 78) {
            key = "no"
        }
        if (key == "yes" || key == "no") {
            document.getElementById(name + "_" + key).click()
        }
    }
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}


async function init() {

    if (window.text_thusfar != "") {
        window.text_thusfar += " ";
        document.getElementById("fragment_selector").innerHTML = window.text_thusfar;
        document.getElementById("fragment_colorizer").innerHTML = '<font color="#888888">' + window.text_thusfar + "</font>";
        document.getElementById("fragment_highlighter").innerHTML = window.text_thusfar;
        document.getElementById("fragment_highlighter_prev").innerHTML = "";
        var j = 0;
        for (var i = 0; i < window.highlights_thusfar.length; i++) {
            highlight = window.highlights_thusfar[i];
            document.getElementById("fragment_highlighter_prev").innerHTML += window.text_thusfar.substring(0, highlight[0]);
            document.getElementById("fragment_highlighter_prev").innerHTML += '<mark style="color: transparent; background-color: #E2F1FD">' + window.text_thusfar.substring(highlight[0], highlight[1]) + "</mark>"
            j = highlight[1]
        }
        document.getElementById("fragment_highlighter_prev").innerHTML += window.text_thusfar.substring(j, text_thusfar.length+1);
    }

    // Now load the rest of the fragment
    document.getElementById("fragment_highlighter_prev").innerHTML += window.text;
    document.getElementById("fragment_highlighter").innerHTML += window.text;
    document.getElementById("fragment_selector").innerHTML += window.text;
    if (window.increment) {
        await addTypedText(document.getElementById("fragment_colorizer"), window.text);
    } else {
        document.getElementById("fragment_colorizer").innerHTML += window.text;
    }

    if (!window.increment) {    // Needed to avoid error due to following element not yet existing?!
        await sleep(300);
    }

    document.getElementById("div_containing_continue-link").style.visibility = "visible";

    revealForm();

};
