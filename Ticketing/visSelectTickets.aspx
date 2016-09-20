<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visSelectTickets.aspx.vb" Inherits="visInternetTicketing.visSelectTickets" MasterPageFile="~/Site.Master" %>
<%@ Register Assembly="InternetTicketing.Controls.WebForms" Namespace="InternetTicketing.Controls.WebForms" TagPrefix="vis" %>
<%@ Register Src="~/Controls/SessionOverview.ascx" TagPrefix="vis" TagName="SessionOverview" %>
<%@ Register Src="~/Controls/SignInRequiredWidget.ascx" TagPrefix="vis" TagName="SignInRequiredWidget" %>
<%@ Register Src="~/Controls/SignInWidget.ascx" TagPrefix="vis" TagName="SignInWidget" %>
<%@ Register Src="~/Controls/SignedInWidget.ascx" TagPrefix="vis" TagName="SignedInWidget" %>

<%@ Import Namespace="Vista.Cdn.Client" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Bundles" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.SocialMedia" %>
<%@ Import Namespace="Vista.Web" %>

<asp:Content ID="MetaTags" ContentPlaceHolderID="MetaTags" runat="server">
    <%= SocialMediaHtmlHelper.OpenGraphMetadata(MovieTitle,
                                               "movie",
                                               BrowsingUrls.GetMovieDetailsUrl(MovieIdentifier),
                                               ContentDelivery.EntityImage(CdnMediaType.FilmPosterGraphic, MovieIdentifier, 48, 48),
                                               [Shared].SiteTitle,
                                               String.Format(SessionOverview.SessionShowingTime, Formatter.FormatTime(SessionTime), CinemaName))%>
</asp:Content>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%: ContentDelivery.Css("IconButtons.css")%>
    <%: ContentDelivery.Css("SelectGrid.css")%>  
    <%: ContentDelivery.Css("PlusMinusNumeric.css")%>  
    <%: ContentDelivery.Css("CategoryTabs.css")%>   
    <%: ContentDelivery.Css("Ticketing/SessionOverview.css")%>  
    <%: ContentDelivery.Css("Ticketing/SelectTickets.css")%>

</asp:Content>

<asp:Content ID="Script" ContentPlaceHolderID="Script" runat="server" >
    <%: ContentDelivery.Script("Vista/PlusMinusNumeric/PlusMinusNumeric.js")%>  
    <%: ContentDelivery.Script("Vista/SelectTickets/CardHashDialog.js")%>
    <%: ContentDelivery.Script("Vista/SelectTickets/TicketList.js")%>
    <%: ContentDelivery.Script("Vista/SelectTickets/TicketVouchers.js")%>
    <%: ContentDelivery.Script("Vista/SelectTickets/ThirdPartyMemberTickets.js")%>
    <%: ContentDelivery.Script("Vista/SelectTickets/Page.js")%>
    <%: ContentDelivery.Script("Vista/Loyalty/TicketingSignInWidget.js")%>
    <%: ContentDelivery.ScriptBundle(JsBundles.SelectGrid)%>
        
    <script type="text/javascript">
        Vista.Urls.Ticket = {};
        Vista.Urls.Ticket.AddVoucherTicket = '<%= ResolveUrl(GetAjaxMethodUrl("AddVoucherTicket")) %>';
        Vista.Urls.Ticket.RemoveVoucherTicket = '<%= ResolveUrl(GetAjaxMethodUrl("RemoveVoucherTicket")) %>';

        Vista.Urls.Order = Vista.Urls.Order || {};
        Vista.Urls.Order.GetMemberTicketApproval = '<%= ResolveUrl("~/Api/Order/GetMemberTicketApproval")%>';
        Vista.Urls.Order.AddMemberTicket = '<%= ResolveUrl("~/Api/Order/AddMemberTicket")%>';
        Vista.Urls.Order.RemoveMemberTicket = '<%= ResolveUrl("~/Api/Order/RemoveMemberTicket")%>';

        Vista.Data.SelectTickets = {};
        Vista.Data.SelectTickets.cinemaId = <%= CurrentSession.CinemaId.ToJson() %>;
        Vista.Data.SelectTickets.sessionId = <%= Integer.Parse(CurrentSession.SessionId).ToJson() %>;

        Vista.Lang.Shared.Close = <%= InternetTicketing.Infrastructure.Localisation.Shared.Close.ToJson()%>;
        Vista.Lang.SelectTickets = {};
        Vista.Lang.SelectTickets.CantAddTicketsHeader = <%= SelectTickets.CantAddTicketsHeader.ToJson()%>;
        Vista.Lang.SelectTickets.CantAddTicketsDefaultMessage = <%= SelectTickets.CantAddTicketsDefaultMessage.ToJson()%>;
        Vista.Lang.SelectTickets.CantRemoveTicketsHeader = <%= SelectTickets.CantRemoveTicketsHeader.ToJson()%>;
        Vista.Lang.SelectTickets.CantRemoveTicketsMessageText = <%= SelectTickets.CantRemoveTicketsMessageText.ToJson()%>;
        Vista.Lang.SelectTickets.TicketsPartiallyApprovedHeader =  <%= SelectTickets.TicketsPartiallyApprovedHeader.ToJson()%>;
        Vista.Lang.SelectTickets.TicketsPartiallyApprovedDefaultMessage =  <%= SelectTickets.TicketsPartiallyApprovedDefaultMessage.ToJson()%>;
        Vista.Lang.SelectTickets.ClosePackageInfoDialog =  <%= SelectTickets.ClosePackageInfoDialog.ToJson()%>;
    </script>
