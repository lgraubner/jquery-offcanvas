var expect = chai.expect;

describe("API", function() {

    var $canvas;

    before(function() {
        $canvas = $(document.createElement("div"));
    });

    beforeEach(function() {
        $canvas.offcanvas();
    });

    afterEach(function() {
        $canvas.offcanvas("destroy");
    });

    it("should call #show()", function () {
        var plugin = $canvas.data("plugin_offcanvas");
        plugin.show = sinon.spy();

        $canvas.offcanvas("show");
        expect(plugin.show.called).to.be.ok;
    });

    it("should call #hide()", function () {
        var plugin = $canvas.data("plugin_offcanvas");
        plugin.hide = sinon.spy();

        $canvas.offcanvas("hide");
        expect(plugin.hide.called).to.be.ok;
    });

    it("should call #toggle()", function () {
        var plugin = $canvas.data("plugin_offcanvas");

        plugin.toggle = sinon.spy();

        $canvas.offcanvas("toggle");
        expect(plugin.toggle.called).to.be.ok;
    });
});

describe("Events", function() {

    var $canvas;

    before(function() {
        $canvas = $(document.createElement("div"));
    });

    after(function() {
        $canvas.offcanvas("destroy");
    });

    it("should trigger 'init' event", function() {

        var cb = sinon.spy();

        $canvas.on("init.offcanvas", cb);
        $canvas.offcanvas();

        expect(cb.called).to.be.ok;
    });

    it("should trigger 'show' event", function() {

        var cb = sinon.spy();

        $canvas.on("show.offcanvas", cb);
        $canvas.offcanvas("show");

        expect(cb.called).to.be.ok;
    });

    it("should trigger 'shown' event", function(done) {

        var cb = sinon.spy();

        $canvas.on("shown.offcanvas", cb);

        $canvas.offcanvas("show");
        setTimeout(function() {
            expect(cb.called).to.be.ok;
            done();
        }, $.fn.offcanvas.defaults.duration);

    });

    it("should trigger 'hide' event", function() {

        var cb = sinon.spy();

        $canvas.on("hide.offcanvas", cb);
        $canvas.offcanvas("hide");

        expect(cb.called).to.be.ok;
    });

    it("should trigger 'hidden' event", function(done) {

        var cb = sinon.spy();

        $canvas.on("hidden.offcanvas", cb);
        $canvas.offcanvas("hide");

        setTimeout(function() {
            expect(cb.called).to.be.ok;
            done();
        }, $.fn.offcanvas.defaults.duration);

    });
});

describe("DOM", function() {

    var $canvas;

    before(function() {
        $canvas = $(document.createElement("div"));
        $canvas.offcanvas();
    });

    after(function() {
        $canvas.offcanvas("destroy");
    });

    var pclass = $.fn.offcanvas.defaults.classes.element;

    it("element should be wrapped in a div with class '" + pclass + "'", function() {
        expect($canvas.parent().hasClass(pclass)).to.be.ok;
    });

    var oclass = $.fn.offcanvas.defaults.classes.outer;

    it("should wrap everyting in a div with class '" + oclass + "'", function() {
        expect($("." + oclass)).to.exist;
    });

    var iclass = $.fn.offcanvas.defaults.classes.inner;

    it("should wrap everyting in a div with class '" + iclass + "'", function() {
        expect($("." + iclass)).to.exist;
    });

    it("should add an overlay element", function() {
        expect($("." + $.fn.offcanvas.defaults.classes.overlay)).to.exist;
    });

    var cclass = $.fn.offcanvas.defaults.classes.container;

    it("should add class '" + cclass + "' to container", function() {
        expect($($.fn.offcanvas.defaults.container).hasClass(cclass)).to.be.ok;
    });

    var opclass = $.fn.offcanvas.defaults.classes.open;

    it("should add class '" + opclass + "' to container when opened", function(done) {
        $canvas.on("shown.offcanvas", function() {
            expect($($.fn.offcanvas.defaults.container).hasClass(opclass)).to.be.ok;
            done();
        });
        $canvas.offcanvas("show");
    });
});
