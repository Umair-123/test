Vista.Countdown = function (container) {

    var startTime,
        timeElement,
        duration,
        redirectUrl,
        intervalId,
        isStopped = false,
        timerRefreshRate = 500; // ms

    (function () {
        timeElement = $(container).find('.time');
        if (!timeElement.length) return;

        startTime = new Date();

        redirectUrl = Vista.Urls.Timeout;
        duration = Vista.Data.Duration;

        intervalId = setInterval(updateTimer, timerRefreshRate);
        updateTimer();
    })();

    this.stop = function () {
        isStopped = true;
        clearInterval(intervalId);
    };

    function updateTimer() {
        if (isStopped) return;
        var elapsed = (new Date() - startTime) / 1000;
        var remaining = duration - elapsed;
        if (remaining < 0.5) { // we need some tolerance here so the timer does not stay on 0 for an extra tick
            clearInterval(intervalId);
            setTimeout(redirect, 10); // so it's possible to have a stop() call go through
        }
        else {
            var minutes = Math.floor(remaining / 60);
            var seconds = Math.floor(remaining - (minutes * 60));
            timeElement.text(zeroPad(minutes) + ':' + zeroPad(seconds));
        }
    }

    function redirect() {
        if (isStopped) return;
        isStopped = true;
        (window.top || window).location = redirectUrl;
    }

    function zeroPad(value) {
        value = '' + (value || '0');
        var length = value.length;
        for (var i = 0; i < 2 - length; i++) value = '0' + value;
        return value;
    }
};
