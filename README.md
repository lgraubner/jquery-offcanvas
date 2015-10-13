# jQuery.offcanvas
> An easy to use offcanvas plugin.

This plugin provides an easy way to put content outside of the canvas and reveal it with a click on a button or any desired element. This is a useful pattern for mobile navigations and more.

[Demo](http://lgraubner.github.io/jquery-offcanvas/)

## Dependencies

As this is a jQuery plugin it depends on the [jQuery library](http://jquery.com/) v1.7+. For smooth animations [Velocity.js](https://github.com/julianshapiro/velocity) is used. Both dependencies are required.

## Usage

Initialization:

```JavaScript
$("#offcanvas").offcanvas({
    trigger: ".js-toggle-offcanvas"
});
```

Clicks on the trigger element will toggle the offcanvas.

**Do not try to initialize more than one instance of jQuery.offcanvas on one page!**

### Options

Options can be set on initialization:

```JavaScript
$("#offcanvas").offcanvas({
    trigger: ".js-toggle-offcanvas",
    direction: "left",
    duration: 400
});
```

You can also set options via data-Attributes, which will overwrite the default value and the value specified on initialization:

```HTML
<div id="offcanvas" data-offcanvas-direction="right" data-offcanvas-trigger="#button">
    ...
</div>
```

### classes

Type: `object`  
Default:
```JavaScript
{
    container: "offcanvas",
    inner: "offcanvas-inner",
    open: "offcanvas-open",
    outer: "offcanvas-outer",
    overlay: "offcanvas-overlay"
}
```

Classes which will be applied to the elements.

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

Direction the offcanvas is revealed from. Possible values are `left` and `right`.

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

### trigger

Type: `String`  
Default: `.js-toggle-offcanvas`

CSS selector for the trigger button.

## API

The offcanvas API offers a couple of methods to control the offcanvas. The methods are called like this:

```JavaScript
$("#offcanvas").offcanvas("show");
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
$("#offcanvas").on("shown.offcanvas", function() {
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

To avoid flickering on page load hide the offcanvas element via CSS. It will be automatically shown before the plugin slides it into viewport.

```CSS
#offcanvas {
    display: none;
}
```

You can grey out your content while the offcanvas element is shown. Simply style the `.offcanvas-overlay` element. The following example overlays the content with a black transparent overlay. It will be display with a smooth animation.

```CSS
.offcanvas-overlay {
    background: rgba(0, 0, 0, 0.7);
}
```
