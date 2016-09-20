<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="LoyaltyRewardShop.aspx.vb" Inherits="visInternetTicketing.LoyaltyRewardShop" MasterPageFile="Site.Master" ClientIDMode="AutoID" %>
<%@ Import Namespace="Vista.Cdn.Client" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Bundles" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="Vista.Web.Utilities" %>
<%@ Import Namespace="visInternetTicketing.ViewModels" %>
<%@ Import Namespace="Vista.Web.Utilities.CollectionExtensions" %>
<%@ Import Namespace="LoyaltyRewardText=InternetTicketing.Infrastructure.Localisation.LoyaltyRewardShop" %>
<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%: ContentDelivery.Css("Forms.css")%> 
    <%: ContentDelivery.Css("Blurb.css")%> 
    <%: ContentDelivery.Css("FormError.css")%> 
    <%: ContentDelivery.Css("CategoryTabs.css")%> 
    <%: ContentDelivery.Css("Loyalty/LoyaltyRewardShop.css")%>     
</asp:Content>

<asp:Content runat="server" ID="scripts" ContentPlaceHolderID="Script" >
    <%: ContentDelivery.ScriptBundle(JsBundles.SelectGrid)%>
    <%: ContentDelivery.Script("Vista/LoyaltyRewardShop/Item.js")%>
    <%: ContentDelivery.Script("Vista/LoyaltyRewardShop/ItemClassCategory.js")%>
    <%: ContentDelivery.Script("Vista/LoyaltyRewardShop/RecognitionTypeCategory.js")%>
    <%: ContentDelivery.Script("Vista/LoyaltyRewardShop/Page.js")%>
