// returns selection, but only when it exists wholly inside the "selector" field
function getSelection() {

    var selection = document.getSelection();

    if (selection.anchorNode == null) return null;

    if (
        selection.anchorNode.parentNode.id == "selector" &&
        selection.focusNode.parentNode.id == "selector" &&
        selection.anchorOffset != selection.focusOffset
    ) {
        // determine start and end character based on anchor (where you click) and focus (where you release)
        start = Math.min(selection.anchorOffset, selection.focusOffset);
        end = Math.max(selection.anchorOffset, selection.focusOffset);

        // TODO: Select only whole words.

        // clear selection:
        if (selection.removeAllRanges) {
            selection.removeAllRanges();
        } else if (selection.empty) {
            selection.empty();
        }

        return [start, end];

    }
    return null;
};

// Called whenever mouse is released
document.onmouseup = document.onkeyup = function() {

    var sel = getSelection();

    // Only do something if you've actually selected something:
    if ( sel != null ) {

        var text = document.getElementById("selector").innerHTML;

        document.getElementById("selection_start").value = sel[0];
        document.getElementById("selection_end").value = sel[1];
        document.getElementById("selected_text").value = text.substring(sel[0], sel[1]);

        globalBuffer = text.substring(sel[0], sel[1]);

        // Add highlighting, store in "highlighter" field displayed behind the "selector".
        document.getElementById("highlighter").innerHTML =
            text.substring(0, sel[0]) +
            '<mark style="color: transparent">' + text.substring(sel[0], sel[1]) + "</mark>" +
            text.substring(sel[1], text.length);
    }
};

define_ibex_controller({
	name: "SelectorForm",

	jqueryWidget: {
		_init: function () {
			this.options.transfer = null; // Remove ’click to continue message’.
            this.options['html'] = this.options['form'] // forward this to the html option for Form
			this.element.VBox({
				options: this.options,
				triggers: [1],
				children: [
					"Fragment", this.options,
					"Form", this.options,
				]
			});
		}
	},

	properties: {},
});
