<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visShop.aspx.vb" Inherits="visInternetTicketing.visShop" EnableEventValidation="false" EnableViewState="false" MasterPageFile="~/Site.Master" %>
<%@ Import Namespace="Vista.Cdn.Client" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.ContentDelivery" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Bundles" %>

<%@ Register TagPrefix="vis" Namespace="InternetTicketing.Controls.WebForms" Assembly="InternetTicketing.Controls.WebForms" %>
<%@ Register TagPrefix="uc" TagName="AssignGiftDialog" src="~/Controls/AssignGiftDialog.ascx" %>

<asp:Content runat="server" ContentPlaceHolderID="Css">
    <%:ContentDelivery.Css("CategoryTabs.css")%>  
    <%:ContentDelivery.Css("PlusMinusNumeric.css")%>  
    <%:ContentDelivery.Css("Ticketing/Shop.css")%>   
    <%:ContentDelivery.Css("Ticketing/ConcessionTabs.css")%>   
</asp:Content>

<asp:Content runat="server" ContentPlaceHolderID="Script">
    <script type="text/javascript" src="jquery-jtemplates.js"></script>
    <script type="text/javascript" src="visJavaCommon.js"></script>

    <%: ContentDelivery.Script("Vista/Cart/GiftTemplate.js")%>  
    <%: ContentDelivery.Script("Vista/SelectConcessions/Concession.js")%>  
    <%: ContentDelivery.Script("Vista/Shop/Page.js")%>  
    <%: ContentDelivery.Script("Vista/PlusMinusNumeric/PlusMinusNumeric.js")%>  
</asp:Content>

<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
    <form id="visShop" method="post" runat="server">
        <%: ""%>
           
        <h2 class="page-title"><%: Shop.Heading1%><em><%: Shop.Heading2%></em></h2>
     
        <div class="order-details">
            <vis:CartControl id="cartControl" runat="server" />
        </div>
        
        <% If Not String.IsNullOrEmpty(PageData.ValidationErrors) Then%>
            <div class="order-errors">
                <span class="notification"></span><p class="error-text"><%: PageData.ValidationErrors%></p>
            </div>
        <% End If%>
        
        <div class="category-tabs">
            <ol class="categories">
            <% For Each tab In PageData.Tabs%>
                <li><a href="#<%: tab.Key %>"><%: tab.Name%></a></li> 
            <% Next tab%>
            </ol>
            
            <div class="concession-tabs category-tabs-items">

            <% For Each tab In PageData.Tabs%>
                <ul id="<%: tab.Key %>" class="tab">
                <% For Each item In tab.Items.OrderBy(Function(i) i.Description)%>
                    <li class="item<%: If(item.Quantity > 0, " active", "") %>">
                        <div class="image-container">
                            <img alt="<%: item.Description %>" src="<%: item.ImageUri %>" />
                        </div>
                        <div class="item-details">
                            <label for="<%: item.Key %>"><%: item.Description%></label>
                            <span class="description"><%: item.ExtendedDescription%></span>                      
                            
                        </div>
                        <% If item.IsPickUpOnly = True Then%>
                                <span class="pickup-only"><%: Shop.PickupOnlyMessage%></span>
                            <%End If%>
                        <span class="price original" data-value="<%: item.PriceInCents %>"><%: item.PriceForDisplay%></span>
                        <div class="item-footer">
                             <div class="item-footer-button">
                               <button type="button" <%= If(item.IsGiftable, "", "disabled=""disabled""") %>><span class="icon icon-gift-large"><%: Shop.GiftToAFriend.ToUpperInvariant() %></span></button>
                            </div>
                            <div class="item-footer-quantity plus-minus-numeric">
                                <span><%: Shop.Buy%></span>
                                <button type="button" class="clear icon icon-clear"></button>
                                <button type="button" class="minus icon icon-minus"></button>
                                <input type="text" id="<%: item.Key %>" class="quantity" name="<%: item.Key %>" value="<%: item.Quantity %>" min="0" max="<%: item.MaxQuantity %>" />
                                <button type="button" class="plus icon icon-plus"></button>
                            </div>
                        </div>
                    </li> 
                <% Next%>
                </ul>
            <% Next%>
            </div>
            
            <div class="<%: If(PageData.ConcessionsOrdered, "", "not-applicable")%>">
                <button id="btnShopCheckout" runat="server" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" ><span><%: Shop.Checkout%></span></button>
            </div>
        </div>

        <input id="txtDateOrderChanged" type="hidden" runat="server" />
        
        <input type="hidden" name="gift-recipients" />
    </form>
    
    <uc:AssignGiftDialog runat="server" id="assignGiftDialog" />
</asp:Content>