</asp:Content>
<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
           
    <div class="loyalty-reward-shop">
        <h2><%: LoyaltyRewardShop.Title%>
            <% If Not String.IsNullOrWhiteSpace(LoyaltyRewardShop.Subtitle) Then%>
            <em><%: LoyaltyRewardShop.Subtitle%></em>
            <%End If%>            
        </h2>           
        <%If Not String.IsNullOrWhiteSpace(LoyaltyRewardShop.Blurb) Then%>
            <div class="blurb"><%: LoyaltyRewardShop.Blurb%></div>
        <%End If%>                    
        <ul class="account-summary">
            <li class="form-line">
                <label id="lblTime"><%:LoyaltyRewardShop.TimeOfUpdate%>:</label><span id="lblTimeValue" class="read-only-value" ><%: ViewModel.TimeOfUpdateFormatted%></span>
            </li>            
            <li class="form-line">
                <label id="lblPointsBalance"><%:LoyaltyRewardShop.PointsBalance%>:</label><span class="read-only-value" id="lblPointsBalanceValue"><%: ViewModel.CurrentBalanceFormatted%></span>
            </li>
        </ul>
        <div id="reward-grid" class="category-tabs">              
            <ol class="categories">
                    <%For Each recognitionTypeCategory As LoyaltyRewardShopViewModel.RecognitionTypeCategoryViewModel In ViewModel.RecognitionTypeCategories %>
                        <li><a href="#<%:recognitionTypeCategory.HtmlSafeId%>"><%:recognitionTypeCategory.Name%></a></li>            
                    <%Next%>                                           
            </ol>
                    
            <div class="category-tabs-items">
                    <%For Each recognitionTypeCategory As LoyaltyRewardShopViewModel.RecognitionTypeCategoryViewModel In ViewModel.RecognitionTypeCategories %>                        
                        <div id="<%:recognitionTypeCategory.HtmlSafeId%>" class="tab recognition-type-category">
                            <%For Each itemClassCategory As LoyaltyRewardShopViewModel.ItemClassCategoryViewModel In recognitionTypeCategory.ItemClassCategories%>                        
                                <div class="item-class-category <%:If(itemClassCategory.IsFirstCategory, "expanded", "collapsed")%>">
                                    
                                    <div class="expander <%:If(recognitionTypeCategory.ItemClassCategories.Count = 1, "no-expansion", "")%>">
                                        <div class="title"><%: itemClassCategory.Name%></div>
                                        <div class="arrow">&nbsp;</div>
                                    </div>                                                                               
                                    <div class="item-class-category-items">
                                        <%
                                            Dim rows As List(Of List(Of LoyaltyRewardShopViewModel.ManualRecognitionItemViewModel)) = itemClassCategory.Items.MakeGridRows(2)
                                        %>                                        
                                        <%For Each row In rows%>   
                                            <div class="row">
                                                <%For Each item As LoyaltyRewardShopViewModel.ManualRecognitionItemViewModel In row%>   
                                                    <div class="manual-recognition-item <%:If(item.ManualRecognition.TotalAvailable <= 0 Or item.ManualRecognition.PointsCost > ViewModel.CurrentBalance, "unavailable", "")%>">
                                                        <input type="hidden" class="js-recognition-id" value="<%:item.ManualRecognition.Id%>" />
                                                        <input type="hidden" class="js-balance-type-id" value="<%:item.ManualRecognition.BalanceTypeId%>" />
                                                        <input type="hidden" class="js-points-cost" value="<%:item.ManualRecognition.PointsCost%>" />
                                                    <div class="display-mode">
                                                        <div class="image">
                                                            <img src="<%:ContentDelivery.EntityImage(CdnMediaType.LoyaltyRewardShopItems, item.ManualRecognition.ImageName, 100, 100, True)%>" alt="<%:item.ManualRecognition.Name%>" />
                                                        </div>
                                                        <div class="information">
                                                            <div class="title"><%:item.Name%></div>
                                                            <div class="description"><%:item.Description%></div>                                            
                                                            <ul>
                                                               <li class="form-line"><label><%: LoyaltyRewardShop.PointsCost%>:</label><%:item.ManualRecognition.PointsCost%></li> 
                                                                <% If Not String.IsNullOrWhiteSpace(item.ExpiryDateFormatted) Then%>                                                                                                                                
                                                                    <li class="form-line"><label><%: LoyaltyRewardShop.Expiry%>:</label><%:item.ExpiryDateFormatted %></li> 
                                                                <%End If%>
                                                                <% If Not String.IsNullOrWhiteSpace(item.QuantityRemainingFormatted) Then%>                                                                                                                                
                                                                    <li class="form-line"><label><%: LoyaltyRewardShop.Remaining%>:</label><span class="quantity-remaining"><%:item.QuantityRemainingFormatted%></span></li>
                                                                <%End If%>                                                                
                                                            </ul>
                                                            <button class="redeem-button button"><%:LoyaltyRewardShop.RedeemButton%></button>
                                                        </div>
                                                    </div>
                                                    <div class="confirm-mode">
                                                        <div class="confirmation-header">
                                                            <div class="image">
                                                            <img src="<%:ContentDelivery.EntityImage(CdnMediaType.LoyaltyRewardShopItems, item.ManualRecognition.ImageName, 100, 100, True)%>" alt="<%:item.ManualRecognition.Name%>" />
                                                        </div>
                                                            <div class="information">
                                                            <div class="title"><%: LoyaltyRewardShop.ConfirmationTitle%></div>
                                                            <div class="instructions"><%: LoyaltyRewardShop.ConfirmationBlurb%></div>                                            
                                                            <ul>
                                                                <li class="form-line"><label><%:LoyaltyRewardShop.Item%>: </label><%:item.Name %></li> 
                                                                <li class="form-line"><label><%:LoyaltyRewardShop.PointsCost%>: </label><%:item.ManualRecognition.PointsCost%></li> 
                                                                <li class="form-line"><label><%:LoyaltyRewardShop.ConfirmationPointsBalance%>: </label><span class="points-balance"><%: ViewModel.CurrentBalanceFormatted%></span></li>
                                                            </ul>
                                                        </div>                                                    
                                                        </div>
                                                        <div class="pickup-details">
                                                            <% If (item.ManualRecognition.IsCollected) Then%>        
                                                            <% If Not String.IsNullOrWhiteSpace(LoyaltyRewardShop.PickupLocationBlurb) Then%>                                                                                                                    
                                                                <div class="pickup-instructions">
                                                                    <%:LoyaltyRewardShop.PickupLocationBlurb%>
                                                                </div>
                                                            <%End If%>
                                                                <ul class="pickup-form">
                                                                   <li class="form-line">
                                                                       <label><%:LoyaltyRewardShop.PickupLocation%></label>
                                                                       <select class="cinema-picker">
                                                                        </select>
                                                                   </li> 
                                                                </ul>
                                                                <% If Not String.IsNullOrWhiteSpace(item.CollectionNotes) Or item.ManualRecognition.DaysToCollect.HasValue And item.ManualRecognition.DaysToCollect.Value > 0 Then%>
                                                                    <ul class="pickup-notes">
                                                                    <% If Not String.IsNullOrWhiteSpace(item.CollectionNotes) Then%>                                                                                                                    
                                                                        <li>
                                                                            <%:item.CollectionNotes%>
                                                                        </li>
                                                                    <%End If%>
                                                                    <% If item.ManualRecognition.DaysToCollect.HasValue And item.ManualRecognition.DaysToCollect.Value > 0 Then%>
                                                                        <li>
                                                                            <%:item.CollectionPeriodNotes%>
                                                                        </li>
                                                                    <% End If%>
                                                                    </ul>
                                                                <% End If%>
                                                                
                                                            <% End If%>                  
                                                            <div class="action-buttons">
                                                                <button class="cancel-button button"><%:LoyaltyRewardShop.CancelButton%></button>
                                                                <button class="confirm-button button"><%:LoyaltyRewardShop.ConfirmButton %></button>   
                                                            </div>                                          
                                                            <div class="loading-mask">
                                                                <div class="loading">&nbsp;</div>
                                                            </div>                                                
                                                        </div>
                                                        <div class="complete-view">
                                                            <div class="complete-message reversed">                                                           
                                                            </div>
                                                            <div class="action-buttons">
                                                                <button class="done-button button"><%:LoyaltyRewardShop.DoneButton%></button>                                                                    
                                                            </div>                                                                   
                                                        </div>     
                                                    </div>
                                                </div>
                                                <% Next%>
                                            </div>
                                        <% Next%>
                                    </div>
                                    <hr class="separator" />
                                </div>
                            <% Next%>                                                        
                            
                        </div>
                    <%Next%>                                         
            </div>
        </div> 
        
       <div class="hidden">
            <select id="cinema-picker-source">
            <% For Each cinema In ViewModel.Cinemas%>                                                                   
                <option value="<%:cinema.LoyaltyCinema.ID%>"><%:cinema.Name%></option>                                                                   
            <% Next%>
            </select>
        </div>                
</div>     
</asp:Content>
