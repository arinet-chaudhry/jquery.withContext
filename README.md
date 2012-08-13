jquery.withContext
==================

Globally scope all jQuery selectors.

Example usage:
-------------

```js
var customQuery = jQuery.noConflict().withContext('#custom-container');

(function ($) {
var imgTags = $('img'); // returns only img tags within #custom-container
})(customQuery);

(function ($) {
var context = $.withContext(); // returns '#custom-container'
})(customQuery);
```

Manner behind the madness:
-------------

If you need to use your own version of jQuery within a 3rd party site, this makes interacting with page elements easier by always including a context.

Alternatively, you could also overwrite the default variable:
```js
window.$ = window.jQuery = jQuery.noConflict().withContext('#custom-container');
```