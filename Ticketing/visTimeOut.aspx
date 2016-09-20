<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visTimeOut.aspx.vb" Inherits="visInternetTicketing.visTimeOut" MasterPageFile="~/Site.Master" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%=ContentDelivery.Css("Ticketing/TimeOut.css").ToString()%>   
</asp:Content>

<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
<form id="timeoutpage" method="post" runat="server">
    <h2><em><%:Timeout.TimeoutHeader%></em></h2>
    
    <p><%: TimeoutMessage %></p>
    
    <button id="btnTimeoutConfirm" runat="server" class="page-action">
        <span><%: ButtonText %></span>
    </button>
</form>
</asp:Content>
