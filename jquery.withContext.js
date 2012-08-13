// jQuery with context
(function ($) {
    var lastContext = null;
    var defaultSettings =
        {
            exclusions: [
                document
                , function (selector) { return $.isFunction(selector); }
                , function (selector) {
                    // Don't supply context for html strings
                    var match = false;
                    if (typeof selector === "string") {
                        // IDs (and their children) can be selected directly, regardless of context [you aren't re-using IDs are you?]
                        // HTML strings are created without context
                        if (selector.charAt(0) == '#' || (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3)) {
                            match = true;
                        } else {
                            // Based on jQuery's original expression
                            var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
                            match = quickExpr.test(selector);
                        }
                    }

                    return match;
                }
                , 'document'
                , document.body
                , 'body'
                , document.head
                , 'head'
            ]
        };

    // Based on http://stackoverflow.com/questions/965816/what-jquery-selector-excludes-items-with-a-parent-that-matches-a-given-selector
    $.expr[':'].context = function (elem, index, match) {
        return $(elem).closest(match[3]).length > 0;
    };
    $.withContext = function (defaultContext, settings) {
        if (arguments.length == 0) {
            return lastContext;
        }
        lastContext = defaultContext;
        if (typeof settings !== "undefined" && settings.exclusions)
            $.merge(settings.exclusions, defaultSettings.exclusions);
        settings = $.extend(settings || {}, defaultSettings);
        var exclusionsLength = settings.exclusions.length;

        var checkExclusions = function (selector) {
            var isExclusion = false;
            for (var i = 0; i < exclusionsLength; i++) {
                var match = settings.exclusions[i];
                if ($.isFunction(match)) {
                    if (match(selector)) {
                        isExclusion = true;
                        break;
                    }
                } else if (selector == match) {
                    isExclusion = true;
                    break;
                }
            }

            return isExclusion;
        };

        var contextedjQuery = function (selector, context) {
            // Add context when not dealing with special selectors
            var requiresContext = !checkExclusions(selector);

            /*var originalContext = context;
            var oldStart = new Date().getMilliseconds();*/

            if (requiresContext) {
                if (!context) {
                    context = defaultContext;
                } else {
                    // Ensure our supplied context isn't excluded from being contexted
                    if (!checkExclusions(context)) {
                        context = $(context, defaultContext);
                    }
                }
            }

            var result;
            if (requiresContext)
                result = $(selector, context);
            else
                result = $(selector);

            return result;
        };
        contextedjQuery.fn = contextedjQuery.prototype = $.fn;
        $.extend(true, contextedjQuery, $);
        contextedjQuery.endContext = function () {
            return $;
        };

        return contextedjQuery;
    };
})(jQuery);