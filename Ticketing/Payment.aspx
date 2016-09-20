<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Payment.aspx.vb" Inherits="visInternetTicketing.Payment" %>
<%@ Register TagPrefix="vis" Namespace="InternetTicketing.Controls.WebForms" Assembly="InternetTicketing.Controls.WebForms" %>
<%@ Import Namespace="Newtonsoft.Json" %>
<%@ Import Namespace="Newtonsoft.Json.Converters" %>
<%@ Import Namespace="Vista.Web.Metadata" %>
<%@ Import Namespace="visInternetTicketing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%: ContentDelivery.Css("Forms.css")%>
    <%: ContentDelivery.Css("Ticketing\Payment.css")%>
</asp:Content>

<asp:Content ID="Content" ContentPlaceHolderID="ContentBody" runat="server">
    
    <form id="paymentForm" runat="server" autocomplete="off">
        <h3 class="amount"><%: Model.FormattingService.FormatCurrency(Model.AmountToCharge, displayCurrencySymbol:=True)%></h3>
        <vis:CountdownControl visible="True" runat="server" ID="countdownTimer" />
        <h2><%:Localisation.Payment.Header1%><em><%:Localisation.Payment.Header2%></em></h2>
        
        <% If Model.ValidationErrorMessage IsNot Nothing Then%>
            <span class="notification"></span><p class="error-text"><%:Model.ValidationErrorMessage%></p>
        <%End If%>
        

        <%=Model.FieldMetadata.SelectListFor(Function(f) f.CardType, "card-type")%>
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.CardNumber, "card-number")%>
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.CardName, "card-name")%>        
       
        <% If Model.FieldMetadata.IsFieldDisplayed(Function(f) f.CardExpiryDate) Then%>
            <div class="form-line date-field">
                <label><%: Model.FieldMetadata.GetFieldLabelText(Function(f) f.CardExpiryDate)%></label>
            
                <select id="card-expiry-month" name="card-expiry-month" class="date-field-month">
                    <% For Each monthValue In PaymentViewModel.GetMonthsOfTheYear()%>
                        <option><%:monthValue%></option>
                    <%Next%>
                </select>

                <span class="month-year-field-separator">/</span>
            
                <select id="card-expiry-year" name="card-expiry-year" class="date-field-year">
                    <% For Each fieldValue In Model.FieldMetadata.GetSelectListOptions(Function(f) f.CardExpiryDate)%>
                        <option><%:fieldValue%></option>
                    <%Next%>
                </select>
                <%= HtmlUtilities.GetFieldValidationMessageFor("card-expiry")%>
                <input id="card-expiry" name="card-expiry" class="date-field-value" type="hidden" <%= Model.FieldMetadata.GetFieldValidationHtmlAttributes(Function(f) f.CardExpiryDate) %> />
            </div>
        <%End If%>
        

        <% If Model.FieldMetadata.IsFieldDisplayed(Function(f) f.CardValidFromDate) Then%>
            <div class="form-line date-field">
                <label><%: Model.FieldMetadata.GetFieldLabelText(Function(f) f.CardValidFromDate)%></label>
            
                <select id="card-valid-from-month" name="card-valid-from-month" class="date-field-month">
                    <% For Each monthValue In Model.FieldMetadata.GetSelectListOptions(Function(f) f.CardValidFromDate, PaymentViewModel.GetMonthsOfTheYear())%>
                        <option><%:monthValue%></option>
                    <%Next%>
                </select>

                <span class="month-year-field-separator">/</span>
            
                <select id="card-valid-from-year" name="card-valid-from-year" class="date-field-year">
                    <% For Each fieldValue In Model.FieldMetadata.GetSelectListOptions(Function(f) f.CardValidFromDate)%>
                        <option><%:fieldValue%></option>
                    <%Next%>
                </select>
                <%= HtmlUtilities.GetFieldValidationMessageFor("card-valid-from")%>
                <input id="card-valid-from" name="card-valid-from" class="date-field-value" type="hidden" <%= Model.FieldMetadata.GetFieldValidationHtmlAttributes(Function(f) f.CardValidFromDate)%> />
            </div>
        <%End If%>
        
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.CardCVC, "card-cvc")%>  
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.CardIssueNumber, "card-issue-number")%>  
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.ZipCode, "zip-code")%>  
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.BankName, "bank-name")%>  
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.BankAccountNumber, "bank-account-number")%>  
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.BankSortCode, "bank-sort-code")%>
        <%=Model.FieldMetadata.TextFieldFor(Function(f) f.NumberOfInstalments, "number-of-instalments")%>  
        

        <% If Model.CanSaveCardToWallet Then%>
            <div class="form-line save-card-to-wallet-container">                       
                <input id="save-card-to-wallet" name="save-card-to-wallet" type="checkbox"/><label for="save-card-to-wallet"><%:Localisation.Payment.SaveCardToWallet%></label>
            </div>
        <%End If%>
        

        <div class="button-list button-list-multi">
            <button id="cancelOrder" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:Localisation.Payment.CancelOrderButton%></span></button>
            <button id="pay" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:Localisation.Payment.PayNowButton%></span></button>
        </div>
    </form>

</asp:Content>

<asp:Content ID="Script" ContentPlaceHolderID="Script" runat="server">
    
    <!-- 3D Secure Redirection Implementation -->
    <script type="text/javascript">
        var secureRedirectInfo = <%=JsonConvert.SerializeObject(Model.SecureRedirectData, New KeyValuePairConverter())%>;
    </script>

    <%= ContentDelivery.Script("Vista\Payment\Payment.js")%>
</asp:Content>
