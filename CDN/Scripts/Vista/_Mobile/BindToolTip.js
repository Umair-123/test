/// <reference path="../../jquery-1.8.1.min.js" />

$(function () {

    var positionClasses = {
        left: 'left',
        right: 'right'
    };

    bindToolTip();
    adjustToolTipPosition();

    // Bind tooltip class to all span.icon
    function bindToolTip() {
        var validationFields = $('span.icon');

        $.each(validationFields, function(index, field) {
            $(field).addClass('tooltip');
        });
    };

    // Adjust whether tooltip pop up from the left or the right.
    function adjustToolTipPosition() {
        var icons = $('span.icon');
        var screenWidth = $(document).width();

        $(icons).on('mouseover', function (event) {
            // Default tooltip width
            var tooltipWidth = 200;

            var hoveredElement = $(event.target);
            var tooltipAlignment = calculateTooltipPosition(hoveredElement.position(), tooltipWidth, screenWidth);

            if (tooltipAlignment === positionClasses.right) {
                hoveredElement.removeClass(positionClasses.left);
                hoveredElement.addClass(tooltipAlignment);
            } else {
                hoveredElement.removeClass(positionClasses.right);
                hoveredElement.addClass(tooltipAlignment);
            }         
        });
    };

    // Calculate how much space is left and return tooltip pop up position
    function calculateTooltipPosition(elementPosition, tooltipWidth, screenWidth) {

        // If there is enough space remaning between the icon position and the screen width
        // Pop up tooltip on the right.
        // Otherwise pop it up on the left.
        var spaceRemainingFromElementPosition = screenWidth - elementPosition.left;     
        if (spaceRemainingFromElementPosition >= tooltipWidth) {
            return positions.right;
        } else {
            return positions.left;
        }
    };
});