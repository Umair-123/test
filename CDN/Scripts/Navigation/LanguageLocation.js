var languageCookieName = 'UserLanguage';
var locationCookieName = 'visSelectedSiteGroup';

Vista.LanguageLocation = {
    setSiteGroup: function (siteGroup) {
        var expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);
        Vista.Utilities.setCookie(locationCookieName, siteGroup, expiry);
        $('#site-group-set .change-site-group').text(siteGroup);
        $('#site-group-select').hide();
        Vista.LanguageLocation.reloadPage();
    },

    getSiteGroup: function () {
        return Vista.Utilities.getCookie(locationCookieName);
    },

    toggleLanguage: function () {

        var userLanguageContext = Vista.Utilities.getJsonCookie(languageCookieName) || { IsPrimaryLanguage : true };

        userLanguageContext.IsPrimaryLanguage = !userLanguageContext.IsPrimaryLanguage;
        userLanguageContext.UserLanguageTag = null;

        var expiry = new Date();
        expiry.setYear(expiry.getYear() + 10);

        Vista.Utilities.setJsonCookie(languageCookieName, userLanguageContext, expiry);

        Vista.LanguageLocation.reloadPage();
    },

    reloadPage: function () {
        window.location.reload();
    }
};


$(function () {
    $('#site-group').click(function () {
        $('#site-group-select').show();
        $('body').bind('click', hideSiteGroupSelect);
        // returns false so that the body click is not fired afterwards
        return false;
    });

    $('#site-group-select .item').click(function () {
        var item = $(this);
        Vista.LanguageLocation.setSiteGroup(item.text());
    });

    $('#change-language').click(function () {
        Vista.LanguageLocation.toggleLanguage();
    });

    function hideSiteGroupSelect() {
        $('#site-group-select').hide();
        $('body').unbind('click', hideSiteGroupSelect);
    }
});