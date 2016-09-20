/// <reference path="../Vista.js"/>
/// <reference path="Template.js"/>
/// <reference path="../ButtonWatch.js" />
/// <reference path="~/Scripts/Vista/Cart/View.js" />

(function () {
    'use strict';

    // Drop in replacement for cart template
    // If this file is included it will override the normal template
    // NB: ordering is important, and this script must be included after the template script

    var giftTemplate = function () { };

    giftTemplate.prototype = Object.create(Vista.Cart.Template.prototype);
    var baseTemplate = giftTemplate.prototype._template;
    giftTemplate.prototype._template = $('<li></li>')
                                                    .append($('<button class="gift icon icon-gift" type="button"></button>'))
                                                    .append($('<div class="recipient"></div>'))
                                                    .append($('<ul class="items"></ul>')
    );

    var _innerTemplate = $('<li class="cart-concession"></li>')
                                      .append($('<button class="clear icon icon-clear" data-js-buttonwatch="true" type="button"></button>'))
                                      .append($('<span class="name"></span>'))
                                      .append($('<span class="quantity"></span>'))
                                      .append($('<span class="points-cost"></span>'))
                                      .append($('<span class="price"></span>'));

    var baseRender = Vista.Cart.Template.prototype.render; // Preserve a reference, since we are overwriting the prototype
    giftTemplate.prototype.render = function (cartItem) {
        var template = baseRender.call(this, cartItem);
        
        return template;
    };

    var baseRefresh = Vista.Cart.Template.prototype.refresh;
    giftTemplate.prototype.refresh = function (template, cartItem) {
        var itemTemplate, append = true;
        if (cartItem.recipient) {
            var existingInnerTemplate = template.find('li').filter(function(i, e) {
                return $(e).data('id') == cartItem.id;
            });
            if (existingInnerTemplate.length) {
                itemTemplate = existingInnerTemplate;
                append = false;
            } else {
                itemTemplate = _innerTemplate.clone();
                itemTemplate.data('id', cartItem.id);
            }

            template.data('recipient', cartItem.recipient);
            template.find('.recipient').text(cartItem.recipient);
        } else {
            itemTemplate = template;
        }

        baseRefresh.call(this, itemTemplate, cartItem);

        if (append) {
            template.find('.items').append(itemTemplate);
        }

        if (cartItem.isGift) {
            template.addClass('cart-gift');
        }
    };

    Vista.Cart.Template.prototype = giftTemplate.prototype;
    
    Vista.Cart.Template.prototype.getTemplate = function (cartItem) {
        if (!cartItem.recipient) {
            return baseTemplate.clone();
        }
        var container = Vista.Cart.View.getConcessionsList();
        var template = container.find('li').filter(function(i, el) {
            return $(el).data('recipient') === cartItem.recipient;
        });
        if (template.length) {
            return template;
        }
        return this._template.clone();
    };
})();
