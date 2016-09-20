/// <reference path="../jquery.mousewheel.js" />
/// <reference path="../jquery.hammer.min.js" />
(function () {
    'use strict';

    $.widget('ui.scrollbox', {
        options: {
            step: 0, // amount scrolled by the buttons: 0 --> sizeof(viewport)
            scrollingEnabled: true
        },

        _create: function () {
            this.container = this.element.addClass('scrollbox-container').attr('tabindex', '1');

            this.items = this.element.children();

            this.left = $('<div class="scrollbox-left-button"></div>').appendTo(this.container);
            this.viewport = $('<div class="scrollbox-viewport"></div>').appendTo(this.container);
            this.view = $('<div class="scrollbox-view"></div>').appendTo(this.viewport);
            this.right = $('<div class="scrollbox-right-button"></div>').appendTo(this.container);
            this.scrollbar = $('<div class="scrollbox-scrollbar"></div>').appendTo(this.container);
            this.scroll = $('<div class="scrollbox-scroll"></div>').appendTo(this.scrollbar);

            this.view.append(this.items);

            if ($.easing.vsEaseOutQuad === undefined) {
                $.extend($.easing, {
                    vsEaseOutQuad: function (x, t, b, c, d) {
                        return -c * (t /= d) * (t - 2) + b;
                    }
                });
            }

            // IE6 does not support absolute position on both sides, so must manually set size
            if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
                var viewWidth = this.container.width() - this.left.outerWidth(true) - this.right.outerWidth(true);
                this.viewport.width(viewWidth).height(this.container.height() - this.scrollbar.outerHeight(true));
                this.scrollbar.width(viewWidth);
            }

            if ("Hammer" in window && !$.browser.msie) {  // disable touch on IE until https://github.com/EightMedia/hammer.js/issues/308 is fixed
                Hammer(this.viewport); // enable touch events on the viewport
            }

            this.scroll.draggable({  // doesn't work on touch devices, hack fix available at http://touchpunch.furf.com/
                axis: 'x',
                containment: 'parent',
                drag: $.proxy(this._onScroll, this),
                stop: $.proxy(this._onStopScroll, this)
            });

            this.container.on('mousewheel', $.proxy(this._onMouseScroll, this));

            this.left.on('mousedown', $.proxy(this._onLeftClick, this));
            this.right.on('mousedown', $.proxy(this._onRightClick, this));

            this.container.on('keydown', $.proxy(this._onKeydown, this));
            this.scroll.on('mousedown', $.proxy(this._onStartScroll, this));
            this.scrollbar.on('mousedown', $.proxy(this._onScrollbarClick, this));

            this.viewport.on('drag', $.proxy(this._onTouchDrag, this));
            this.viewport.on('dragstart', $.proxy(this._onTouchDragStart, this));
            this.viewport.on('dragend', $.proxy(this._onTouchDragEnd, this));
            
            this.refresh();
        },

        refresh: function () {
            this.items = this.view.children();

            var totalWidth = 0;
            this.items.filter(':visible').each(function () {
                totalWidth += $(this).outerWidth(true);
            });

            totalWidth += 2; // padding on view

            this.totalWidth = totalWidth;
            this.viewPortWidth = this.viewport.innerWidth();
            this.maxViewOffset = totalWidth - this.viewPortWidth;
            this.scrollable = this.options.scrollingEnabled ? this.maxViewOffset > 0 : false;
            
            if (this.scrollable) {
                this.scrollbar.show();
                // scroll : scrollbar == viewport: view
                this.scroll.width(Math.round((this.viewport.innerWidth() / totalWidth * this.scrollbar.innerWidth()) - 2 /* border */));
                this.maxScrollOffset = this.scrollbar.innerWidth() - this.scroll.outerWidth(true);
            } else {
                this.scrollbar.hide();
            }
            
            if (!this.options.step) {
                this.options.step = this.viewPortWidth;
            }

            this.view.css('left', '').width(totalWidth); // must explicitly set width or will not expand on IE7
            this.scroll.css('left', '');
        },

        destroy: function () {
            // in theory the container could have tabindex originally..
            this.element.removeClass('scrollbox-container').removeAttr('tabindex').append(this.items);
            this.left.remove();
            this.right.remove();
            this.viewport.remove();
            this.scrollbar.remove();
            $.Widget.prototype.destroy.call(this);
        },

        _moveTo: function (viewPosition, options) {
            /// <summary>
            /// Move the scrollbox view to a given position. The position of the view and the position
            /// of the scrollbar are automatically synchronized.
            /// </summary>
            /// <param name="position">The amount to offset the left side of the scrollbox view.
            /// Reasonable values are negative between 0 and -maxViewOffset</param>
            /// <param name="options">Options for the animation of the movement.
            /// By default the animation is instant and does not queue.
            /// </param>
            /// <returns type="">Returns the jQuery object returned by the scroll animation.</returns>
            if (!this.scrollable) return null;
            options = $.extend({ duration: 0, queue: false, easing: 'vsEaseOutQuad', overscrollWeight: 4 }, options || {});

            var percentScrolled = (1 / this.maxViewOffset) * -viewPosition;
            var scrollPosition = percentScrolled * this.maxScrollOffset;

            var overscroll = this._overscroll(viewPosition);

            if (overscroll !== 0) {
                // If position will go into overscroll, slow down movement.
                var viewOverage = overscroll === -1 ? viewPosition : viewPosition + this.maxViewOffset;
                var newViewOverage = viewOverage / options.overscrollWeight;

                var scrollOverage = overscroll === -1 ? scrollPosition : scrollPosition - this.maxScrollOffset;
                var newScrollOverage = scrollOverage / options.overscrollWeight;

                viewPosition = (viewPosition - viewOverage) + newViewOverage;
                scrollPosition = (scrollPosition - scrollOverage) + newScrollOverage;
            }

            this.view.animate({ "left": viewPosition }, options);
            return this.scroll.animate({ "left": scrollPosition }, options);
        },

        _moveScrollTo: function (position, options) {
            var percent = (1 / this.maxScrollOffset) * position;
            var viewPosition = percent * this.maxViewOffset;

            return this._moveTo(viewPosition, options);
        },

        _moveBy: function (amount, options) {
            var currentPosition = this.view.position().left;

            return this._moveTo(currentPosition + -amount, options);
        },

        _moveScrollBy: function (amount, options) {
            var currentPosition = this.scroll.position().left;

            return this._moveScrollTo(currentPosition + amount, options);
        },

        _overscroll: function (position) {
            /// <summary>
            /// Checks if a position out of bounds.
            /// </summary>
            /// <param name="px">The position to check. Defaults to the current position of the scrollbox.</param>
            /// <returns type="">-1 if too far left, 0 if in bound, 1 if too far right.</returns>
            position = position || this.view.position().left;

            if (-position > this.maxViewOffset) {
                return 1;
            } else if (position > 0) {
                return -1;
            }

            return 0;
        },

        _snapBack: function (options) {
            /// <summary>
            /// If the scrollbox is in overscroll, move back to the closest non-overscroll
            /// position.
            /// </summary>
            /// <param name="options">Options for the animation of the movement.
            /// By default the animation takes 200ms.
            /// </param>
            /// <returns type="">Returns the result of the animation or null if not in overscroll.</returns>
            options = $.extend({ duration: 200 }, options || {});

            var overscroll = this._overscroll();

            if (overscroll !== 0) {
                var target = overscroll === -1 ? 0 : -this.maxViewOffset;
                return this._moveTo(target, options);
            }

            return null;
        },

        _onTouchDragStart: function (e) {
            this.view.stop();
            this.scroll.stop();

            e.preventDefault();
            this.startPos = this.view.position().left;
        },
        
        _onTouchDrag: function (e) {
            e.preventDefault();
            e.gesture.preventDefault();  // prevent panning the page

            // Move viewport by how far have we dragged since the start of this drag
            this._moveTo(this.startPos + e.gesture.deltaX);
        },

        _onTouchDragEnd: function (e) {
            e.preventDefault();
            e.gesture.preventDefault();
            
            var direction = e.gesture.direction === "left" ? 1 : -1;
            var distance = e.gesture.velocityX * 150 * direction;  // velocity of total drag movement
            var duration = Math.min(300, (Math.abs(distance) / Math.abs(e.gesture.velocityX)) * 2);

            if (this._overscroll() === 0) {
                this._moveBy(distance, { duration: duration, complete: $.proxy(this._snapBack, this) });  // doesn't act right
            } else {
                this._snapBack();
            }

            this.startPos = null;
        },

        _onLeftClick: function () {
            this.view.stop();
            this.scroll.stop();

            if (this.view.position().left >= 0) {
                // Too far left, snap back and don't scroll any more
                this._snapBack();
                return false;
            }

            this._moveBy(-this.options.step, { duration: 400, complete: $.proxy(this._snapBack, this) });

            return true;
        },

        _onRightClick: function () {
            this.view.stop();
            this.scroll.stop();

            if (this.view.position().left <= -this.maxViewOffset) {
                // Too far right, snap back and don't scroll any more
                this._snapBack();
                return false;
            }

            this._moveBy(this.options.step, { duration: 400, complete: $.proxy(this._snapBack, this) });

            return true;
        },

        _onStartScroll: function () {
            this.scroll.addClass('scrollbox-scrolling');
            $('body').mouseup($.proxy(this._onStopScroll, this));
        },

        _onStopScroll: function () {
            // this is called both on mouseup and when 
            this.scroll.removeClass('scrollbox-scrolling');
            $('body').unbind('mouseup', $.proxy(this._onStopScroll, this));
        },

        _onScroll: function (e, ui) {
            this.view.stop(true, false /* scroll should interrupt */);
            this.scroll.stop(true, false);

            this._moveScrollTo(-ui.position.left);
        },

        _onScrollbarClick: function (e) {
            if ($(e.target).is(this.scroll)) return;

            var scrollOffset = this.scroll.position().left;

            var clickOffset = typeof e.offsetX === 'undefined' ? // firefox does not provide offsetX
                e.pageX - $(e.target).offset().left :
                e.offsetX;

            // clicking on scroll handle
            if (clickOffset >= scrollOffset && clickOffset <= scrollOffset + this.scroll.outerWidth(true)) return;

            var newPosition = Math.round(clickOffset - this.scroll.outerWidth() / 2);
            newPosition = Math.max(0, newPosition);
            newPosition = Math.min(this.maxScrollOffset, newPosition);

            this._moveScrollTo(-newPosition, { duration: 200 });
        },

        _onMouseScroll: function (e, delta, deltaX, deltaY) {
            if (deltaX === 1 || deltaY === 1) {
                return !this._onLeftClick();
            } else if (deltaX === -1 || deltaY === -1) {
                return !this._onRightClick();
            }

            return true;
        },

        _onKeydown: function (e) {
            switch (e.which) {
                case 37:
                    this._onLeftClick();
                    break;
                case 39:
                    this._onRightClick();
                    break;
            }
        }
    });
}());