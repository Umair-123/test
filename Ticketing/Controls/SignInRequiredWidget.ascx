<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="SignInRequiredWidget.ascx.vb" Inherits="visInternetTicketing.SignInRequiredWidget" Strict="true" %>


<asp:Panel ID="signinRequiredPanel" DefaultButton="signInButton" runat="server" class="ticketing-signin-required-widget">
    <h2>
        <asp:Label CssClass="widget-title" runat="server" ID="lblWidgetTitle" Text="Loyalty Member?" />
        <em><asp:Label runat="server" ID="lblWidgetSubtitle" Text="Sign In" /></em>
    </h2>    
    <asp:Label CssClass="widget-blurb" runat="server" ID="lblWidgetBlurb" Text="You are currently not signed in. Blurb blub blurb blurb blurb blurb."></asp:Label>
    <ul id="ulSignInErrors" class="signin-errors form-error" runat="server" Visible="False" ViewStateMode="Disabled">
        <li><asp:Label ID="lblSignInErrors" runat="server">Invalid username or password</asp:Label></li> 
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
            <asp:Button runat="server" id="signInButton" CssClass="button" Text="Sign In" />
        </li>
    </ul>
</asp:Panel>