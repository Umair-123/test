/// <reference path="../Vista.js"/>
/// <reference path="../Models/Concession.js"/>
/// <reference path="../Models/Session.js"/>
/// <reference path="../Models/Recipient.js"/>
/// <reference path="../Models/Ticket.js"/>
/// <reference path="Item.js"/>

Vista.Cart.Data = (function () {
    'use strict';

    if (!Vista.Data.Cart) return {};

    var concessions = {},
        tickets = {},
        sessions = {},
        recipients = {},
        bookingFeeInCents = 0;

    bookingFeeInCents = Vista.Data.Cart.BookingFeeInCents;
    $.each(Vista.Data.Cart.Concessions, function () {
        var concession = $.extend(new Vista.Models.Concession(), this);
        var cartItem = new Vista.Cart.Item().fromConcession(concession);
        concessions[cartItem.id] = concession;
    });

    $.each(Vista.Data.Cart.Tickets, function () {
        var ticket = $.extend(new Vista.Models.Ticket(), this);
        var cartItem = new Vista.Cart.Item().fromTicket(ticket);
        tickets[cartItem.id] = ticket;
    });

    $.each(Vista.Data.Cart.Sessions, function () {
        var session = $.extend(new Vista.Models.Session(), this);
        sessions[session.id] = session;
    });


    $.each(Vista.Data.Cart.Recipients || [], function () {
        var recipient = $.extend(new Vista.Models.Recipient(), this);
        recipients[recipient.id] = recipient;
    });

    return {
        concessions: concessions,
        tickets: tickets,
        sessions: sessions,
        recipients: recipients,
        bookingFeeInCents: bookingFeeInCents,
        redirectOnLastItem: Vista.Data.Cart.RedirectOnLastItem,
        finaliseOnRemove: Vista.Data.Cart.FinaliseOnRemove 
    };

})();