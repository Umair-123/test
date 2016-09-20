<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="ThirdPartyMemberTicketsControl.ascx.vb" Inherits="visInternetTicketing.Controls.ThirdPartyMemberTicketsControl" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="Vista.Web" %>

<div id="category-third-party-member" class="third-party-ticket-control tab grid-5-col">
    
    
    <h6 class="first-child"><%:SelectTickets.TicketTypeHeader%></h6><%--
--%><h6><%:SelectTickets.QuantityHeader%></h6><%--
--%><h6><%:SelectTickets.CardNumberHeader%></h6><%--
--%><h6 class="sub-total-header not-applicable"><%:SelectTickets.SubtotalHeader%></h6><%--
--%>
       
    <ul>                        
        <% For Each ticket In ThirdPartyMemberTickets.OrderBy(Function(t) t.DisplaySequence).ThenBy(Function(t) t.DisplaySubSequence).ThenBy(Function(t) t.Description)%>
                                                                                                    
            <%
                Dim orderedTicket As Vista.Connect.GroupedTicket = GetTicketInOrderForTicketType(ticket)

                Dim ticketDescriptionText As String = ticket.GetDisplayDescription().GetTranslation(IsPrimaryLanguage)
                Dim ticketQuantity As Integer = If(orderedTicket IsNot Nothing, orderedTicket.Quantity, 0)
            %>

            <li class="item"><%--
                --%><label for="<%: ticket.TicketTypeCode %>" class="desc"><%--
                    --%><span class="ticket-description"><%:ticketDescriptionText%></span><%--
                --%></label><%--
                --%><span class="ticket-quantity plus-minus-numeric"><%--
                    --%><button type="button" class="minus icon icon-minus" tabindex="-1"></button><%--
                    --%><input type="text" id="<%: ticket.TicketTypeCode %>" class="quantity" name="ticket-<%: ticket.TicketTypeCode %>;ltyRecogId-<%: ticket.LoyaltyRecognitionId %>;ltyRecogSeqNo-<%: ticket.LoyaltyRecognitionSequenceNumber%>" value="<%: ticketQuantity%>" autocomplete="off" min="0" max="<%: ticket.QuantityAvailablePerOrder %>" data-loyalty-recognition-id="<%: ticket.LoyaltyRecognitionId%>" data-allocated="<%: ticket.IsAllocatableSeating.ToJson()%>" /><%--
                    --%><button type="button" class="plus icon icon-plus" tabindex="-1"></button><%--
                --%></span><%--
                --%><span class="third-party-member-ticket-card-number-entry"><%--
                    --%>
                    <%If ticket.LimitToCardPaymentPromotions Then%>
                        <input type="text" name="third-party-member-ticket-card-number" class="third-party-member-ticket-card-number card-promotion" value="<%:GetDefaultCardNumberForTicketType(ticket, orderedTicket)%>" data-default-value="<%:GetDefaultCardNumberForTicketType(ticket, orderedTicket)%>" autocomplete="off" />
                        <button type="button" class="user-action verify-third-party-card-promotion-button" data-card-brand="<%: ticket.CardPaymentPromotionBrand%>" data-card-cobrand="<%: ticket.CardPaymentPromotionCoBrand%>" data-card-verifier-url="<%: If(ticket.MemberModuleCardVerifier IsNot Nothing, ticket.MemberModuleCardVerifier.CardVerifierUrl, Nothing)%>" data-card-verifier-width="<%: If(ticket.MemberModuleCardVerifier IsNot Nothing, ticket.MemberModuleCardVerifier.Width, Nothing)%>" data-card-verifier-height="<%: If(ticket.MemberModuleCardVerifier IsNot Nothing, ticket.MemberModuleCardVerifier.Height, Nothing)%>" ><span><%:SelectTickets.ThirdPartyMemberTicketVerifyCardButton%></span></button>
                    <%Else%>
                        <input type="text" name="third-party-member-ticket-card-number" class="third-party-member-ticket-card-number" value="<%:GetDefaultCardNumberForTicketType(ticket, orderedTicket)%>" data-default-value="<%:GetDefaultCardNumberForTicketType(ticket, orderedTicket)%>" autocomplete="off" /><!--
                     --><button type="button" class="user-action verify-third-party-member-ticket-button"><span><%:SelectTickets.ThirdPartyMemberTicketVerifyCardButton%></span></button>
                    <%End If%>
                </span><%-- 
                --%><span class="sub-total"></span><%--
                --%><span class="last-step-button-list last-child"><button type="button" class="user-action not-applicable clear-third-party-member-ticket-verification-button"><span class="icon icon-clear-666"><%:SelectTickets.ThirdPartyMemberTicketClearButton%></span></button><button type="button" class="user-action not-applicable add-third-party-member-ticket-to-order-button"><span class="icon icon-add"><%:SelectTickets.ThirdPartyMemberTicketVerifyConfirmButton%></span></button></span><%--


                --%><%       
                        Dim orderedMemberTicketQuantityText As String
                        Dim orderedMemberTicketMemberCardNumber As String
                        Dim orderedMemberTicketPriceText As String
                        
                        If orderedTicket IsNot Nothing Then
                            
                            orderedMemberTicketQuantityText = String.Format("{0}x", ticketQuantity)
                            If Not ticket.LimitToCardPaymentPromotions Then
                                orderedMemberTicketMemberCardNumber = String.Format("({0})", orderedTicket.ThirdPartyMemberCardNumber)
                            Else
                                orderedMemberTicketMemberCardNumber = ""
                            End If
                            orderedMemberTicketPriceText = Formatter.FormatCurrency(GetTicketPriceInCents(orderedTicket), True)
                    %>
                <div class="third-party-member-ticket-line" data-ticket-code="<%: orderedTicket.TicketTypeCode%>" data-allocated="<%: orderedTicket.IsAllocatedSeat.ToJson()%>" data-seat-count="<%: ticket.SeatCount%>"><%--
                --%><button type="button" class="icon-button-clear remove-third-party-member-ticket"></button><%--
                --%><span class="third-party-member-ticket"><%--
                    --%><span class="quantity"><%:orderedMemberTicketQuantityText%></span><%--
                    --%><span class="desc"><%:ticketDescriptionText%></span><%--
                    --%><span class="member-card-number"><%:orderedMemberTicketMemberCardNumber%></span><%--
                    --%><span class="price"><%:orderedMemberTicketPriceText%></span><%--
                --%></span>
                </div>
                        <%End If
                    %><%--
        --%></li>                      
        <% Next%>
    </ul>
    <input id="VistaUserSessionId" type="hidden" name="VistaUserSessionId" value="<%:UserSessionId%>" />
</div>
