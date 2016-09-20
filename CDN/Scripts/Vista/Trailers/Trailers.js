/// <reference path="~/Scripts/jquery.simplemodal.1.4.3.min.js"/>
/*
    Makes a element popup a trailer when clicked
*/
(function ($) {

    $.fn.trailerLauncher = function (template) {

        template = $(template);

        return this.each(function(i, el) {
            var linkToPlay = $(el);

            linkToPlay.bind('click', function (e) {

                e.preventDefault();

                var href = $(this).attr('href') || $(this).data('href');
                if (href.indexOf('youtube.com') != -1) {
                    href = href.replace('watch?v=', '');
                    href = href.replace('www.youtube.com/', '');
                    href = href.replace('https://', '');
                    href = href.replace('http://', '');
                    href = href.replace('embed/', '');
                }

                if (href.indexOf('&') > 0) {
                    href = href.substr(0, href.indexOf('&')); // Strip out any other query string parameters
                }

                var videoElement = template.clone();
                videoElement.find('.player').attr('id', 'player');

                videoElement.modal({
                    overlayClose: true,
                    opacity: 50,
                    modal: true,
                    minHeight: 390,
                    minWidth: 640,
                    containerCss: {
                        backgroundColor: '#2B2725',
                        height: 350,
                        width: 640
                    },
                    overlayCss: {
                        backgroundColor: '#000'
                    },
                    closeHTML: '<button type="button" class="user-action close-trailer"><span class="icon">' + Vista.Localisation.CloseTrailer + '</span></button>',
                    onClose: function () {
                        if (overlay) {
                            overlay.trigger('modalClose');
                        }
                        $.modal.close();
                    }
                });

                var movieId = linkToPlay.data('movie-id'),
                    slider = videoElement.find('.slider'),
                    playbackControls = videoElement.find('.playback-controls'),
                    playButton = videoElement.find(".play-button"),
                    overlay = videoElement.find(".overlay").hide();


                var rate = playbackControls.find('.rate')
                        .loyaltyTrailerRate(movieId)
                        .setValue(linkToPlay.data('liked'));

                rate.on('loyalty::trailerRatingUpdated', function (e, rating) {
                    linkToPlay.data('liked', rating.Liked);
                });

                var player = createNewPlayer(href);
                slider.slider({
                    min: 0
                });

                function createNewPlayer(link) {
                    return new YT.Player('player', {
                        height: '360',
                        width: '640',
                        videoId: link,
                        playerVars: {
                            controls: 0,
                            autohide: 1,
                            modestbranding: 1,
                            rel: 0,
                            showinfo: 0,
                            iv_load_policy: 3,
                            enablejsapi: 1,
                            'wmode': 'opaque'
                        },
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }

                function onPlayerReady(event) {
                    event.target.playVideo();

                    if (player) {
                        playbackControls.show();
                        slider.slider("option", "max", player.getDuration());
                        setInterval(function () {
                            var ctime = Math.floor(player.getCurrentTime());

                            if (ctime) {
                                slider.slider("option", "value", ctime);
                            }
                        }, 1000);
                    }
                }

                var done = false;
                function onPlayerStateChange(event) {
                    if (event.data == YT.PlayerState.PLAYING && !done) {
                        playButton.attr('class', 'play-button pause');
                    }

                    if (event.data == YT.PlayerState.PAUSED && !done) {
                        playButton.attr('class', 'play-button play');
                    }

                    if (event.data == YT.PlayerState.ENDED && !done) {
                        playButton.attr('class', 'play-button play');
                        displayRatingOverlay();
                        player.destroy();
                        done = true;
                    }
                }

                function displayRatingOverlay() {

                    overlay.show()
                        .loyaltyTrailerRate(movieId)
                        .setValue(linkToPlay.data('liked'))
                        .on('loyalty::trailerRatingUpdated', function (e, rating) {
                            linkToPlay.data('liked', rating.Liked);
                        });;

                    playbackControls.hide();
                }

                slider.on("slidestop", function (event, ui) {
                    if (player) {
                        var value = slider.slider("value");
                        player.seekTo(value);
                    }
                });

                playButton.on('click', function () {
                    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                        player.pauseVideo();
                    }

                    if (player.getPlayerState() === YT.PlayerState.PAUSED) {
                        player.playVideo();
                    }
                });

                return false;
            });

            return linkToPlay;
        });

    }

})(jQuery);
