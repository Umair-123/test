$(function () {
    $("body >*").addClass("first-child");

    $("header").css("margin-top", "20px");

    var addHoverClass = function (selector, className, subSelector) {
        $(selector).hover(function () {
            var element = $(this);
            if (subSelector)
                element = element.find(subSelector);
            element.addClass(className);
        }, function () {
            var element = $(this);
            if (subSelector)
                element = element.find(subSelector);
            element.removeClass(className);
        });
    };

    addHoverClass("ul#more-nav li", "more-nav-hover");
    addHoverClass("#main-menu li", "main-menu-hover", "a");
    addHoverClass("#main-menu ul.sub-nav li", "sub-nav-hover");
});