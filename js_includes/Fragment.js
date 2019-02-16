/* This software is licensed under a BSD license; see the LICENSE file for details. */

define_ibex_controller({
    name: "Fragment",

    jqueryWidget: {

        _init: function () {
            this.cssPrefix = this.options._cssPrefix;
            this.utils = this.options._utils;
            this.finishedCallback = this.options._finishedCallback;

            // A trick: place two identical divs, each containing the same text, on top of each other;
            // one will contain the highlighting, the other will be where the user selects text.
            this.html = '<hr>'
            .concat('<div style="height: 150pt">')
            // TODO More principled way of choosing height
            .concat('<div id="highlighter" style="color:transparent; position: absolute; width: 400pt; display: inline-block">')
            .concat(this.options.fragment).concat('</div>')
            .concat('<div id="selector" style="position: relative; width: 400pt; display: inline-block">')
            .concat(this.options.fragment).concat('</div>').concat('</div>')
            .concat('<hr>')
            this.element.addClass(this.cssPrefix + "message");
            this.element.append(htmlCodeToDOM(this.html))

            // Bit of copy/pasting from 'Separator' here.
            this.transfer = dget(this.options, "transfer", "click");
            assert((! this.transfer) || this.transfer == "click" || this.transfer == "keypress" || typeof(this.transfer) == "number",
                   "Value of 'transfer' option of Fragment must either be the string 'click' or a number");

            if (this.transfer == "click") {
                this.continueMessage = dget(this.options, "continueMessage", "Click here to continue.");
            }
            else if (this.transfer == "keypress") {
                var t = this;
                this.safeBind($(document), 'keydown', function () {
                    t.finishedCallback(null);
                    return false;
                });
            }
            else if (typeof(this.transfer) == "number") {
                this.utils.setTimeout(this.finishedCallback, this.transfer);
            }

        }
    },

    properties: {
        obligatory: ["fragment"],
        htmlDescription: function (opts) {
            var d = htmlCodeToDOM(opts.html);
            return truncateHTML(d, 100);
        }
    }
});
