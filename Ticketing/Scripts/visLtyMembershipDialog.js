$(function () {
    var memberships = $('tr.membership-row');
    memberships.click(onMembershipSelect);

    // better to use id?
    var submitButton = $('.membershipDialog .submit');
    // Better to hook into form.submit?
    submitButton.click(onSubmit);
});

function onMembershipSelect() {
    var target = $(this);
    var parent = target.closest('table');
    parent.find('tr.selected').removeClass('selected');
    target.addClass('selected');
}

function onSubmit() {
    var selectedRow = $(this).prev('table').find('tr.selected');

    // Don't submit without a row selected
    if (!selectedRow.length) return false;

    var input = $('.membershipDialog input.selected');
    input.val(selectedRow.attr('membership-id'));

    return true;
}