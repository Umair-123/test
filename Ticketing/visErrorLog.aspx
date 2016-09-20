<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visErrorLog.aspx.vb" Inherits="visInternetTicketing.visErrorLog" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
    <head runat="server">
        <title><asp:Literal runat=server id="PageTitle"></asp:Literal></title>
        <meta content="Microsoft Visual Studio .NET 7.1" name="GENERATOR">
		<meta content="Visual Basic .NET 7.1" name="CODE_LANGUAGE">
		<meta content="JavaScript" name="vs_defaultClientScript">
		<meta content="http://schemas.microsoft.com/intellisense/ie5" name="vs_targetSchema">
		<script language="javascript" src="visJavaCommon.js"></script>
		<LINK href="visStyles.css" type="text/css" rel="stylesheet">
		<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
		<LINK href="visStylesUser.css" type="text/css" rel="stylesheet">
    </head>
    <body MS_POSITIONING="GridLayout">
        <form id="Form1" runat="server">
            <table cellspacing=0 cellpadding=0>
                <tr class="ErrorLogHeadRow" width=100%>
                    <td>
                        <table cellpadding=0 cellspacing=0>
                            <tr>
                                <td width=5></td>
                                <td><asp:Label ID=lblErrorLogTitle runat=server Text="Internet Ticketing Error Log" CssClass="ErrorLogHeaderText"></asp:Label></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table cellpadding=0 cellspacing=0>
                            <tr style="height:10px">
                                <td colspan=14></td>
                            </tr>
                            <tr>
                                <td width=5></td>
                                <td width=100><asp:Label ID=lblErrorLogClass runat=server Text="Sales Channel:" CssClass="ErrorLogHeaderText"></asp:Label></td>
                                <td width=5></td>
                                <td width=130><asp:DropDownList ID=ddlErrorLogClass runat=server Width=130 AutoPostBack=true></asp:DropDownList></td>
                                <td width=5></td>
                                <td width=80><asp:Label ID=lblErrorLogType runat=server Text="Log Type:" CssClass="ErrorLogHeaderText"></asp:Label></td>
                                <td width=5></td>
                                <td width=150><asp:DropDownList ID=ddlErrorLogType runat=server Width=150 AutoPostBack=true></asp:DropDownList></td>
                                <td width=10></td>
                                <td width=195><asp:Label ID=lblNumDisplay runat=server Text="Number of entries to display:" CssClass="ErrorLogHeaderText"></asp:Label>
                                <td width=5></td>
                                <td width=80><asp:DropDownList ID=ddlNumDisplay runat=server Width=80 AutoPostBack=true></asp:DropDownList></td>
                                <td width=5></td>
                                <td width=195><asp:Button id=btnGetErrors runat=server Text="List Errors" />
                                <input type=button ID=btnPrintErrors value="Print Errors" OnClick="Javascript:supportedPrint();"/></td>
                            </tr>
                            <tr style="height:10px">
                                <td colspan=14></td>
                           </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td><asp:Table runat=server ID=tblErrorLog cssclass=ErrorLogTable CellPadding=0 CellSpacing=0></asp:Table></td>
                </tr>
            </table>
            
        </form>
    </body>
</html>
