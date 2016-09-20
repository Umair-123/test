<%@ Page Language="vb" AutoEventWireup="false" Codebehind="visSelectSeats.aspx.vb" Inherits="visInternetTicketing.visSelectSeats" MasterPageFile="~/Site.Master" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="Vista.Web" %>
<%@ Register Assembly="visWebSeatingControl" Namespace="visWebSeatingControl" TagPrefix="seatplan" %>
<%@ Register Assembly="InternetTicketing.Controls.WebForms" Namespace="InternetTicketing.Controls.WebForms" TagPrefix="vis" %>
<%@ Register Src="~/Controls/SessionOverview.ascx" TagPrefix="vis" TagName="SessionOverview" %>
<%@ Register Src="~/Controls/SignInRequiredWidget.ascx" TagPrefix="vis" TagName="SignInRequiredWidget" %>
<%@ Register Src="~/Controls/SignInWidget.ascx" TagPrefix="vis" TagName="SignInWidget" %>
<%@ Register Src="~/Controls/SignedInWidget.ascx" TagPrefix="vis" TagName="SignedInWidget" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%: ContentDelivery.Css("RadioButtonGroup.css")%>
    <%: ContentDelivery.Css("Ticketing/SessionOverview.css")%>
    <%: ContentDelivery.Css("Ticketing/SelectSeats.css")%>   
</asp:Content>

<asp:Content ID="Script" ContentPlaceHolderID="Script" runat="server">
    <%If Not IsInLoginRequiredMode Then%> 
        <script type="text/javascript" src="SeatingControl.js?v4.3"></script>
    <%End If%>
    
    <%: ContentDelivery.Script("Vista/SelectSeats/Page.js")%>
    <%: ContentDelivery.Script("Vista/SelectSeats/AreaSelector.js")%>
    <%: ContentDelivery.Script("Vista/Loyalty/TicketingSignInWidget.js")%>

    <script type="text/javascript">
        Vista.SelectSeats.Data = {};
        Vista.SelectSeats.Data.tickets = {};

        <% For Each ticketForAreaCategory In DefaultTicketTypes%>
        Vista.SelectSeats.Data.tickets['<%: ticketForAreaCategory.Key%>'] = {
            description: <%= ticketForAreaCategory.Value.GetDisplayDescription().GetTranslation(IsPrimaryLanguage).ToJson()%>,
            priceInCents: <%= ticketForAreaCategory.Value.PriceInCents.ToJson()%>,
            seatCount: <%= ticketForAreaCategory.Value.SeatCount%>
        };
        <% Next %>

        Vista.SelectSeats.Data.ticketCount = {};

        <% For Each ticketCount in TicketTypeCount  %>
        Vista.SelectSeats.Data.ticketCount['<%: ticketCount.Key%>'] = <%: ticketCount.Value%>;
        <% Next %>
        
        Vista.SelectSeats.Data.unallocatedAreas = {};

        <% For Each kv In IsAllocated.Where(Function(a) Not a.Value)%>
        Vista.SelectSeats.Data.unallocatedAreas['<%: kv.Key%>'] = true;
        <% Next %>
    </script>

</asp:Content>

