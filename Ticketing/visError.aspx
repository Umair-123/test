<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visError.aspx.vb" Inherits="visInternetTicketing.visError" MasterPageFile="~/Site.Master"%>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Bundles" %>
		
<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <link href="visStyles.css" type="text/css" rel="stylesheet"/>
    <link href="visStylesUser.css" type="text/css" rel="stylesheet"/>
    <%= ContentDelivery.CssBundle(CssBundles.ErrorPage).ToString() %>
</asp:Content>
<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
    <form runat="server">
        <span class="sorry" runat="server" id="sorry_label"></span>

        <h2 id="lblError" runat="server" class="error-message"></h2>
        <button id="ibtnBack" runat="server" class="page-action">
            <span runat="server" id="back_inner"></span>
        </button>
        <input id="TechnicalDetails" type="hidden" runat="server" />
    </form>
</asp:Content>