
Vista.CategoryTabs = function (container, categoryTabSettings) {
    /// <summary>Create a jquery.UI tabs control with unified height.</summary>
    'use strict';

    var $container,
        $categoriesTabList,
        activateEvent,
        setContainerHeightsOn = true;

    activateEvent = function(event, ui) {
    };   
    if (categoryTabSettings) {
        setContainerHeightsOn = categoryTabSettings.setContainerHeights;
        if (categoryTabSettings.onActivate) {
            activateEvent = categoryTabSettings.onActivate;
        }
    }


    (function() {

        $container = $(container);
        $categoriesTabList = $container.find('.categories');
        
        var selectedTabIndex = $categoriesTabList.data('selected-tab-index') || 0;

        if (setContainerHeightsOn) {
            setTabContainerHeights();
        }
        $container.tabs(
            {
                selected: selectedTabIndex,
                activate: activateEvent
            }); // jQuery UI tabs
    }());

    function setTabContainerHeights() {
        ///<summary>
        /// Set each tab items container to be the same height as each other.
        /// Each tab is given the height of the tallest container, or the height
        /// of the tab menu if that is taller than any of the containers.
        ///</summary>


        $categoriesTabList = $container.find('.categories');

        var tabContainerItemHeight = $categoriesTabList.height();

        $container
            .find('.tab')
            .each(function() {
                // find max container height of all the items first
                var height = $(this).height();
                if (height > tabContainerItemHeight)
                    tabContainerItemHeight = height;
            })
            .each(function() {
                // then update the min height of each container
                // min height is set to allow the container to dynamically grow if content is
                // added to it
                $(this).css('min-height', tabContainerItemHeight);
            });
    }
};