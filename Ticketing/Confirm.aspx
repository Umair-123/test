<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Confirm.aspx.vb" Inherits="visInternetTicketing.Confirm" %>

<%@ Register TagPrefix="vis" Namespace="InternetTicketing.Controls.WebForms" Assembly="InternetTicketing.Controls.WebForms" %>
<%@ Register TagPrefix="uc" TagName="AssignGiftDialog" src="~/Controls/AssignGiftDialog.ascx" %>
<%@ Register Src="~/Controls/SignInWidget.ascx" TagPrefix="vis" TagName="SignInWidget" %>
<%@ Register Src="~/Controls/SignedInWidget.ascx" TagPrefix="vis" TagName="SignedInWidget" %>

<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="visInternetTicketing" %>
<%@ Import Namespace="Vista.Web" %>
<%@ Import Namespace="Vista.Web.Metadata" %>
<%@ Import Namespace="Localisation=InternetTicketing.Infrastructure.Localisation" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%: ContentDelivery.Css("PlusMinusNumeric.css")%>  
    <%: ContentDelivery.Css("IconButtons.css")%>
    <%: ContentDelivery.Css("RadioButtonGroup.css")%>
    <%: ContentDelivery.Css("Ticketing/CardWalletList.css")%>
    <%: ContentDelivery.Css("Ticketing/Confirm.css")%>
    <%: ContentDelivery.Css("Ticketing/SelectSeatsDialog.css")%>
</asp:Content>

<asp:Content ID="Script" ContentPlaceHolderID="Script" runat="server">
    <%= ContentDelivery.Script("Vista\Collapsible.js")%>
    <%= ContentDelivery.Script("Vista\CheckboxList.js")%>
    <%= ContentDelivery.Script("Vista\CardWallet\DeleteCardFromWalletDialog.js")%>
    <%= ContentDelivery.Script("Vista\CardWallet\CardWalletList.js")%>
    <%= ContentDelivery.Script("Vista\Confirm\InputSync.js")%>
    <%: ContentDelivery.Script("Vista\PlusMinusNumeric\PlusMinusNumeric.js")%>  
    <%: ContentDelivery.Script("Vista/Loyalty/TicketingSignInWidget.js")%>
    <%= ContentDelivery.Script("Vista\Confirm\Page.js")%>
    
    <script type="text/javascript">
        
        Vista.Urls.CardWallet = {};
        Vista.Urls.CardWallet.DeleteCardFromCardWallet = '<%: ResolveUrl("~/Confirm.aspx/DeleteCardFromCardWallet")%>';
        
        Vista.Data.ConfirmPage = {
            hasPaymentError: <%: If(Model.HasPaymentError, "true", "false")%>
        };

        Vista.Lang.Shared.Close = <%= Localisation.Shared.Close.ToJson()%>;
        
        Vista.Lang.CardWallet = {
            DeleteCardDialogHeaderText1: <%= Localisation.Confirm.DeleteCardDialogHeaderText1.ToJson()%>,
            DeleteCardDialogHeaderText2: <%= Localisation.Confirm.DeleteCardDialogHeaderText2.ToJson()%>,
            DeleteCardDialogMessageText: <%= Localisation.Confirm.DeleteCardDialogMessageText.ToJson()%>,
            DeleteCardDialogDeleteButton: <%= Localisation.Confirm.DeleteCardDialogDeleteButton.ToJson()%>
        };
    </script>
</asp:Content>

