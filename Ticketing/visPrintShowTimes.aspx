<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visPrintShowTimes.aspx.vb" Inherits="visInternetTicketing.visPrintShowTimes"%>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Bundles" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
	<HEAD>
		<title>
			<asp:Literal id="PageTitle" runat="server" />
		</title>
		<script language="javascript" src="visJavaCommon.js"></script>
		<LINK href="visStyles.css" type="text/css" rel="stylesheet">
		<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
		<LINK href="visStylesUser.css" type="text/css" rel="stylesheet">

        <%=ContentDelivery.CssBundle(CssBundles.PrintShowTimes).ToString()%>     
	</HEAD>
	<body MS_POSITIONING="GridLayout">
		<form id="Form1" method="post" runat="server">
		    <asp:Table id="tblHeader" runat="server" CssClass="PrintShowTimesHeaderTable"></asp:Table>
			<asp:Table id="tblShowTimes" runat="server" CssClass="PrintShowTimesTable"></asp:Table>
		</form>
	</body>
</HTML>