<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
<div id="select-seats">
        <form id="frmSelectSeats" method="post" runat="server">
            <vis:BreadcrumbControl ID="breadcrumbControl" runat="server"/>
            <vis:CountdownControl runat="server" ID="countdownTimer"/>
            <vis:CartControl ID="cartControl" runat="server"/>
            <vis:SessionOverview runat="server" id="SessionOverviewControl" />
    
            <vis:SignInRequiredWidget id="SignInRequriedWidget" runat="server"></vis:SignInRequiredWidget>
            
            <asp:Panel runat="server" ID="SelectSeatsPanel">

                <h2><%: SelectSeats.Header1%><em><%: SelectSeats.Header2%></em></h2>
    
                <vis:SignInWidget id="SignInWidget" runat="server"></vis:SignInWidget>
                <vis:SignedInWidget id="SignedInWidget" runat="server"></vis:SignedInWidget>
   
                <div id="select-seats-container">
                    <% If Not String.IsNullOrEmpty(ErrorMessage) Then%>
                        <span class="notification"></span><p class="error-text"><%: ErrorMessage%></p>
                    <% End If%>
            
                    <% If AreaCategories IsNot Nothing AndAlso AreaCategories.Count > 1 Then%>
                        <h3><%: SelectSeats.SeatingArea%></h3>
                        <div class="seating-area-select"> 
                            <div class="radio-button-group">
                                <% For Each area In AreaCategories%>
                                    <input value="<%: area.ID%>" type="radio" id="seating-area-<%: area.ID%>" name="seating-area" <%= If(area.ID = ActiveAreaCategory, "checked=""checked""", "")%> /><%--
                                --%><label for="seating-area-<%: area.ID%>"><%: area.GetDescription().GetTranslation(IsPrimaryLanguage)%></label>
                                <% Next%>
                            </div>
                        </div>
                    <% End If%>
            
                    <%
                        Dim seatsLegend As New List(Of String())
                        seatsLegend.Add({SelectSeats.SeatAutoReserved, "images/seating/25/standard_selected.png"})
                        seatsLegend.Add({SelectSeats.SeatEmpty, "images/seating/25/standard_available.png"})

                        If ShowWheelchairSeats Then
                            seatsLegend.Add({SelectSeats.SeatWheelchair, "images/seating/25/wheelchair_available.png"})
                            seatsLegend.Add({SelectSeats.SeatCompanion, "images/seating/25/companion_available.png"})
                        End If

                        If ShowSofaSeats Then
                            seatsLegend.Add({SelectSeats.SeatSofa, "images/seating/25/standard_sofa_left_available.png", "images/seating/25/standard_sofa_right_available.png"})
                        End If

                        If ShowHouseSeats Then
                            seatsLegend.Add({SelectSeats.SeatHouse, "images/seating/25/house_available.png"})
                        End If

                        seatsLegend.Add({SelectSeats.SeatSold, "images/seating/25/sold.png"})

                        If ShowPlaceholderSeats Then
                            seatsLegend.Add({SelectSeats.SeatPlaceholder, "images/seating/25/unavailable.png"})
                        End If
           
            
                        ' ADDING New SEATS
                        ' To add different seat images, add the code segment below, above this comment.
                        '
                        '       seatsLegend.Add({"Seat description", "images/seating/25/seat_8.png"})
                        '
                        ' Change the label and image URL to the correct values.
                        ' 
                    %>
        
                    <% If Not HideAllSeatViews Then%>
                        <div id="divLegend">
                            <% For Each legend In seatsLegend%>
                                <span class="legend-container">
                                    <% For i = 1 To legend.Length - 1%><img src="<%: legend(i)%>" alt="<%: legend(0)%>" /><% Next %>
                                    <span class="Legend"><%: legend(0)%></span>
                                </span>
                            <% Next%>
                        </div>
                    
                        <div id="divSeatMap" class="Screen-AllAreas" runat="server">
                            <div>
                                <seatplan:SeatingControl id="objSeatPlan" runat="server" />
                            </div>
                        </div>

                        <button runat="server" class="page-action" type="button" data-js-buttonwatch="true" data-js-buttonwatch-optionalclass="page-action-disabled" id="ibtnNext"><span><%: SelectSeats.ButtonNext %></span></button>
                    <% End If%>
                </div>

                            
            </asp:Panel>
                        
            <input id="txtSeatInfo" type="hidden" runat="server" />
            <input id="txtDateOrderChanged" type="hidden" runat="server" />
            <input id="txtSeatSelectionTemp" type="hidden" runat="server" />
            <input id="txtSeatFirstSeatCount" type="hidden" runat="server"/>
        </form>
</div>

</asp:Content>
