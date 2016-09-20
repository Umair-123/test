// TODO: fancy scrollbar if there is time

(function () {
    'use strict';
    var events = {
        change: 'changecomplete' /* provide separate event to avoid dependency on event handler ordering on the change event */
    };

    $.widget('ui.checkboxlist', {

        _create: function () {
            this.element.on('click', 'input', $.proxy(this._onSelection, this)); // change is buggy in IE
            this.selection = new Vista.Collapsible(this.element.nextAll('dl:first').find('.checkboxlist-selection'), { maxLines: 3 }); // TODO: this should really be passed in
            this._selection = $.map(this.element.find('.selected label'), function (element) {
                return $(element).text();
            });

            this._max = +this.element.data('max') || 0; // 0 is ignored

            this._validationError = this.element.nextAll('.checkbox-list-validation:first');
            this._validate();
        },

        destroy: function () {
            this.element.off('click', 'input', this._onSelection);
        },

        _validate: function () {
            if (this._max && this._selection.length > this._max) {
                this.element.addClass('input-validation-error');
                this._validationError.text('Maximum: ' + this._max);
            }
            else {
                this.element.removeClass('input-validation-error');
                this._validationError.empty();
            }
        },

        _onSelection: function (e) {
            var input = $(e.target);
            var listItem = input.closest('li');
            var text = listItem.find('label').text();

            if (input.attr('type') === 'radio') {
                
                // reset previously selected item
                input.parents('.checkbox-list').find('li')
                    .removeClass('selected');
                
                // set newly selection item
                listItem.addClass('selected');
                
                // radio button select list doesnt support selection summary (this.selection)
            }
            else if (input.attr('type') === 'checkbox') {
                if (input.is(':checked')) {
                    listItem.addClass('selected');
                    this._selection.unshift(text);
                }
                else {
                    listItem.removeClass('selected');
                    this._selection.splice(this._selection.indexOf(text), 1);
                }
            }


            this._validate();

            this._updateSelection();
            this.element.trigger(events.change);
        },

        _updateSelection: function () {
            this.selection.reset();

            if (!this._selection.length)
                this.selection.append('None');
            else {
                for (var i = 0; i < this._selection.length; i++) {
                    this.selection.append(this._selection[i]);
                }
            }

        }
    });

})();