<asp:Content ID="Content" ContentPlaceHolderID="ContentBody" runat="server">

    <form id="confirmForm" method="post" runat="server">
        
        <vis:BreadcrumbControl ID="BreadcrumbControl" runat="server" />   
        
        <div class="signin-widget">
            <vis:SignInWidget ID="SignInWidget" runat="server" />
            <vis:SignedInWidget ID="SignedInWidget" runat="server" />
        </div>

        <vis:CountdownControl runat="server" ID="CountdownTimer" />

        <vis:CartControl ID="Cart" runat="server" />

        <%:""%><%--This block is required to remove "errors" from displaying in the error list window whenever <%:%> or <%=%> blocks are used --%>      
                
        <% If Model.ErrorMessage IsNot Nothing Then%>
            <span class="notification"></span><p class="error-text"><%:Model.ErrorMessage%></p>
        <%End If%>
        
        <% If Model.DisplayPostageDetails Then%>
        
            <div class="postage-details">
            
                <% If Model.DisplayGiftWrappingDetails Then%>

                    <h2><%: Localisation.Confirm.GiftMessageHeader1%><em><%: Localisation.Confirm.GiftMessageHeader2%></em></h2>
                    <textarea id="gift-message" name="gift-message" maxlength="500"><%: Model.Shop.GiftMessage%></textarea>
                    <div class="form-line">
                        <input id="is-gift-wrapped" type="checkbox" name="is-gift-wrapped" <%= If(Model.Shop.IsGiftWrapped, "checked=""checked""", "")%> /><label for="is-gift-wrapped"><%: Localisation.Confirm.GiftWrappedCheckbox%></label>
                    </div>

                <%End If %>
                
            
                <div class="shop-details">
                    
                    <% If Model.Shop.DeliveryAddressMetaData.IsAnyFieldDisplayed Then%>

                        <div class="delivery-details">
                            <h2><%: Localisation.Confirm.DeliveryDetailsHeader1%><em><%: Localisation.Confirm.DeliveryDetailsHeader2%></em></h2>

                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.CompanyName, "delivery-company", Model.Shop.DeliveryAddressFields.CompanyName, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Name, "delivery-name", Model.Shop.DeliveryAddressFields.Name, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Email, "delivery-email", Model.Shop.DeliveryAddressFields.Email, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.PhoneNumber, "delivery-phone", Model.Shop.DeliveryAddressFields.PhoneNumber, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Address1, "delivery-address1", Model.Shop.DeliveryAddressFields.Address1, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Address2, "delivery-address2", Model.Shop.DeliveryAddressFields.Address2, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Town, "delivery-town", Model.Shop.DeliveryAddressFields.Town, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Address3, "delivery-address3", Model.Shop.DeliveryAddressFields.Address3, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Postcode, "delivery-postcode", Model.Shop.DeliveryAddressFields.Postcode, "js-syncable")%>
                            <%= Model.Shop.DeliveryAddressMetaData.TextFieldFor(Function(f) f.Country, "delivery-country", Model.Shop.DeliveryAddressFields.Country, "js-syncable")%>

                        </div>
                    <%End If%>
                
                    <% If Model.Shop.BillingAddressMetaData.IsAnyFieldDisplayed Then%>
                        <div class="billing-details">
                            <h2><%: Localisation.Confirm.BillingDetailsHeader1%><em><%: Localisation.Confirm.BillingDetailsHeader2%></em></h2>
                            
                            <% If Model.Shop.DeliveryAddressMetaData.IsAnyFieldDisplayed Then%>
                                <div class="form-line">
                                    <input type="checkbox" id="billing-same-as-delivery" name="billing-same-as-delivery" /><label for="billing-same-as-delivery"><%: Localisation.Confirm.SameAsPostalCheckbox%></label>
                                </div>
                            <%End If%>

                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.CompanyName, "billing-company", Model.Shop.BillingAddressFields.CompanyName, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Name, "billing-name", Model.Shop.BillingAddressFields.Name, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Email, "billing-email", Model.Shop.BillingAddressFields.Email, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.PhoneNumber, "billing-phone", Model.Shop.BillingAddressFields.PhoneNumber, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Address1, "billing-address1", Model.Shop.BillingAddressFields.Address1, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Address2, "billing-address2", Model.Shop.BillingAddressFields.Address2, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Town, "billing-town", Model.Shop.BillingAddressFields.Town, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Address3, "billing-address3", Model.Shop.BillingAddressFields.Address3, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Postcode, "billing-postcode", Model.Shop.BillingAddressFields.Postcode, "js-syncable")%>
                            <%= Model.Shop.BillingAddressMetaData.TextFieldFor(Function(f) f.Country, "billing-country", Model.Shop.BillingAddressFields.Country, "js-syncable")%>

                        </div>
                    <%End If%>
                </div>
            
            </div>
        <% End If%>
 
        <h2><%:Localisation.Confirm.PersonalDetailsHeader1%><em><%=Localisation.Confirm.PersonalDetailsHeader2%></em></h2>

        <div class="personal-details">
            
            <%=Model.FieldMetadata.TextFieldFor(Function(f) f.Name, "name", Model.ConfirmOrderFields.Name)%>
            <%=Model.FieldMetadata.TextFieldFor(Function(f) f.Email, "email", Model.ConfirmOrderFields.Email)%>
            <%=Model.FieldMetadata.TextFieldFor(Function(f) f.Phone, "phone", Model.ConfirmOrderFields.Phone)%>
            
            <% If Model.IsSmsConfirmationEnabled Then%>
                <%=Model.FieldMetadata.CheckboxFor(Function(f) f.SendSMSConfirmation, "sms-confirmation-opt-in")%>
                <%=Model.FieldMetadata.SelectListFor(Function(f) f.MobileMake, "mobile-make")%>
                <%=Model.FieldMetadata.SelectListFor(Function(f) f.MobileModel, "mobile-model")%>
            <%End If%>

            <%=Model.FieldMetadata.TextAreaFor(Function(f) f.PickupComments, "pickup-comments", Model.ConfirmOrderFields.PickupComments)%>
            
            <%=Model.FieldMetadata.CheckboxFor(Function(f) f.IsLoyaltyMember, "is-loyalty-member", Model.ConfirmOrderFields.IsLoyaltyMember)%>
            <div class="loyalty-card-number-container"><%=Model.FieldMetadata.TextFieldFor(Function(f) f.LoyaltyCardNumber, "loyalty-card-number", Model.ConfirmOrderFields.LoyaltyCardNumber)%></div>

        </div>
             
        
        <%If Model.IsDisplayingPaymentMethods Then%>

            <hr/>
        
            <% If Model.PaymentErrorMessage IsNot Nothing Then%>
                <span class="notification"></span><p class="error-text"><%:Model.PaymentErrorMessage%></p>
            <%End If%>
        
            <a id="payment-methods"></a>
            <h2><%:Localisation.Confirm.PaymentMethodHeader1%><em><%=Localisation.Confirm.PaymentMethodHeader2%></em></h2>
            <div class="payment-method">
            
                <div class="radio-button-group main-group <%:If(Model.PaymentMethods.HasSinglePaymentMethod, "has-single-payment-method", "")%>">

                    <% If Model.PaymentMethods.IsVistaCardCapture Then%>           
                        <input id="vista-card-capture" type="radio" name="payment-method" value="vista-card-capture" checked /><label for="vista-card-capture"><%:Localisation.Confirm.PaymentMethodCredit%></label>
                    <%End If%>  
                
                    <%For Each paymentMethod In Model.PaymentMethods.ExternallyHostedPaymentMethods%>
                        <input id="<%: paymentMethod%>" type="radio" name="payment-method" value="<%: paymentMethod%>" <%: If(Not Model.PaymentMethods.IsVistaCardCapture AndAlso paymentMethod.Equals(Model.PaymentMethods.ExternallyHostedPaymentMethods.First()), " checked", "")%> /><label for="<%: paymentMethod%>"><%: paymentMethod%></label>
                    <%Next%>             

                    <% If Model.HasCardWallet Then%>
                        <input id="card-wallet" type="radio" name="payment-method" value="card-wallet" /><label for="card-wallet"><%:Localisation.Confirm.PaymentMethodCardWallet%></label>
                    <%End If%>
                                
                    <% If Model.PaymentMethods.IsPayOnPickupAllowed Then%>           
                        <input id="pay-on-pickup" type="radio" name="payment-method" value="pay-on-pickup" /><label for="pay-on-pickup"><%:Localisation.Confirm.PaymentMethodPayOnPickup%></label>
                    <%End If%>
                                
                    <% If Model.PaymentMethods.GiftCardPaymentsAreAllowed Then%>           
                        <input id="gift-card" type="radio" name="payment-method" value="gift-card" /><label for="gift-card"><%:Localisation.Confirm.PaymentMethodGiftCard%></label>
                    <%End If%>
                   
                     <% If Model.PaymentMethods.LoyaltyBalanceAsPayTypeAllowed Then%>           
                        <input id="loyalty-points-payment" type="radio" name="payment-method" value="loyalty-points-payment"/><label for="loyalty-points-payment"><%: Localisation.Confirm.PaymentMethodStoredValueCard%></label>
                    <%End If%>
                </div>
                
                 <% If Model.PaymentMethods.IsLoyaltyGiftCard AndAlso Model.GiftCardBalance IsNot Nothing Then%>
                    <div class="not-applicable gift-card-payment card-balance">
                        <%= Localisation.Confirm.LoyaltyGiftCardBalance %>
                        <%= Model.GiftCardBalance.Value.ToString("c") %>
                    </div>
                <% End If%>
                
                <% If Model.PaymentMethods.GiftCardPaymentsAreAllowed AndAlso Model.PaymentMethods.IsLoyaltyGiftCard Then%>
                    <div class="radio-button-group gift-card-group gift-card-payment <%: If(Model.PaymentMethods.HasSinglePaymentMethod, "", "not-applicable")%>">
                            <input id="loyalty-gift-card" type="radio" name="payment-method-gift-card" value="loyalty-gift-card"/><label for="loyalty-gift-card"><%: Localisation.Confirm.PaymentMethodLoyaltyGiftCard %></label>
                            <input id="gift-card-other" type="radio" name="payment-method-gift-card" value="gift-card-other" /><label for="gift-card-other"><%:Localisation.Confirm.PaymentMethodOtherGiftCard%></label>
                   </div>
               <%End If%>

                <% If Model.PaymentMethods.GiftCardPaymentsAreAllowed Then%>    
                    <div class="gift-card-payment-data form-line <%: If(Model.PaymentMethods.HasSinglePaymentMethod, "", "not-applicable")%>">
                        <label for="gift-card-number"><%: String.Format("{0}{1}", Localisation.Confirm.PaymentMethodGiftCard, HtmlUtilities.RequiredFieldIndicator)%></label><input id="gift-card-number" name="gift-card-number" autocomplete="off" required data-val="true"  data-val-required="<%: String.Format(Vista.Web.Localisation.Validation.IsRequiredMessage, Localisation.Confirm.PaymentMethodGiftCard)%>" data-val-digits="<%= String.Format(Vista.Web.Localisation.Validation.IsNumericMessage, Localisation.Confirm.PaymentMethodGiftCard)%>" /><%= HtmlUtilities.GetFieldValidationMessageFor("gift-card-number")%>
                    </div>
                <%End If%>
                
                <% If Model.PaymentMethods.LoyaltyBalanceAsPayTypeAllowed Then%>    
                    <div class="stored-value-payment-data form-line <%: If(Model.PaymentMethods.HasSinglePaymentMethod, "", "not-applicable")%>">
                        <label for="card-number"><%: String.Format("{0}{1}", Localisation.Confirm.PaymentMethodLoyaltyCard, HtmlUtilities.RequiredFieldIndicator)%></label><input id="card-number" value="<%: Model.LoyaltyCardNumber%>" readonly="readonly" name="card-number" autocomplete="off" required data-val="true"  data-val-required="<%: String.Format(Vista.Web.Localisation.Validation.IsRequiredMessage, Localisation.Confirm.PaymentMethodLoyaltyCard)%>" data-val-digits="<%= String.Format(Vista.Web.Localisation.Validation.IsNumericMessage, Localisation.Confirm.PaymentMethodLoyaltyCard)%>" /><%= HtmlUtilities.GetFieldValidationMessageFor("card-number")%>
                    </div>
                <%End If%>

                <% If Model.HasCardWallet Then%>
                    <div class="card-wallet not-applicable">
                        <h3 class="card-wallet-header"><%:Localisation.Confirm.SelectCardWalletHeader%></h3>
                        <p class="card-wallet-info"><%:Localisation.Confirm.SelectCardWalletDescription%></p>
                        <p class="no-cards-message not-applicable"><%:Localisation.Confirm.NoCardsMessage%></p>
                    
                        <%=HtmlUtilities.GetFieldValidationMessageFor("card-in-wallet", ValidationMessageType.InnerText)%>
                        <%--a placeholder input must be included here to allow validation to be triggered when all cards have been deleted from the card wallet--%>
                        <input class="validation-placeholder-input" type="radio" name="card-in-wallet" value="" data-val="true" data-val-required="<%:Localisation.Confirm.MustSelectCardWallet%>" />

                        <ul class="checkbox-list">
                            <%
                                Dim i As Integer = 0
                                For Each card In Model.PaymentMethods.CardWallets
                            %>
                                <li class="<%:UIUtilities.GetAltRowClass(i)%>">                                  
                                    <input id="<%:card.AccessToken%>" type="radio" name="card-in-wallet" value="<%:card.AccessToken%>" />
                                    <label for="<%:card.AccessToken%>" class="card-wallet-detail">
                                        <span class="card-wallet-card-number"><%: card.MaskedCardNumber%></span>
                                        <span class="card-wallet-card-expiry"><%: Formatter.FormatCardDate(card.CardExpiryDate)%></span>
                                        <button type="button" class="card-wallet-delete-card icon-button-clear"></button>
                                    </label>
                                </li>
                            <%
                                i += 1
                            Next
                            %>
                        </ul>
                    </div>
                <%End If%>
            </div>
        <%End If%>
        
        <% If Model.FieldMetadata.IsFieldDisplayed(Function(f) f.AgreeToTerms) Then%>
            <div class="terms-conditions-line">
                <input id="terms-conditions-agree" type="checkbox" name="terms-conditions-agree" <%= HtmlUtilities.GetHtmlAttributesFromMetadata(Model.FieldMetadata.GetMetadataForProperty(Function(f) f.AgreeToTerms))%> /><label for="terms-conditions-agree"><%= String.Format(Localisation.Confirm.TermsAndConditions, "<a href="" " & BrowsingUrls.GetTermsAndConditionsUrl() & " "" target=""_blank"">" & Localisation.Confirm.TermsAndConditionsLinkText & "</a>")%></label> <%= HtmlUtilities.GetFieldValidationMessageFor("terms-conditions-agree")%>      
            </div>
        <%End If%>
        
        <div class="button-list button-list-multi">
            <% If Model.IsMultiSessionAllowed Then%>
                <button id="continueShopping" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:Localisation.Confirm.ContinueShoppingButton%></span></button>                        
            <%End If%>
            <button id="cancelOrder" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:Localisation.Confirm.CancelOrderButton%></span></button>
            <% If Not Model.PaymentMethods.HasNoPaymentMethods OrElse Model.PaymentMethods.NoPaymentRequired Then%>
                <button id="next" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-optionalclass="page-action-disabled"  runat="server"><span><%:Localisation.Confirm.NextButton%></span></button>
            <% End If%>
        </div>
        

        <input id="txtDateOrderChanged" type="hidden" runat="server"/>
    </form>

    <uc:AssignGiftDialog runat="server" id="assignGiftDialog" />
</asp:Content>
