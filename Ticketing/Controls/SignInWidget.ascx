<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="SignInWidget.ascx.vb" Inherits="visInternetTicketing.SignInWidget" Strict="true" %>


<div class="ticketing-signin-widget">
    <div class="widget-title">
    <asp:Label runat="server" ID="widgetTitleLabel" Text="Loyalty Member?"></asp:Label>  
    </div>
    <div class="widget-blurb">
        <asp:Label runat="server" ID="widgetBlurbLabel" Text="You are currently not signed in. Blurb blub blurb blurb blurb blurb."></asp:Label>    
        <asp:HyperLink runat="server" ID="signInTogglerLink" CssClass="sign-in-form-toggler"></asp:HyperLink>
    </div>
    <asp:Panel id="signInFormContainer" DefaultButton="signInButton" runat="server" class="sign-in-form-container">
        <ul id="signInErrorsList" class="signin-errors form-error" runat="server" Visible="False" ViewStateMode="Disabled">
            <li><asp:Label ID="signInError" runat="server">Invalid username or password</asp:Label></li> 
        </ul>    
        <ul class="webforms-form">           
            <%=Model.Fields.TextFieldFor(Function(f) f.Username, "username", Model.Username)%>
            <%=Model.Fields.TextFieldFor(Function(f) f.Password, "password", Model.Password)%>     
        </ul>
        <ul class="form-actions">
            <li>
                <asp:Hyperlink ID="forgotPasswordLink" runat="server" Text="Forgot Password?"></asp:Hyperlink> 
            </li>
            <li>
                <asp:Hyperlink ID="signUpLink" runat="server" Text="Sign Up"></asp:Hyperlink> 
            </li>
            <li>  
                <asp:Button runat="server" ID="signInButton" CssClass="button" Text="Sign In" />          
            </li>                 
        </ul>
    </asp:Panel>
</div>