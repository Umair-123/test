/// <reference path="../../jquery-1.8.1.min.js" />

/// <summary>Including this script into a page will automatically hide the address bar on certain mobile browsers (safari, chrome).</summary>
(function() {

    function hideAddressBar() {
        // not including setTimeout will cause issues on iOS safari according to: http://davidwalsh.name/hide-address-bar
        setTimeout(function() {
            // scroll down to 1 pixel from top - this will trigger (some - safari, chrome) mobile browsers to autohide the address bar
            window.scrollTo(0, 1);
        }, 0);
    }

    $(document).ready(hideAddressBar);
    
    // had to remove this as it would jump the page back to the top if the page had already been scrolled
    // (better fix would be to not scroll to 1 if the window has already scrolled)
    // need to determine if this is even necessary? dont browsers save the scroll position?
    //$(window).resize(hideAddressBar);
})();