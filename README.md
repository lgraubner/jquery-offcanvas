# offcanvas
An easy to use jQuery offcanvas plugin.

## Dependencies

* jQuery

## Usage


Initialize:

```JavaScript
$("#navigation").offcanvas();
```

Initialize with options:

```JavaScript
$("#navigation").offcanvas({
    trigger: ".js-toggle-nav",
    direction: "left"
});
```

API usage:

```JavaScript
// show element
$("#navigation").offcanvas("show");

// hide element
$("#navigation").offcanvas("hide");
```

Listen for events:

```JavaScript
$("#navigation").on("shown.offcanvas", function() {
    // do stuff
});
```

### Options

via data-Attributes

```HTML
<div id="navigation" data-direction="right" data-trigger="#button">
    ...
</div>
```

via Javascript

```JavaScript
$.fn.offcanvas.defaults = {
    coverage: "200px",
    direction: "left",
    trigger: "#nav-trigger",
    container: "body",
    duration: 200,
    classes: {
        inner: "offcanvas-inner",
        outer: "offcanvas-outer",
        container: "offcanvas",
        open: "offcanvas-open"
    }
};
```

### API

* init
* destroy
* show
* hide
* toggle

### Events

* show
* shown
* hide
* hidden
* init

## Tested with
