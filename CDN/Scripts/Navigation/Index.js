Vista.NavigationMenu = (function () {
    return {
        init: function () {
            // build the "more" menu for each sub nav
            $(".sub-nav-base ul").each(function () {
                var ul = $(this);
                ul.show();
                buildMoreMenu(ul);
                ul.hide();
            });

            $("#more-nav li").hide();

            $("#main-menu .more-nav-parent, #more-nav").click(function (e) {
                moreNavClicked();
                e.stopImmediatePropagation();
            });

            /* Clicking on anything that is not the a tag itself will close the menu otherwise */
            $("#more-nav li").click(function () {
                var a = $(this).find("a");
               // if (!a.length)
                //    return;
                var href = a.attr("href");
                window.location = href;
            });

            // show the sub nav for the currently selected menu item
            $('.sub-nav.selected').show();
            // center the sub nav for the currently selected menu item (if it exists)
            var selectedTopItem = $('#main-menu li.selected');
            if (selectedTopItem.length)
                centerSubNav(selectedTopItem);

        }
    };

    var moreNavVisible = false;
    function buildMoreMenu(ul) {
        var ulWidth = $("#main-menu").width();
        var moreNav = $("#more-nav");
        var parent = ul.find(".more-nav-parent");

        var total = parent.outerWidth(true);
        var breakout = false;
        var subNavItems = ul.find("li:not(.more-nav-parent)");
        subNavItems.each(function () {
            var li = $(this);
            total += li.outerWidth(true);
            breakout = total > ulWidth;
            if (breakout && moreNav) {
                if (!parent.is(":visible")) {
                    parent.show();
                }
                moreNav.append(li);
            }
        });

        if (breakout) {
            ul.addClass("has-more-nav");
        }
        else {
            var li = $("ul.sub-nav li:visible").last();
            li.css("margin-right", "0px");
        }
    };

    function centerSubNav(parentToCenterUpon) {
        var mainNav = $("#main-menu");
        var base = $(".sub-nav-base");
        var subNav = base.find("ul.sub-nav").filter(function () {
            return $(this).attr("class").indexOf(parentToCenterUpon.attr("id")) != -1;
        });

        var offset = parentToCenterUpon.offset();
        var middle = offset.left + (parentToCenterUpon.width() / 2);
        var subNavBaseWidth = base.width();
        var left = middle - (subNavBaseWidth / 2);
        var mainNavLeftOffset = mainNav.offset().left;

        var total = 0;
        subNav.children().each(function () {
            var listItem = $(this);
            if (listItem.is(":visible"))
                total += listItem.outerWidth(true);
        });
        var subNavWidth = total;

        if (left < mainNavLeftOffset) {
            left = mainNavLeftOffset;
        } else {
            var mainNavWidth = mainNav.width();
            if ((left + subNavWidth) > mainNavWidth + mainNavLeftOffset) {
                left = mainNavWidth + mainNavLeftOffset - subNavWidth;
            }
        }
        var top = base.offset().top;

        base.offset({ left: left, top: top });
        alignMoreNav(subNav);
    };

    /* Aligns the "more" nav dropdown to its parent */
    function alignMoreNav(subNav) {
        if (!subNav.is(".has-more-nav")) {
            return;
        }
        var moreNav = $("#more-nav");
        var parent = subNav.find(".more-nav-parent");
        var offset = parent.offset();
        var left = offset.left;
        var top = offset.top;
        // var maxChildWidth = moreNav.children().first().outerWidth(true);

        var arr = moreNav.children().map(function (i, e) { return $(e).outerWidth(true); }).get();
        var maxChildWidth = Math.max.apply(Math, arr);
        left = left + parent.outerWidth(true) - maxChildWidth;
        top = top + parent.height();
        moreNav.offset({ left: left, top: top });
    };

    function showSubNav(parentId) {
        /* Will also show the more nav LIs */
        var subNav = $("." + parentId);
        subNav.stop(true, true).show();
    };

    function moreNavClicked() {
        if (!moreNavVisible) {
            $("#more-nav").show();
            var subNav = $(".sub-nav:visible");
            subNav.find(".more-nav-parent").addClass("hovered");
            alignMoreNav(subNav);
            $("#more-nav li").hide();
            showSubNav(subNav.find("li:not(.more-nav-parent)").first().attr("class").split(" ")[0]);
            moreNavVisible = true;
            $("html").bind('click', hideMoreNav);
        } else {
            hideMoreNav();
        }
    }
    function hideMoreNav() {
        $("#more-nav").hide();
        moreNavVisible = false;
        $(".more-nav-parent").removeClass("hovered");
        $("html").unbind("click", hideMoreNav);
    }

})();

$(Vista.NavigationMenu.init);