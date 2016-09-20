/// <reference path="../../jquery-1.8.1.min.js" />

$(function () {

    bindInfoTabsOnClick();  
    createAccordion();

    function bindInfoTabsOnClick() {
        $('.info-tab').on('click', function(event) {
            var tab = $(event.target);
            $(tab).parent().toggleClass('expanded');
        });
    }

    function createAccordion() {
        //TODO - add this back when we fix the google maps issue
        //Hiding the google map in an accordian causes it to load incorrectly
        //Suggest we switch to the JS google maps api
        return; 
        $('.other-information').accordion({
            header: 'div.tab-header',
            heightStyle: 'content',
            collapsible: true,
            animate: {
                easing: 'easeOutExpo',
                duration: 100
            }
        });
    }
});
