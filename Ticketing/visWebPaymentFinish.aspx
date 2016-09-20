<%-- Viewstate MAC validation is disabled to provide backwards compatibility with legacy web payment connectors --%>
<%-- XSS vulnerability is not possible due to this page issuing HTTP 302 responses only, and therefore no script can be injected --%>
<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visWebPaymentFinish.aspx.vb" Inherits="visInternetTicketing.visWebPaymentFinish" EnableViewState="false" EnableViewStateMac="false"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
</head>
<body class="FormStandard">
    <form id="frmWebPaymentFinish" runat="server">
        <input id="cinema" type="hidden" runat="server" name="cinema" />
        <input id="cinemaid" type="hidden" runat="server" name="cinemaid" />
		<input id="film" type="hidden" runat="server" name="film" /> <input id="sessiondate" type="hidden" runat="server" name="sessiondate" />
		<input id="sessiontime" type="hidden" runat="server" name="sessiontime" /> <input id="bookingno" type="hidden" runat="server" name="bookingno" />
		<input id="transno" type="hidden" runat="server" name="transno" />
		<input id="bookingnumber" type="hidden" runat="server" name="bookingnumber" />
		<input id="products" type="hidden" runat="server" name="products" /> <input id="email" type="hidden" runat="server" name="email" />
		<input id="cinemaop" type="hidden" runat="server" name="cinemaop" /> <input id="txtOrderTotal" type="hidden" runat="server" name="txtOrderTotal" />
		<input id="txtPrintAtHome" type="hidden" runat="server" name="txtPrintAtHome" /> <input id="txtCinEmailDisplayName" type="hidden" runat="server" name="txtCinEmailDisplayName" />
		<input id="txtCinEmailFromAddress" type="hidden" runat="server" name="txtCinEmailFromAddress" />
		<input id="txtCinEmailCopyAddress" type="hidden" runat="server" name="txtCinEmailCopyAddress" />
		<input id="custname" type="hidden" runat="server" name="custname" />
		<input id="custphone" type="hidden" runat="server" name="custphone" />
		<input id="custmobilemake" type="hidden" runat="server" name="custmobilemake" />
		<input id="custmobilemodel" type="hidden" runat="server" name="custmobilemodel" />
		<input id="smstext" type="hidden" runat="server" name="smstext" />
		<input id="smsphonenum" type="hidden" runat="server" name="smsphonenum" />
		<input id="smsbookingno" type="hidden" runat="server" name="smsbookingno" />
		<input id="smsmoviename" type="hidden" runat="server" name="smsmoviename" />
		<input id="smssessiontime" type="hidden" runat="server" name="smssessiontime" />
		<input id="smscinemaname" type="hidden" runat="server" name="smscinemaname" />
		<input id="txtSMSSuccess" type="hidden" runat="server" name="txtSMSSuccess" />
		<input id="txtLtyBalances" type="hidden" name="txtLtyBalances" runat="server" />
		<input id="txtLtyTimeoutErr" type="hidden" name="txtLtyTimeoutErr" runat="server" />
		<input id="txtCardInVista" type="hidden" name="txtCardInVista" runat="server" />
		<input id="txtEmailSent" type="hidden" name="txtEmailSent" runat="server" />

		<asp:Button id="btnSubmit" runat="server" PostBackUrl="" Style="display:none;" />
    </form>
    
</body>
</html>
