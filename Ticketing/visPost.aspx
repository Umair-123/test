<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visPost.aspx.vb" Inherits="visInternetTicketing.visPost" enableViewState="True"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
	<head>
		<title>
			<asp:Literal id="PageTitle" runat="server" />
		</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR" />
		<meta content="Visual Basic .NET 7.1" name="CODE_LANGUAGE" />
		<meta content="JavaScript" name="vs_defaultClientScript" />
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema" />
		<link href="visStyles.css" type="text/css" rel="stylesheet" />
		<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
		<link href="visStylesUser.css" type="text/css" rel="stylesheet" />
	</head>
	<body class="FormStandard">
		<form id="frmPost" method="post" runat="server" autocomplete="off">
			<input id="cinema" type="hidden" runat="server" name="cinema" /><input id="cinemaid" type="hidden" runat="server" name="cinemaid" />
			<input id="film" type="hidden" runat="server" name="film" /> <input id="sessiondate" type="hidden" runat="server" name="sessiondate" />
			<input id="sessiontime" type="hidden" runat="server" name="sessiontime" /> <input id="bookingno" type="hidden" runat="server" name="bookingno" />
			<input id="transno" type="hidden" runat="server" name="transno" />
			<input id="products" type="hidden" runat="server" name="products" /> <input id="email" type="hidden" runat="server" name="email" />
			<input id="cinemaop" type="hidden" runat="server" name="cinemaop" /> <input id="txtOrderTotal" type="hidden" runat="server" name="txtOrderTotal" />
			<input id="txtPrintAtHome" type="hidden" runat="server" name="txtPrintAtHome" /> <input id="txtCinEmailDisplayName" type="hidden" runat="server" name="txtCinEmailDisplayName" />
			<input id="txtCinEmailFromAddress" type="hidden" runat="server" name="txtCinEmailFromAddress" />
			<input id="txtCinEmailCopyAddress" type="hidden" runat="server" name="txtCinEmailCopyAddress" />
			<input id="txtSMSSuccess" type="hidden" runat="server" name="txtSMSSuccess" />
			<input id="txtLtyTimeoutErr" type="hidden" name="txtLtyTimeoutErr" runat="server" /><input id="txtLtyBalances" type="hidden" name="txtLtyBalance" runat="server" />
			<input id="custmobilemake" type="hidden" runat="server" name="custmobilemake" />
		    <input id="custmobilemodel" type="hidden" runat="server" name="custmobilemodel" />
		    <input id="smstext" type="hidden" runat="server" name="smstext" />
		    <input id="smsphonenum" type="hidden" runat="server" name="smsphonenum" />
		    <input id="smsbookingno" type="hidden" runat="server" name="smsbookingno" />
		    <input id="smsmoviename" type="hidden" runat="server" name="smsmoviename" />
		    <input id="smssessiontime" type="hidden" runat="server" name="smssessiontime" />
		    <input id="smscinemaname" type="hidden" runat="server" name="smscinemaname" />
            
            <asp:Button id="btnSubmit" runat="server" PostBackUrl="" Style="display:none;" />
		</form>
	</body>
</html>
