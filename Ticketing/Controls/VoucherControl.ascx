<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="VoucherControl.ascx.vb" Inherits="visInternetTicketing.Controls.VoucherControl" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="Vista.Web" %>

<div id="category-ticket-voucher" class="voucher-control tab">
    <div class="voucher-header">
        <div class="form-line">
            <label for="ticket-voucher"><%:SelectTickets.EnterTicketVoucherLabel%></label><%--
        --%><input id="ticket-voucher" /><%--
        --%><button id="add-voucher" type="button" class="user-action"><span class="icon icon-add" data-js-buttonwatch="true"><%:SelectTickets.AddVoucherToOrder%></span></button>
        </div>
        <div id="voucher-pin-form-line" class="form-line not-applicable">
            <label for="ticket-voucher-pin"><%:SelectTickets.EnterTicketVoucherPINLabel%></label><%--
        --%><input id="ticket-voucher-pin" />
        </div>
    </div>

    <% If OrderedVouchersTickets IsNot Nothing AndAlso OrderedVouchersTickets.Any() Then%>
        <div class="vouchers-in-order">
            <%For Each voucherTicket In OrderedVouchersTickets%>
            <div class="voucher-line" data-ticket-code="<%: voucherTicket.TicketTypeCode %>" data-voucher-barcode="<%: voucherTicket.VoucherBarcode %>" data-allocated="<%: voucherTicket.IsAllocatedSeat.ToJson()%>" data-seat-count="<%: voucherTicket.SeatCount%>">
                <span class="voucher-ticket"><%: String.Format("{0} ({1})", voucherTicket.GetDisplayDescription().GetTranslation(IsPrimaryLanguage), voucherTicket.VoucherBarcode)%></span><%--
            --%><button type="button" class="icon icon-small icon-delete remove-voucher-ticket" data-js-buttonwatch="true"></button>
            </div>
            <%Next%>
        </div>
    <% End If%>
</div>
