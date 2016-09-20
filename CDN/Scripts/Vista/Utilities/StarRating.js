/*
    
    Adds a star rating controll to an element.

*/
(function ($) {
    'use strict';

    if ($.fn.starRating) {
        return;
    }

    $.fn.starRating = function(o) {

        if (this.length == 0) {
            return this;
        }
        if (this.length > 1) {
            return this.each(
				function () {
				    $(this).starRating(o);
				}
			);
        }

        var $wrapper = this,
            initialized = true,
            current = $wrapper.find('.current');

        var getStars = function () {
            var stars = '';
            for (var i = 0; i < 10; i++) {
                stars += '<div class="star-wrapper"><div class="star"></div></div>';
            }
            return stars;
        }

        var updateStars = function () {
            var value = $wrapper.getValue();
            var currentStars = current.find('.star');
            for (var i = 0; i < currentStars.length; i++) {
                if (i < value) {
                    $(currentStars[i]).addClass('selected');
                } else {
                    $(currentStars[i]).removeClass('selected');
                }
            }
        }

        var resize = function (resizeComplete) {

            setTimeout(function () {

                var starWrappers = current.find('.star-wrapper');
                starWrappers.width(1); // initialize them to small so that current element has its auto size, otherwise the size won't change.

                var currentWidth = current.width();
                var over = $wrapper.find('.over');
                over.width(currentWidth);

                var starWidth = current.find('.star').first().width();
                var cellWidth = (currentWidth - starWidth) / 9;

                for (var i = 0; i < starWrappers.length - 1; i++) {
                    $(starWrappers[i]).width(cellWidth);
                    over.find('.star-wrapper:nth-child(' + (i + 1) + ')').width(cellWidth);
                }

                updateStars();

                $wrapper.bind('mousemove', function (e) {
                    var element = $(e.currentTarget);
                    var offset = element.offset();
                    var pos = e.pageX - offset.left;
                    var target = $(e.target);
                    if (target.hasClass('star')) {
                        pos = target.offset().left + target.width() - offset.left;
                    }

                    left.width(pos);
                });

                if (resizeComplete) {
                    resizeComplete();
                }
            }, 1);
        }

        if (!current.length) {

            initialized = false;

            current = $('<div class="current">' + getStars() + '</div>');
            var left = $('<div class="over-wrapper left"><div class="over">' + getStars() + '</div></div>');
            var right = $('<div class="over-wrapper right"><div class="over">' + getStars() + '</div></div>');

            $wrapper.append(current);
            $wrapper.append(right);
            $wrapper.append(left);

            $wrapper.on('resize', function () { resize(); });

            resize(function () {
                $wrapper.find('.star-wrapper').bind('click', function (e) {
                    var element = $(e.currentTarget);
                    var star = element.find('.star');
                    $wrapper.setValue(element.index() + 1);
                });

                initialized = true;
            });
        }

        $.extend($wrapper, {
            setValue: function (value) {
                var oldValue = $wrapper.data('rating-value');
                $wrapper.data('rating-value', value);
                if (initialized && oldValue != value) {
                    updateStars();
                    $wrapper.trigger('rated', [value]);
                }
            },
            getValue: function () {
                return $wrapper.data('rating-value');
            }
        });

        return $wrapper;
    }

})(jQuery);