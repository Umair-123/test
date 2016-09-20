<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visConfirmation.aspx.vb" Inherits="visInternetTicketing.visConfirmation" enableViewState="False" MasterPageFile="~/Site.Master"%>
<%@ Register TagPrefix="vis" Namespace="InternetTicketing.Controls.WebForms" Assembly="InternetTicketing.Controls.WebForms" %>
<%@ Import Namespace="InternetTicketing.Domain.Configuration" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.SocialMedia" %>
<%@ Import Namespace="visInternetTicketing" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%=ContentDelivery.Css("Ticketing/Confirmation.css").ToString()%>   
</asp:Content>

<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
        <vis:BreadcrumbControl ID="BreadcrumbControl" runat="server"/>
        
        <button id="print-page" class="user-action"><span class="icon icon-print"><%:Confirmation.PrintPage%></span></button>

        <h2><%:Confirmation.Header1%><em><%=Confirmation.Header2%></em></h2>
		
		<form id="Form1" method="post" runat="server" autocomplete="off">
            <%: ""%><%--This block is required to remove "errors" from displaying in the error list window whenever <%:/= blocks are used %>--%>

            <% If HasErrors Then%>
                <span class="notification"></span>
                <p class="error-text">
                    
                    <%
                        Dim errorTextDetails As String
                        If HasSentEmailConfirmation Then
                            errorTextDetails = Confirmation.ErrorTextWithEmailConfirmation
                        ElseIf HasSentSmsConfirmation Then
                            errorTextDetails = Confirmation.ErrorTextWithSmsConfirmation
                        Else
                            errorTextDetails = Confirmation.ErrorTextWithNoDetailsSent
                        End If
                    %>

                    <%:String.Format(Confirmation.ErrorText, errorTextDetails)%>
                </p>
            <% ElseIf HasSmsConfirmationFailed Then%>
            <span class="notification"></span><p class="error-text"><%=Confirmation.SmsConfirmationFailedText%></p>
            <% ElseIf HasFailedLoyaltyPointsAccrual Then%>
            <span class="notification"></span><p class="error-text"><%=Confirmation.LoyaltyUpdateErrorText%></p>
            <% End If%>
           
           
           <% If Not HasErrors%>
            
                <p id="order-confirmation">
                   <%: ConfirmationMessage %>
               </p>
            
            <% If Order.IsOnlineShopOrder Then%>
                <p class="gift-store-order-delivery-details">
                    <span><%:Confirmation.GiftStoreOrderBlurb%></span>
                    <%If HasShippedItems Then%>
                        <span>&nbsp;<%:Confirmation.GiftStoreShippedItemsInformation%></span>
                    <%End If%>
                    <%If HasElectronicallyDeliveredItems Then%>
                        <span>&nbsp;<%:Confirmation.GiftStoreEVoucherItemsInformation%></span>
                    <%End If%>
                    <%If HasPickupRequiredItems Then%>
                        <span>&nbsp;<%:Confirmation.GiftStorePickedRequiredItemsInformation%></span>
                    <%End If%>
                </p>
            <% Else%>
               <p id="pickup-info">
                   <% If IsPrintAtHomeEnabled Then%>
                   <%:Confirmation.PickupInformationWithPrintAtHome%>
                   <%Else%>
                   <%:Confirmation.PickupInformation%>
                   <%End If %>
                   <em><%:Confirmation.PickupInformationReminder%></em>
               </p>           
            <% End If%>

            <section id="booking-overview" class="<%:GetBookingOverviewColumnClass()%>">
                
                <section id="booking-details">
                    <h5><%: If(Order.IsOnlineShopOrder, Confirmation.GiftStoreOrderDetailsHeader, Confirmation.BookingDetailsHeader)%></h5>
                    <p><label><%:Confirmation.ReferenceNumber%></label><span><%:Order.BookingId%></span></p>
                    <% If IsDisplayingBookingNumber Then%>
                    <p><label><%:Confirmation.BookingNumber%></label><span><%:Order.BookingNumber%></span></p>
                    <% End If %>
                    
                    <% If Not Order.IsOnlineShopOrder Then%>
                    <p><label><%:Confirmation.CinemaLabel%></label><span><%: Cinema.GetDisplayName().GetTranslation(IsPrimaryLanguage)%></span></p>
                    <% End If%>

                    <%If Not String.IsNullOrEmpty(Order.CustomerFullName) Then%>
                    <p><label><%:Confirmation.CustomerName%></label><span><%:Order.CustomerFullName%></span></p>
                    <%End If%>
                    
                    <% If Not String.IsNullOrEmpty(Order.PickupComments) Then%>                
                    <p><label><%:Confirmation.PickupComments%></label><span><%:Order.PickupComments%></span></p>
                    <%End If %>
                                        
                    <% If Order.IsOnlineShopOrder AndAlso Order.OrderDelivery IsNot Nothing AndAlso Order.OrderDelivery.HasAnyDeliveryAddressDetails Then%>
                    <p>
                        <label><%:Confirmation.DeliveryAddress%></label><%--
                        --%><span class="delivery-address">
                            <%For Each addressLine In Order.OrderDelivery.DeliveryAddress.GetPopulatedPhysicalAddressLines()%>
                                <span class="delivery-address-line"><%:addressLine%></span>
                            <%Next%>
                        </span>
                    </p>
                    <% End If%>                                    
                </section>

                <%If IsShowingLoyaltyPointsAccrual OrElse HasFailedLoyaltyPointsAccrual OrElse IsShowingLoyaltyGiftCardBalance Then%>                
                    <section id="loyalty-details">
                        <h5><%:Confirmation.LoyaltyDetailsHeader%></h5>
                        <p><label><%:Confirmation.LoyaltyPointsEarned%></label><span><%:If(Not HasFailedLoyaltyPointsAccrual AndAlso (LoyaltyPointsBalance IsNot Nothing), LoyaltyPointsBalance.PointsAccrued, Confirmation.PointsUnavailable)%></span></p>
                        <p><label><%:Confirmation.LoyaltyPointsTotal%></label><span><%:If(Not HasFailedLoyaltyPointsAccrual AndAlso (LoyaltyPointsBalance IsNot Nothing), LoyaltyPointsBalance.PointsTotal, Confirmation.PointsUnavailable)%></span></p>            
                        <p><label><%: Confirmation.LoyaltyGiftCardBalance %></label><span><%: If(Not HasFailedLoyaltyPointsAccrual AndAlso (LoyaltyGiftCardBalance IsNot Nothing), LoyaltyGiftCardBalance.Value.ToString("c"), Confirmation.PointsUnavailable)%></span></p>
                    </section>
                <%End If%>

                <% If BankDisplayData IsNot Nothing Then%>
                    <section id="payment-details">
                        <h5><%:Confirmation.PaymentDetailsHeader%></h5>
                        <%For Each item In BankDisplayData.DataItems%>
                            <p><label><%:item.Name%></label><span><%:item.Value%></span></p>
                        <%Next%>
                    </section>
                <%End If%>
            </section>
            
            <section id="order-details" class="<%:GetOrderDetailsColumnClass()%>">
                <h5><%:Confirmation.OrderDetailsHeader%></h5>
                <hgroup><%--
                    --%><h6><%:Confirmation.OrderDetailsItemColumnHeader%></h6><%--
                    --%><h6><%:Confirmation.OrderDetailsQtyColumnHeader%></h6><%--
                    --%><h6><%: If(Order.IsOnlineShopOrder, Confirmation.OrderDetailsDeliveryMethodColumnHeader, Confirmation.OrderDetailsSeatAllocationColumnHeader)%></h6><%--                    
                    --%><%If IsShowingOrderItemPointsCost Then%><%--
                    --%><h6><%:Confirmation.OrderDetailsPointsUsedColumnHeader%></h6><%--
                    --%><%End If%><%--
                    --%><h6 class="last-child"><%:Confirmation.OrderDetailsSubtotalColumnHeader%></h6><%--
                --%></hgroup>

                <%  Dim sessions = Order.Sessions.ToList()
                    If SessionsSortOrder = BasketSessionsSortOrder.Showtime Then
                        sessions = sessions.OrderBy(Function(s) s.Showtime).ToList()
                    End If
                        
                    For Each orderSession In sessions%>
                    <section class="session-details">
                        <p class="movie-name"><%:orderSession.GetDisplayFilmName().GetTranslation(IsPrimaryLanguage)%></p>
                        <p class="screening-details"><%--
                            --%><time class="session-time"><%:FormattingService.FormatShortDateAndTime(orderSession.Showtime)%></time><%--
                            --%><span class="screen-name"><%:GetFullLocationForSession(orderSession)%></span><%--
                        --%></p>

                    <%For Each ticketGroup In GetGroupedTicketListForDisplay(orderSession.Tickets)%>
                        <p class="detail-line ticket"><%--
                            --%><span class="desc"><%:UIUtilities.GetTicketDisplayDescription(ticketGroup, IsPrimaryLanguage)%> <span><%: GetTicketFeeForDisplay(ticketGroup) %></span></span><%--
                            --%><span class="qty"><%:ticketGroup.Quantity%></span><%--
                            --%><span class="seat-info"><%:UIUtilities.GetSeatTextFromSeatInfo(ticketGroup.SeatInfoList, RowSeatSeparator)%></span><%--
                    
                            --%><%If IsShowingOrderItemPointsCost Then%><%--
                            --%><span class="points-cost"><%:FormattingService.FormatLtyPoints(ticketGroup.LoyaltyPointsCost)%></span><%--
                            --%><%End If %><%--
                            
                            --%><span class="cost last-child"><%:FormattingService.FormatCurrency(GetTicketPriceInCents(ticketGroup), displayCurrencySymbol:=False)%></span><%--
                        --%></p>
                    <%Next%>

                    <%If orderSession.Concessions IsNot Nothing Then
                            For Each concession In orderSession.Concessions%>
                        <p class="detail-line concession"><%--
                            --%><span class="desc"><%:concession.GetDisplayDescription().GetTranslation(IsPrimaryLanguage)%></span><%--
                            --%><span class="qty"><%:concession.Quantity%></span><%--
                            --%><span class="seat-info">-</span><%--
                            
                            --%><%If IsShowingOrderItemPointsCost Then%><%--
                            --%><span class="points-cost"><%:FormattingService.FormatLtyPoints(concession.LoyaltyPointsCost)%></span><%--
                            --%><%End If%><%--

                            --%><span class="cost last-child"><%:FormattingService.FormatCurrency(concession.TotalPriceInCents, displayCurrencySymbol:=False)%></span><%--
                        --%></p>
                        <%Next
                    End If%>

                    <p class="amount sub-total"><%--
                        --%><label><%:Confirmation.OrderDetailsSubtotalLabel%></label><%--
                        --%><span><%:FormattingService.FormatCurrency(GetOrderSessionSubtotal(orderSession), displayCurrencySymbol:=False)%></span><%--
                    --%></p><%--
                --%></section>
                <%Next%>
                
                <% If Order.GiftStoreConcessions.Any() Then %>
                    <section class="session-details">
                        <% For Each concession In Order.GiftStoreConcessions%>
                            <p class="detail-line concession"><%--
                            --%><span class="desc"><%:concession.GetDisplayDescription().GetTranslation(IsPrimaryLanguage)%></span><%--
                            --%><span class="qty"><%:concession.Quantity%></span><%--
                            --%><span class="delivery-method"><%: GetDeliveryMethodNameForConcession(concession)%></span><%--
                            
                            --%><%If IsShowingOrderItemPointsCost Then%><%--
                            --%><span class="points-cost"><%:FormattingService.FormatLtyPoints(concession.LoyaltyPointsCost)%></span><%--
                            --%><%End If%><%--

                            --%><span class="cost last-child"><%:FormattingService.FormatCurrency(concession.TotalPriceInCents, displayCurrencySymbol:=False)%></span><%--
                        --%></p>
                        <% Next%>
                    </section>
                <% End If%>

                <section class="order-totals">
                    <%If GetTotalTicketFeeInCents(Order) > 0 Then%>
                        <p class="amount"><%--
                        --%><label><%:Confirmation.OrderDetailsTicketFeeLabel%></label><%--
                        --%><span><%:FormattingService.FormatCurrency(GetTotalTicketFeeInCents(Order), displayCurrencySymbol:=False)%></span><%--
                    --%></p>
                    <%End If%>
                    <%If Order.BookingFeeInCents > 0 Then%>
                    <p class="amount booking-fee"><%--
                        --%><label><%:Confirmation.OrderDetailsBookingFeeLabel%></label><%--
                        --%><span><%:FormattingService.FormatCurrency(Order.BookingFeeInCents, displayCurrencySymbol:=False)%></span><%--
                    --%></p>
                    <%ElseIf Order.IsOnlineShopOrder Then%>
                    <p class="amount frieght"><%--
                        --%><label><%:Confirmation.OrderDetailsFreightFeeLabel%></label><%--
                        --%><span><%:FormattingService.FormatCurrency(Order.FreightValueInCents, displayCurrencySymbol:=False)%></span><%--
                    --%></p>
                    <%End If%>
                    <p class="amount total"><%--
                        --%><label><%:Confirmation.OrderDetailsTotalAmountLabel%></label><%--
                        --%><span><%:FormattingService.FormatCurrency(Order.TotalPrice) %></span><%--
                    --%></p>
                </section>
            </section>
            

            <% If Order.Sessions.Any() Then%>

            <div class="social-invites">
                <% If DisplayFacebookSendButton OrElse DisplayTwitterShareButton Then %>
                <p class="invite-label"><%:Confirmation.InviteFriendsLabel%>:</p>
                <% End If %>
                <% If DisplayFacebookSendButton Then %>
                    <%= SocialMediaHtmlHelper.FacebookSendButton(TicketingUrls.GetSelectTicketsUrl(Order.CinemaId, Order.Sessions.FirstOrDefault().Id.ToString())) %>
                <% End If %>
                <% If DisplayTwitterShareButton Then %>
                    <div class="twitter-send">
                        <% Dim movieName As String = TwitterHashTags.Aggregate(Function(currentTag, nextTag) currentTag & " " & nextTag)
                           Dim cinemaName As String = Cinema.GetDisplayName().GetTranslation(IsPrimaryLanguage)
                           Dim movieDateTime As String = FormattingService.FormatShortDateAndTime(Order.Sessions.First().Showtime)
                           Dim tweetText As String = String.Format(Confirmation.TwitterInviteFriends, movieName, cinemaName, movieDateTime) %>
                        <%= SocialMediaHtmlHelper.TwitterShareUrlButton(TicketingUrls.GetSelectTicketsUrl(Order.CinemaId, Order.Sessions.FirstOrDefault().Id.ToString()), TwitterHashTags, tweetText) %>
                    </div>
                <% End If %>
            </div>
            
            <% End If %>

            <div class="button-list button-list-single">
                <%If IsPrintAtHomeEnabled Then%>
                <a id="print-tickets" class="page-action" href="<%=PrintAtHomePdfUrl %>" target="_blank"><span><%:Confirmation.PrintTickets%></span></a>
                <%End If%>
            </div>

            <%End If%>
            
			<input id="cinemaid" type="hidden" runat="server" name="cinemaid" />
			<input id="transno" type="hidden" runat="server" name="transno" />
			<input id="txtCinemaName" type="hidden" runat="server" name="txtCinemaName" />
            <input id="txtSessionTime" type="hidden" runat="server" name="txtSessionTime" />
			<input id="txtMovieName" type="hidden" runat="server" name="txtMovieName" />
            <input id="txtSessionDate" type="hidden" runat="server" name="txtSessionDate" />
			<input id="txtBookingFee" type="hidden" runat="server" name="txtBookingFee" />
			<input id="txtOrderTotal" type="hidden" runat="server" name="txtOrderTotal" />
            <input id="txtTicketInfo" type="hidden" runat="server" name="txtTicketInfo" />
			<input id="txtConcessionInfo" type="hidden" runat="server" name="txtConcessionInfo" />
			<input id="txtOrderId" type="hidden" runat="server" name="txtOrderId" />
			<input id="txtBookingNo" type="hidden" runat="server" name="txtBookingNo" />
			<input id="txtBookingId" type="hidden" runat="server" name="txtBookingId" />
            <input id="txtPickupComments" type="hidden" runat="server" name="txtPickupComments" />
            <input id="txtCustomerName" type="hidden" runat="server" name="txtCustomerName" />
			<input id="txtTicketVoucherSet" type="hidden" runat="server" name="txtVoucherSet" />
			<input id="txtEmail" type="hidden" runat="server" name="txtEmail" />
			<input id="txtPrintAtHome" type="hidden" name="txtPrintAtHome" runat="server" />
            <input id="txtCinEmailDisplayName" type="hidden" name="txtEmailDisplayName" runat="server" />
			<input id="txtCinEmailFromAddress" type="hidden" name="txtEmailFromAddress" runat="server" />
            <input id="txtSMSSuccess" type="hidden" name="txtSMSSuccess" runat="server" />
			<input id="txtCinEmailCopyAddress" type="hidden" name="txtEmailCopyAddress" runat="server" />
			<input id="txtLtyTimeoutErr" type="hidden" name="txtLtyTimeoutErr" runat="server" />
            <input id="txtLtyBalances" type="hidden" name="txtLtyBalances" runat="server" />
			<input id="txtEmailSent" type="hidden" name="txtEmailSent" runat="server" />
            <input id="txtTransNo" type="hidden" runat="server" name="txtTransNo" />
			<input id="txtCardInVista" type="hidden" name="txtCardInVista" runat="server" />
            <input id="txtCinemaID" type="hidden" runat="server" name="txtCinemaID" />
		</form>

</asp:Content>

<asp:Content ID="Script" ContentPlaceHolderID="Script" runat="server">
    <%=ContentDelivery.Script("Vista/Confirmation/Confirmation.js").ToString()%>
    <%=ContentDelivery.Script("Vista/SocialMedia/FacebookJavascriptSDK.js").ToString()%>
    <%=ContentDelivery.Script("Vista/SocialMedia/TwitterWidgets.js").ToString()%>
</asp:Content>