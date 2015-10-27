# jQuery.offcanvas

[![Travis](https://img.shields.io/travis/lgraubner/jquery-offcanvas.svg)](https://travis-ci.org/lgraubner/jquery-offcanvas) [![David Dev](https://img.shields.io/david/dev/lgraubner/jquery-offcanvas.svg)](https://david-dm.org/lgraubner/jquery-offcanvas#info=devDependencies) [![npm](https://img.shields.io/npm/v/jquery-offcanvas.svg)](https://www.npmjs.com/package/jquery-offcanvas)

> An easy to use jQuery offcanvas plugin.

This plugin provides an easy way to put content outside of the canvas and reveal it with a click on a button or any desired element. This is a useful pattern for mobile navigations and more.

[Demo](http://lgraubner.github.io/jquery-offcanvas/) | [Download](https://github.com/lgraubner/jquery-offcanvas/releases/latest)

## Dependencies

As this is a jQuery plugin it depends on the [jQuery library](http://jquery.com/) v1.7+. For smooth animations [Velocity.js](https://github.com/julianshapiro/velocity) is used. Both dependencies are required.

## Usage

You can install this module either with npm or download it manually. Include jQuery, Velocity.js and the plugin before the closing `body` tag:

```HTML
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/velocity-animate/velocity.min.js"></script>
<script src="node_modules/jquery-offcanvas/dist/jquery.offcanvas.min.js"></script>
```

Include the CSS file:

```HTML
<link rel="stylesheet" href="node_modules/jquery-offcanvas/dist/jquery.offcanvas.min.css">
```

If you are not using npm just adjust the paths to match the file locations.

### Initialization

```JavaScript
var $el = $("#element").offcanvas();

$(".offcanvas-trigger").on("click", function() {
    $el.offcanvas("toggle");
});
```

Clicks on the trigger element will toggle the offcanvas element.

**Do not try to initialize more than one instance of jQuery.offcanvas on one page!**

## Options

Options can be set on initialization:

```JavaScript
$("#element").offcanvas({
    direction: "right",
    duration: 400
});
```

You can also set options via data-Attributes, which will overwrite the default value and the value specified on initialization:

```HTML
<div id="element" data-offcanvas-duration="200" data-offcanvas-easing="ease">
    ...
</div>
```

### classes

Type: `object`  
Default:
```JavaScript
{
    container: "offcanvas",
    element: "offcanvas-element",
    inner: "offcanvas-inner",
    open: "offcanvas-open",
    outer: "offcanvas-outer",
    overlay: "offcanvas-overlay"
}
```

Classes which will be applied to the elements.

**If you change class names make sure to update them in the CSS file accordingly.**

### container

Type: `String`  
Default: `body`

Page container, which will be animated.

### coverage

Type: `String`  
Default: `220px`

Width of the offcanvas element which will be revealed.

**Tip:** For better performance avoid using % values.

### direction

Type: `String`  
Default: `left`

Direction the offcanvas element is revealed from. Possible values are `left` and `right`.

### duration

Type: `number`  
Default: `350`

Duration of the animation.

### easing

Type: `String`  
Default: "ease-in-out"

Easing type for show and hide animations. You can use:

- [jQuery UI's easings](http://easings.net/de)
- CSS3's named easings: "ease", "ease-in", "ease-out", and "ease-in-out"

For more easing options check the [Velocity.js documentation](http://julian.com/research/velocity/#easing).

## API

The offcanvas API offers a couple of methods to control the offcanvas element. The methods are called like this:

```JavaScript
$("#element").offcanvas("show");
```

### show

Shows the offcanvas element.

### hide

Hides the offcanvas element.

### toggle

Toggles the offcanvas element.

### destroy

Destroys the jQuery.offcanvas instance and reverts all DOM changes.

## Events

jQuery.offcanvas fires several events. Simply listen for them with the `jQuery.on` function. All events are namespaced with `offcanvas`.

```JavaScript
$("#element").on("shown.offcanvas", function() {
    // do stuff when offcanvas is revealed and animation is finished
});
```

### init

Fired once the Plugin is initialized.

### show

Fired when the `show` method is called.

### shown

Fired when the `show` animation finished.

### hide

Fired when the `hide` method is called.

### hidden

Fired when the `hide` animation finished.

## Tips

You can grey out your content while the offcanvas element is shown. Simply style the `.offcanvas-overlay` element. The following example overlays the content with a black transparent overlay. It will be display with a smooth animation.

```CSS
.offcanvas-overlay {
    background: rgba(0, 0, 0, 0.7);
}
```
