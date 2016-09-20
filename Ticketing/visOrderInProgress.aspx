<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visOrderInProgress.aspx.vb" Inherits="visInternetTicketing.visOrderInProgress" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <link href="visStyles.css" type="text/css" rel="stylesheet" />
    <!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
    <link href="visStylesUser.css" type="text/css" rel="stylesheet" />
    <title><asp:Literal id="PageTitle" runat="server" /></title>
</head>
<body class="FormStandard">
    <!-- #INCLUDE FILE = "visSkinBodyHeader.htm" -->
    <form id="frmOrderInProgress" runat="server">
        <table class="TableMargin">
            <tr>
                <td colspan="2">
                    <asp:Label ID="lblOrderInProgress" runat="server" CssClass="InProgressHeader"></asp:Label>
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="lblSessionLabel" runat="server" CssClass="InProgressSubHeader"></asp:Label>
                </td>
                <td>
                    <asp:Label ID="lblSessionData" runat="server" CssClass="InProgressText"></asp:Label>
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="lblLastUpdateLabel" runat="server" CssClass="InProgressSubHeader"></asp:Label>
                </td>
                <td>
                    <asp:Label ID="lblLastUpdateData" runat="server" CssClass="InProgressText"></asp:Label>
                </td>
            </tr>
        </table>
        <br />
        <div>
            <asp:Label ID="lblMessage1" runat="server" CssClass="UnexpectedErrorText PaymentErrorText"></asp:Label>
            <asp:Label ID="lblMessage2" runat="server" CssClass="UnexpectedErrorText PaymentErrorText"></asp:Label>
            <asp:ImageButton ID="ibtnCancel" runat="server" CssClass="ImageOrderInProgressCancel" />
            <asp:ImageButton ID="ibtnContinue" runat="server" CssClass="ImageOrderInProgressContinue" />
        </div>
    </form>
    <!-- #INCLUDE FILE = "visSkinBodyFooter.htm" -->
</body>
</html>
