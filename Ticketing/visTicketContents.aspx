<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visTicketContents.aspx.vb" Inherits="visInternetTicketing.visTicketContents"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
	<HEAD>
		<title>
			<asp:Literal id="PageTitle" runat="server" />
		</title>
		<meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="Visual Basic .NET 7.1" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<LINK href="visStyles.css" type="text/css" rel="stylesheet">
		<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested --><LINK href="visStylesUser.css" type="text/css" rel="stylesheet">
	</HEAD>
	<body class="FormStandard">
		<form id="Form1" method="post" runat="server">
			<!--#INCLUDE FILE = "visSkinBodyHeader.htm" --><asp:table id="tblTicketInfo" runat="server"></asp:table>
			<!--#INCLUDE FILE = "visSkinBodyFooter.htm" --></form>
	</body>
</HTML>
