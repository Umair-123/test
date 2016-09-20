<%@ Page Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="visPaymentError.aspx.vb" Inherits="visInternetTicketing.visPaymentError" %>
<%@ Import Namespace="InternetTicketing.Infrastructure" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <style>
    </style>
</asp:Content>

<asp:Content ID="Script" ContentPlaceHolderID="Script" runat="server">
</asp:Content>

<asp:Content ID="Content" ContentPlaceHolderID="ContentBody" runat="server">
    <form id="frmPaymentError" runat="server">
        
        <h2><%:Localisation.Payment.Header1%><em><%:Localisation.Payment.Header2%></em></h2>

        <div>
            
            <p>               
                <asp:Label ID="lblError" runat="server" CssClass="UnexpectedErrorText PaymentErrorText"></asp:Label>
            </p>
            
            <div id="divBankDisplayData" runat="server" />
            
            <div class="button-list button-list-multi">
                <button id="ibtnCancel" class="page-action" runat="server"><span><%:Localisation.Payment.CancelOrderButton%></span></button>
                <button id="ibtnTryAgain" class="page-action" runat="server"><span><%:Localisation.Payment.TryAgainButton%></span></button>
            </div>
        </div>
    </form>
</asp:Content>
