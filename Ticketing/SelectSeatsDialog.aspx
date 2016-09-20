<%@ Page Language="vb" AutoEventWireup="false" Codebehind="SelectSeatsDialog.aspx.vb" Inherits="visInternetTicketing.SelectSeatsDialog" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="Vista.Web" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Bundles" %>
<%@ Import Namespace="Vista.Connect" %>
<%@ Register Assembly="InternetTicketing.Controls.WebForms" Namespace="InternetTicketing.Controls.WebForms" TagPrefix="vis" %>
<%@ Register Assembly="visWebSeatingControl" Namespace="visWebSeatingControl" TagPrefix="seatplan" %>
<!DOCTYPE html>
<html<%= If(IsAltLang, " class=""alt-lang""", "")%>>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

        <title><%=[Shared].SiteTitle%></title>
        <link rel="shortcut icon" href="<%=ContentDelivery.Image("favicon.ico") %>" />

        <%=ContentDelivery.CssBundle(CssBundles.MasterPage).ToString()%>     
        <%=ContentDelivery.CssBundle(CssBundles.TicketingPages).ToString()%>     

        <%: ContentDelivery.Css("RadioButtonGroup.css")%>
        <%: ContentDelivery.Css("Ticketing/SessionOverview.css")%>
        <%: ContentDelivery.Css("Ticketing/SelectSeats.css")%>
        <%: ContentDelivery.Css("Ticketing/SelectSeatsPopup.css")%>

        <%=ContentDelivery.ScriptBundle(JsBundles.MasterPageHead).ToString()%>     
        
        <!--[if lte IE 8]>
            <%: ContentDelivery.Css("IE8.css") %>
        <![endif]-->
        
        <!--[if lte IE 7]>
            <%: ContentDelivery.Css("Ticketing/IE7.css")%>
            <%: ContentDelivery.Css("IE7.css")%>
        <![endif]-->

       <!--[if IE 6]>
            <%: ContentDelivery.Css("Ticketing/IE6.css") %> <%-- TODO: integrate with bundle? --%>
            <%: ContentDelivery.CssBundle(CssBundles.InternetExplorer6)%>
       <![endif]-->   
        
        <%-- Link in custom CSS files here, the path is relative to the CDN's /Css directory, e.g for /Css/Custom.css
            <%: ContentDelivery.Css("Custom.css") %> 
        --%>
    </head>
    <body>

        <div id="select-seats">
            <form id="frmSelectSeats" method="post" runat="server">
    
                
                    <vis:CountdownControl runat="server" ID="countdownTimer"/>
                    <h2><%: SelectSeats.ChangeYourSeats %></h2>

                    <br style="clear: both;"/>
                    
                    <div id="select-seats-tabs">
                    <asp:Repeater runat="server" ID="rptSessions">
                        <HeaderTemplate><ul></HeaderTemplate>
                        <ItemTemplate>
                            <li class='<%# If(RequestSessionId = Eval("Id"), "selected", "")%>'>
                                <asp:LinkButton runat="server" Enabled='<%#RequestSessionId <> Eval("Id")%>' OnClientClick='<%# If(RequestSessionId <> Eval("Id"), "return Vista.SelectSeats.Popup.update();", "")%>' OnCommand="ChangeSessionCommand" CommandArgument='<%# Eval("Id")%>'>
                                    <dl>
                                        <dd class="movie-name"><%# Eval("Name")%></dd>
                                        <dd><%# String.Format(Cart.SessionDetailLine, Eval("Time"), CinemaName)%></dd>
                                        <dd><%# Eval("Location") %></dd>
                                        <dd><%# Eval("AllSeats") %></dd>
                                    </dl>
                                </asp:LinkButton>
                            </li>
                        </ItemTemplate>
                        <FooterTemplate></ul></FooterTemplate>
                    </asp:Repeater>
                    </div>
                    <div id="select-seats-container">
                        <% If Not String.IsNullOrEmpty(ErrorMessage) Then%>
                            <span class="notification"></span><p class="error-text"><%: ErrorMessage%></p>
                        <% End If%>

                        <%
                            Dim seatsLegend As New List(Of String())
                            seatsLegend.Add({SelectSeats.SeatAutoReserved, "images/seating/25/standard_selected.png"})
                            seatsLegend.Add({SelectSeats.SeatEmpty, "images/seating/25/standard_available.png"})

                            If ShowSpecialSeats Then
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
           
                        %>
        
                        <div id="divLegend">
                            <% For Each legend In seatsLegend%>
                                <span class="legend-container">
                                    <% For i = 1 To legend.Length - 1%><img src="<%: legend(i)%>" alt="<%: legend(0)%>" /><% Next %>
                                    <span class="Legend"><%: legend(0)%></span>
                                </span>
                            <% Next%>
                        </div>

                        <div id="divSeatMap" class="Screen-AllAreas" runat="server">
                            <seatplan:SeatingControl id="objSeatPlan" runat="server" />
                        </div>

                    </div>
                <button runat="server" class="page-action" type="button" data-js-buttonwatch="true" data-js-buttonwatch-optionalclass="page-action-disabled" id="ibtnNext"><span><%: SelectSeats.ButtonDone %></span></button>

                <input id="txtSeatInfo" type="hidden" runat="server" />
                <input id="txtDateOrderChanged" type="hidden" runat="server" />
            </form>
        </div>

        <%: ContentDelivery.ScriptBundle(JsBundles.JQueryCommon)%>        
        
        <%=ContentDelivery.Script("Culture/globalize.js").ToString()%> 
        <%=ContentDelivery.Script(String.Format("Culture/Cultures/globalize.culture.{0}.js", PrimaryLanguageCultureInfo.Name)).ToString()%> 
        <script type="text/javascript">
            Globalize.culture('<%: PrimaryLanguageCultureInfo.Name%>');
            var currentCulture = Globalize.culture();
            currentCulture.numberFormat.currency.symbol = '<%= PrimaryLanguageCultureInfo.NumberFormat.CurrencySymbol%>';
            currentCulture.numberFormat.currency.decimalSeparator = '<%= PrimaryLanguageCultureInfo.NumberFormat.CurrencyDecimalSeparator%>';
            currentCulture.numberFormat.currency.decimalDigits = <%= PrimaryLanguageCultureInfo.NumberFormat.CurrencyDecimalDigits%>;
            currentCulture.numberFormat.currency.groupSeparator = '<%= HttpUtility.JavaScriptStringEncode(PrimaryLanguageCultureInfo.NumberFormat.CurrencyGroupSeparator)%>';

            Vista.Urls.Shared = {};
            Vista.Urls.Shared.Home = '<%= BrowsingUrls.GetHomeUrl()%>';
            Vista.Urls.Shared.Error = 'visError.aspx';

            Vista.Urls.Order = {};
            Vista.Urls.Order.removeSession = '<%: ResolveUrl("Api/Order/RemoveSession/") %>';
            Vista.Urls.Order.removeConcession = '<%: ResolveUrl("Api/Order/RemoveConcession/") %>';
            Vista.Urls.Order.setDeliveryMethod = '<%: ResolveUrl("Api/Order/SetDeliveryMethod/") %>';
            Vista.Urls.Order.updateDeliveryDetails = '<%: ResolveUrl("Api/Order/UpdateDeliveryDetails/")%>';

            Vista.Urls.LoyaltyRewardShop = {};
            Vista.Urls.LoyaltyRewardShop.purchaseReward = '<%: ResolveUrl("Api/LoyaltyRewardShop/PurchaseReward/")%>';

            Vista.Lang.Shared = {};
            Vista.Lang.Shared.OverflowPlaceholder = <%= [Shared].OverflowPlaceholder.ToJson()%>;
            
            Vista.Lang.ModalError = {};
            Vista.Lang.ModalError.Title = <%= ModalError.Title.ToJson()%>;
            Vista.Lang.ModalError.OkButton = <%= ModalError.OkButton.ToJson()%>;
        </script>

        <%= ContentDelivery.ScriptBundle(JsBundles.MasterPageWebForms).ToString()%>
        <%: ContentDelivery.ScriptBundle(JsBundles.Validation)%>  

        <%= ContentDelivery.Script("Vista/Utilities/Utilities.js")%>
        <!--[if IE 6]>
            <%= ContentDelivery.Script("Navigation/IE6.js")%>
        <![endif]-->  
        <%= ContentDelivery.Script("Navigation/Index.js")  %>
        <%= ContentDelivery.Script("Navigation/LanguageLocation.js")%>

        <%: ContentDelivery.Script("Vista/ModalError.js")%>
        <%: ContentDelivery.Script("Vista/AssignGiftModalDialog.js")%>

        <%: ContentDelivery.ScriptBundle(JsBundles.WebFormsEnhancements)%>  
        
    <script type="text/javascript" src="SeatingControl.js?v4.3"></script>

    <%: ContentDelivery.Script("Vista/SelectSeats/Popup.js")%>
    <%: ContentDelivery.Script("Vista/SelectSeats/AreaSelector.js")%>

    <script type="text/javascript">
        Vista.SelectSeats.Data = {};
        Vista.SelectSeats.Data.tickets = {};
        
        Vista.SelectSeats.Data.unallocatedAreas = {};
    </script>

    </body>
</html>
