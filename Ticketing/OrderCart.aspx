<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="OrderCart.aspx.vb" Inherits="visInternetTicketing.OrderCart" MasterPageFile="~/Site.Master" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Register Assembly="InternetTicketing.Controls.WebForms" Namespace="InternetTicketing.Controls.WebForms" TagPrefix="vis" %>



<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%=ContentDelivery.Css("Ticketing/OrderCart.css").ToString()%>   
</asp:Content>

<asp:Content ID="Script" ContentPlaceHolderID="Script" runat="server" >

    <script type="text/javascript" src="visJavaCommon.js"></script>    
    <script type="text/javascript">
        $(function () {
            $('.countdown').countdown();
            $('.cart').cart();
        });
    </script>
</asp:Content>

<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">

		<form id="frmOrderCart" method="post" runat="server">
            
            <vis:CountdownControl runat="server" ID="countdownTimer"/>
            <vis:CartControl ID="Cart" runat="server" />
            


			<p>
                <asp:Label ID="lblMessageText" runat="server"></asp:Label>			    
			</p>          


			<div class="button-list button-list-multi">
				<button id="ibtnAddShow" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:OrderCart.AddAShowButton%></span></button>
				<button id="ibtnCancelOrder" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:OrderCart.CancelOrderButton%></span></button>
				<button id="ibtnCheckout" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:OrderCart.CheckoutButton%></span></button>
			</div>				
        </form>
</asp:Content>