</asp:Content>

<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
    <div id="select-tickets">
		<form id="frmSelectTickets" method="post" runat="server">
            <%:""%><%--This block is required to remove "errors" from displaying in the error list window whenever <%:%> or <%=%> blocks are used --%>

            <vis:BreadcrumbControl ID="BreadcrumbControl" runat="server"/>                   
            
            <div class="order-details">
                <vis:CountdownControl visible="False" runat="server" ID="countdownTimer" />
                <vis:CartControl ID="cart" runat="server"/>                               
            </div>
 
            <vis:SessionOverview runat="server" id="SessionOverviewControl" />
                                               
            <vis:SignInRequiredWidget id="SignInRequriedWidget" runat="server"></vis:SignInRequiredWidget>

            <asp:Panel runat="server" ID="SelectTicketsPanel">
                
               <h2><%:SelectTickets.Header1%><em><%=SelectTickets.Header2%></em></h2>
            

                <noscript class="no-script-warning">
                    <asp:Literal ID="txtNoScriptWarning" runat="server" />
                </noscript>


            
                <article class="main-page-blurb blurb">
                    <p><%:SelectTickets.BlurbInstructions%></p>
                    <p><%:String.Format(SelectTickets.BlurbMaxTickets, MaxTicketsPerTransaction)%></p>
                
                    <% If HasOnlineVoucherIntegration Then%>
                        <p><%:SelectTickets.BlurbVoucherTickets%></p>
                    <%End If %>
                </article>
                
                <div class="signin-widget">
                    <vis:SignInWidget id="SignInWidget" runat="server"></vis:SignInWidget>
                    <vis:SignedInWidget id="SignedInWidget" runat="server"></vis:SignedInWidget>
                </div>
            
                <% If OrderTicketsValidationFailed Then%>
                <span class="notification"></span><p class="error-text"><%: OrderTicketsValidationMessage%></p>
                <% ElseIf CookiesAreNotEnabled Then%>
                <span class="notification"></span><p class="error-text"><%: CookiesAreNotEnabledMessage%></p>
                <% End If%>
                

                <a id="ticket-selection"></a>
                
                <% If HasSimilarSessionsToChoose Then%>
                
                    <% If Not IsCheapestTicketAvailableForAllSimilarSessions Then%>
                        <div class="cheapest-ticket-today">
                            <%
                                Dim cheapestTicketDescriptionLabel As String = String.Format(SelectTickets.CheapestTicketTodayDescription, CheapestTicketDisplayPrice, CheapestTicketDisplayTimes)
                            %>
                            <span class="cheapest-ticket-label"><%:SelectTickets.CheapestTicketTodayLabel%></span><span class="cheapest-ticket-description"><%: cheapestTicketDescriptionLabel %></span>
                        </div>
                    <%End If%>

                    <div class="session-selector category-tabs">
                        <h2 class="session-selector-title"><%:SelectTickets.ChooseYourSessionTimeHeader1%><em><%:SelectTickets.ChooseYourSessionTimeHeader2%></em></h2>
                    
                        <ol class="session-list categories">
                            
                            <% For Each similarSession In SimilarSessionsForDisplay%>
                                <% Dim isCurrentSession = similarSession.ID = CurrentSession.ID %>
                                <% Dim tabUrl = If(isCurrentSession, "javascript:void(0)", TicketingUrls.GetSelectTicketsUrl(similarSession.CinemaId, similarSession.SessionId) & "#ticket-selection")%>
                                <li class="session-list-item <%: If(isCurrentSession, "ui-tabs-selected", "")%>"><a class="session-list-item-link" data-url="<%: tabUrl %>"><span class="similar-session-time"><%:Formatter.FormatTime(similarSession.Showtime)%></span><span class="similar-session-screen"><%:GetScreenName(similarSession)%></span></a></li>
                            <%Next%>
                        </ol>
                    </div>
                <%End If%>
                
                
                <div id="select-tickets-list-wrapper" class="category-tabs <%= If(HasSimilarSessionsToChoose, "has-similar-sessions", "") %>">              
                
                    <% If IsSeatFirstOrder Then%>

                        <div class="select-grid" data-max="<%: SeatsRequired()%>">
                            <% If HasOnlineVoucherIntegration Then%>
                                <%= RenderVoucherControl()%>
                            <%End If %>

                            <% For Each ticket In CategoryTabs.SelectMany(Function(c) c).OrderBy(Function(t) t.DisplaySequence).ThenBy(Function(t) t.Description)%>
                            <span class="select-grid-item">
                                <span class="select-grid-description"><%: Ticket.GetDisplayDescription().GetTranslation(IsPrimaryLanguage) %></span>
                                <span class="select-grid-value"><%: Formatter.FormatCurrency(GetTicketPriceInCents(ticket))%></span>
                                <select data-value="<%: GetTicketPriceInCents(ticket)%>" data-ticket-fee-for-display="<%: GetTicketFeeForDisplay(ticket) %>" data-ticket-fee-in-cents="<%: GetTicketFeeInCents(ticket) %>" data-weigh="<%: ticket.ChildTickets.Sum(Function(c) c.Quantity)%>" data-code="<%: ticket.TicketTypeCode%>" data-loyalty-recognition-id="<%: ticket.LoyaltyRecognitionId%>" data-loyalty-points-cost="<%: ticket.LoyaltyPointsCost%>" name="ticket-<%: ticket.TicketTypeCode %>;ltyRecogId-<%: ticket.LoyaltyRecognitionId %>;ltyRecogSeqNo-<%: ticket.LoyaltyRecognitionSequenceNumber%>">
                                        <option></option>
                                    <% For i = 1 To ticket.QuantityAvailablePerOrder%>
                                        <option><%: i%></option>
                                    <% next %>
                                </select>
                           
                                <span class="select-grid-footer">
                                    <span class="icon icon-small icon-clear"></span><span><%:SelectTickets.SubtotalHeader%>:<span class="select-grid-total"><%: Formatter.FormatCurrency(0, displayCurrencySymbol:=False)%></span></span>
                                </span>
                            </span>
                            <% Next%>
                        </div>
                        <div class="select-grid-counter">
                            <p><%:SelectTickets.SelectGridCounterText%></p>
                        </div>
                    <% Else%>

                    <ol class="categories" data-selected-tab-index="<%:GetSelectedCategoryTabIndex()%>">
                        <% For Each category In CategoryTabs%>
                            <%
                                Dim categoryTabId As String = GetTicketCategoryHtmlId(category.Key)
                                Dim categoryTabDisplayName As String = GetTicketCategoryDisplayName(category.Key)
                            %>
                            <li class="tab-list-item-<%:categoryTabId%>"><a href="#<%:categoryTabId%>"><%:categoryTabDisplayName%></a></li>
                        <%Next%>
                    
                        <% If HasThirdPartyMemberTickets Then%>
                            <li class="tab-list-item-thirdpartymembertickets"><a href="#category-third-party-member"><%:SelectTickets.TicketCategoryThirdPartyMember%></a></li>
                        <%End If %>
                    
                        <% If HasOnlineVoucherIntegration Then%>
                            <li><a href="#category-ticket-voucher"><%:SelectTickets.TicketCategoryVoucher%></a></li>
                        <%End If %>
                    </ol>
                        
                    <div class="ticket-list category-tabs-items">
                    
                        <% For Each category In CategoryTabs%>
                            <% Dim isDisplayingLoyaltyPointsCost = category.Any(Function(t) t.LoyaltyPointsCost IsNot Nothing)%>

                            <div id="<%:GetTicketCategoryHtmlId(category.Key)%>" class="tab <%: If(isDisplayingLoyaltyPointsCost, "grid-5-col", "grid-4-col") %>">
                        
                                <h6><%:SelectTickets.TicketTypeHeader%></h6><%--
                            --%><h6 <% If Not HasDynamicallyPricedTickets Then %> class="hidden" <% End If%>><%:SelectTickets.Available%> </h6><%--
                            --%><h6 <% If HasDynamicallyPricedTickets Then %> class="hidden" <% End If%>><%:SelectTickets.CostHeader%></h6><%--
                            --%><%If isDisplayingLoyaltyPointsCost Then%><%--
                                --%><h6><%:SelectTickets.PointsCostHeader%></h6><%--
                            --%><%End If %><h6><%:SelectTickets.QuantityHeader%></h6><%--
                            --%><h6 class="last-child"><%:SelectTickets.SubtotalHeader%></h6><%--
                            --%>
                    
                                <ul>
                            
                                <% For Each ticket In category.OrderBy(Function(t) t.DisplaySequence).ThenBy(Function(t) t.DisplaySubSequence).ThenBy(Function(t) t.Description)%>
                                    
                                                                
                            <%
                                Dim selectedTicketQuantity As Integer = GetSelectedTicketQuantity(ticket)
                                                               
                                Dim isExhaustedDynamicTicket As Boolean = ticket.IsDynamicallyPriced AndAlso ticket.QuantityAvailablePerOrder = 0 AndAlso selectedTicketQuantity = 0
                                Dim exhaustedDynamicTicketClass As String = If(isExhaustedDynamicTicket, "is-exhausted-dynamic-ticket", "")
                                Dim ticketDescriptionText As String = ticket.GetDisplayDescription().GetTranslation(IsPrimaryLanguage)
                                Dim ticketPriceWithCurrencyText As String = Formatter.FormatCurrency(GetTicketPriceInCents(ticket))
                                
                                Dim exhaustedDynamicTicketLabel As String = ""

                                If isExhaustedDynamicTicket Then
                                    exhaustedDynamicTicketLabel = String.Format("<span class=""exhausted-dynamic-ticket-label"">{0}</span>", SelectTickets.TicketSoldOutLabel)
                                End If
                            %>

                                    <li class="item <%:exhaustedDynamicTicketClass%><%:If(HasDynamicallyPricedTickets, " dynamic-pricing-display", "")%>"><%--
                                    --%><label for="<%: ticket.TicketTypeCode %>" class="desc">
                                            <% If HasDynamicallyPricedTickets Then%> <span class="ticket-price-description <%:If (ticket.IsDynamicallyPriced, "ticket-price-description-dynamic-price", "")%> "><%:ticketPriceWithCurrencyText%></span> <%End If%>
                                            <span class="ticket-name hidden"><%:ticketDescriptionText%></span>
                                            <span class="ticket-description"><%:ticketDescriptionText%><%= exhaustedDynamicTicketLabel %>
                                                <% If ticket.ChildTickets.Count > 0 Or ticket.ChildConcessionItems.Count > 0 Then%>
                                                    <button type="button" class="button-package-info icon icon-information"></button>
                                                    <span id="<%: ticket.HOPK %>" class="package-info-dialog hidden">
                                                        <p class="ticket-description"><%: ticket.Description %></p>
                                                        <p class="ticket-long-description"><%: ticket.LongDescription %></p>
                                                        <span class="label-line">
                                                            <span><%:SelectTickets.PackageInfoTicketDescription%></span>
                                                            <span><%:SelectTickets.PackageInfoTicketQuantity%></span>
                                                        </span>
                                                    <% For Each childTicket In ticket.ChildTickets%>
                                                        <span class="value-line">
                                                            <span><%: childTicket.GetDescription().GetTranslation(IsPrimaryLanguage) %></span>
                                                            <span><%: childTicket.Quantity %></span>
                                                        </span>
                                                    <% Next %>
                                                    <% For Each childItem In ticket.ChildConcessionItems%>
                                                        <span class="value-line">
                                                            <span><%: childItem.GetDisplayDescription().GetTranslation(IsPrimaryLanguage) %></span>
                                                            <span><%: childItem.Quantity %></span>
                                                        </span>
                                                    <% Next %>
                                                    </span>
                                                 <%End If%></span>
                                        </label><%--
                                    --%><span class="<%: If(HasDynamicallyPricedTickets, "", "hidden") %>"><%: If (ticket.IsDynamicallyPriced, ticket.QuantityAvailablePerOrder, "") %></span><%--
                                    --%><span class="item-fee hidden"><%: GetTicketFeeForDisplay(ticket) %></span><%--                                   
                                    --%><span class="price <%: If(HasDynamicallyPricedTickets, "hidden", "") %>" data-original="<%:GetTicketPriceInCents(ticket)%>" data-ticket-fee-in-cents="<%: GetTicketFeeInCents(ticket) %>">  <%:Formatter.FormatCurrency(GetTicketPriceInCents(ticket), displayCurrencySymbol:=False)%> </span><%--
                            --%><%If isDisplayingLoyaltyPointsCost Then%><%--
                                    --%><span class="points-cost" data-original="<%:ticket.LoyaltyPointsCost%>"><%:Formatter.FormatLtyPoints(If(ticket.LoyaltyPointsCost IsNot Nothing, ticket.LoyaltyPointsCost, 0))%></span><%--
                            --%><%End If %><%--
                                    --%><span class="ticket-quantity plus-minus-numeric"><%--
                                            --%><button type="button" class="minus icon icon-minus"></button><%--
                                            --%><input type="text" id="<%: ticket.TicketTypeCode %>" class="quantity" name="ticket-<%: ticket.TicketTypeCode %>;ltyRecogId-<%: ticket.LoyaltyRecognitionId %>;ltyRecogSeqNo-<%: ticket.LoyaltyRecognitionSequenceNumber%>" value="<%: selectedTicketQuantity %>" autocomplete="off" tabindex="1" min="0" max="<%: ticket.QuantityAvailablePerOrder %>" data-loyalty-recognition-id="<%: ticket.LoyaltyRecognitionId%>" data-allocated="<%: ticket.IsAllocatableSeating.ToJson()%>" <%:If(isExhaustedDynamicTicket, "disabled", "")%>/><%--
                                            --%><button type="button" class="plus icon icon-plus"></button><%--
                                     --%></span><%--
                                     --%><span class="sub-total last-child"><%: Formatter.FormatCurrency(GetTicketPriceInCents(ticket) * selectedTicketQuantity, displayCurrencySymbol:=False)%></span><%--
                                --%></li>                      
                                <% Next%>
                                </ul>
                            </div>
                        <% Next%>
                        
                        
                        <% If HasThirdPartyMemberTickets Then%>
                            <%= RenderThirdPartyMemberTicketsControl()%>
                        <%End If %>

                        <% If HasOnlineVoucherIntegration Then%>
                            <%= RenderVoucherControl()%>
                        <%End If %>
                    </div>

                    <% End If%>
 
                    <div id="divOrderTickets" class="<%: If(Not HasSelectedTicketsForThisSession, "not-applicable", "") %>">
				        <button id="ibtnOrderTickets" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%:SelectTickets.NextButton%></span></button>
			        </div>    
                </div>     
            

			    <asp:textbox id="txtMovieRating" runat="server" Visible="False"></asp:textbox>
			    <asp:textbox id="txtCinemaId" runat="server" Visible="False"></asp:textbox>
			    <asp:textbox id="txtSessionId" runat="server" Visible="False"></asp:textbox>
			    <asp:textbox id="txtCinemaName" runat="server" Visible="False"></asp:textbox>
			    <asp:textbox id="txtMovieName" runat="server" Visible="False"></asp:textbox>
			    <asp:textbox id="txtSessionDateTime" runat="server" Visible="False"></asp:textbox>
						
			    <input id="txtTechnicalDetails" type="hidden" name="txtTechnicalDetails" runat="server" />
			    <input id="txtDoNotRehydrate" type="hidden" name="txtDoNotRehydrate" runat="server" />
			    <input id="txtAllocatedSeating" type="hidden" name="txtAllocatedSeating" runat="server" />
			    <input id="txtForceSeatSelection" type="hidden" name="txtForceSeatSelection" runat="server" />
			    <input id="txtEnableManualSeatSelection" type="hidden" name="txtEnableManualSeatSelection" runat="server" />
			    <input id="txtHideAllVoucherRows" type="hidden" name="txtHideAllVoucherRows" runat="server" />
			    <input id="txtEnableConcessionSales" type="hidden" name="txtEnableConcessionSales" runat="server" />
			    <input id="txtVoucherSubmit" type="hidden" runat="server" />
			    <input id="txtVoucherPINSubmit" type="hidden" runat="server" />
			    <input id="txtDateOrderChanged" type="hidden" runat="server" />
			    <input id="txtCancelOrder" type="hidden" runat="server" />
            
            </asp:Panel>
		</form>
    </div>
</asp:Content>
