
Vista.Loyalty.MemberMovieFeedback = (function() {

    'use strict';

    var methods = {
        initFacebook: function () {
            var likeButtonClickAction = sendMovieFacebookLike;
            Vista.SocialMedia.Facebook.bindLikeButtonClick(likeButtonClickAction);
        },
        
        initTwitter: function () {
            var tweetButtonClickAction = sendMovieTwitterTweet;
            Vista.SocialMedia.Twitter.bindTweetButtonClick(tweetButtonClickAction);
        }
    };

    function sendMovieFacebookLike(likedUrl) {

        var urlParts = likedUrl.split("/");
        var movieId = urlParts[urlParts.length - 1];

        $.post(Vista.Urls.Loyalty.SendFacebookLikeFeedback, { movieId: movieId });
    }

    function sendMovieTwitterTweet(event) {
        
        var socialMediaDiv = $(event.target).parents("div.social-media-data");
        if (socialMediaDiv.length === 0) {
            return;
        }

        var movieId = socialMediaDiv.find("#MovieId").val();
        $.post(Vista.Urls.Loyalty.SendTwitterTweetFeedback, { movieId: movieId });
    }

    return methods;
})();

// initialise facebook immediately
Vista.Loyalty.MemberMovieFeedback.initFacebook();
// initialise twitter on document ready
$(Vista.Loyalty.MemberMovieFeedback.initTwitter());
