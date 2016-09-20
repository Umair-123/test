<%@ Page Language="vb" MasterPageFile="~/Site.Master" EnableEventValidation="false" AutoEventWireup="false" CodeBehind="visWebPayment3DSecureWait.aspx.vb" Inherits="visInternetTicketing.visWebPayment3DSecureWait" %>
<%@ Import Namespace="InternetTicketing.Infrastructure" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%: ContentDelivery.Css("Ticketing\3dSecurePaymentWait.css")%>
</asp:Content>

<asp:Content ID="Content" ContentPlaceHolderID="ContentBody" runat="server">
    <form id="frmWebPayment3DSecureWait" action="" runat="server">
         <div>
            <div>
                <h2><%: Localisation.SecurePayment.Header1%></h2>
                <p><%: Localisation.SecurePayment.PageExplanation %></p>

                <img class="wait-animation" src="<%: ContentDelivery.Image("Icon_Loading_Light.gif")%>" />
            </div>
        </div>
		<input id="MD" type="hidden" name="MD" runat="server" />
        <input id="PaRes" type="hidden" name="PaRes" runat="server" />
        <input id="DR" type="hidden" name="DR" runat="server" />
        <asp:PlaceHolder ID="plhRequestFields" runat="server"></asp:PlaceHolder>
    </form>
</asp:Content>