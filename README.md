# jQuery.offcanvas
> An easy to use offcanvas plugin.

With this plugin you can easily put content outside of the canvas and reveal it with click on a button or any other element/event. This is useful for mobile navigations and more.

## Dependencies

As this is a jQuery plugin it depends on the jQuery library v1.7+. That's it.

## Usage

Initialization:

```JavaScript
$("#navigation").offcanvas({
    trigger: ".js-toggle-nav",
    direction: "left"
});
```

Clicks on the trigger element will toggle the offcanvas.

**Do not try to initialize more than one instance of jQuery.offcanvas on one page!**

**Tip:** To avoid flickering on page load hide the offcanvas container via CSS.

### Options

Options can be set on initialization:

```JavaScript
$("#container").offcanvas({
    trigger: ".js-toggle-nav",
    direction: "left",
    duration: 300
});
```

You can also set options via data-Attributes, which will overwrite the default value and the value specified on initialization:

```HTML
<div id="container" data-offcanvas-direction="right" data-offcanvas-trigger="#button">
    ...
</div>
```

### coverage

Type: `String`  
Default: `200px`

Width of the offcanvas container which will be revealed.

**Tip:** For better performance avoid using % values.

### direction

Type: `String`  
Default: `left`

Direction the offcanvas is revealed from. Possible values are `left` and `right`.

### trigger

Type: `String`  
Default: `.js-toggle-offcanvas`

CSS selector for the trigger button.

### duration

Type: `number`  
Default: `200`

Duration of the animation.

### classes

Type: `object`  
Default:
```JavaScript
{
        inner: "offcanvas-inner",
        outer: "offcanvas-outer",
        container: "offcanvas",
        open: "offcanvas-open"
}
```

Classes which will be applied to the elements.

## API

The offcanvas API offers a couple of methods to control the offcanvas. The methods are called like this:

```JavaScript
$("#container").offcanvas("show");
```

### show

Shows the offcanvas.

### hide

Hides the offcanvas.

### toggle

Toggles the offcanvas.

### destroy

Destroys the jQuery.offcanvas instance and reverts all DOM changes.

## Events

jQuery.offcanvas fires several events. Simply listen for them with the `jQuery.on` function. All events are namespaced with `offcanvas`.

```JavaScript
$("#container").on("shown.offcanvas", function() {
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
