<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="SignedInWidget.ascx.vb" Inherits="visInternetTicketing.SignedInWidget" %>
<div class="ticketing-signedin-widget">
    <asp:Label CssClass="widget-title" runat="server" ID="widgetTitleLabel" Text="Loyalty Member?"></asp:Label>
    <div class="widget-blurb">
        <asp:Label ID="widgetBlurbLabel" runat="server" CssClass="wiget-blurb" Text="Fred Jones"></asp:Label>                 
    </div>       
    <ul class="webforms-form">
       <li class="form-line">
           <label id="usernameLabel" runat="server">Username:</label>
           <asp:TextBox runat="server" ID="usernameTextBox" Enabled="False"></asp:TextBox>           
       </li> 
        
    </ul>
    <ul class="form-actions">
        <li>
            <asp:LinkButton runat="server" ID="switchUserButton" CommandName="login" Text="Sign Out"/>   
        </li>
    </ul> 
</div>