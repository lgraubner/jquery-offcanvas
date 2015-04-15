(function(window, document, $, undefined) {
    "use strict";

    $(function() {

        var $nav = $('#navigation');

        $nav.on("show.offcanvas", function() {
            console.log('offcanvas show');
        });

        $nav.on("hide.offcanvas", function() {
            console.log('offcanvas hide');
        });

        $nav.offcanvas({
            trigger: ".js-toggle-nav",
            direction: "left"
        });

        //$nav.offcanvas("destroy");

    });

})(this, document, jQuery);
