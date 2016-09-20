<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="visOrderSummary.ascx.vb" Inherits="visInternetTicketing.visOrderSummary" %>

<div id="orderDetails">
    <div id="orderHeader" class="DetailsHeaderRow">
        <asp:Label ID="lblOrderHeader" runat="server" CssClass="DetailsHeader"></asp:Label>
    </div>
    <div id="details">
        <div id="error" class="SectionContainer">
            <asp:Label ID="lblError" runat="server" CssClass="DetailsText"></asp:Label>
        </div>
        <div id="showSummary" class="SectionContainer">
            <dl>
                <dt class="CinLabel"><asp:Label id="lblCinema" runat="server" CssClass="DetailsSubHeader"></asp:Label></dt>
                <dd><asp:Label ID="txtCinemaDetails" runat="server" CssClass="DetailsText"></asp:Label></dd>
            </dl>
            <div class="Clear">
                <asp:Label ID="lblShows" runat="server" CssClass="DetailsSubHeader"></asp:Label>
            </div>
            <asp:Repeater ID="rptShowtimeList" runat="server">
                <ItemTemplate>
                    <div class="Clear" id="divCartSession" runat="server">
                        <div>
                            <asp:Label ID="lblMovie" runat="server" CssClass="DetailsText MovieSummary"></asp:Label>
                            <asp:Label ID="lblShowtime" runat="server" CssClass="DetailsText Right"></asp:Label>
                            <br />
                            <asp:Label ID="lblScreen" runat="server" CssClass="DetailsText MovieSummary"></asp:Label>
                            <asp:ImageButton ID="ibtnDelete" runat="server" CssClass="Right" ImageUrl="../images/cartdelete.gif" onmouseout="this.src='images/cartdelete.gif'" onmouseover="this.src='images/cartdelete_hover.gif'" /><asp:ImageButton ID="ibtnModifyConcs" runat="server" CssClass="Right" ImageUrl="../images/cartchangeconc.gif" onmouseout="this.src='images/cartchangeconc.gif'" onmouseover="this.src='images/cartchangeconc_hover.gif'" /><asp:ImageButton ID="ibtnModifyTickets" runat="server" CssClass="Right" ImageUrl="../images/cartchangeticket.gif" onmouseout="this.src='images/cartchangeticket.gif'" onmouseover="this.src='images/cartchangeticket_hover.gif'" />
                            
                        </div>
                        <asp:Repeater ID="rptItemList" runat="server">
                            <HeaderTemplate>
                                <table id="tblItemList" class="Clear SubTable" cellpadding="0" cellspacing="0">
                            </HeaderTemplate>
                            <ItemTemplate>
                                    <tr class="DetailsRow">
                                        <td class="OrderDetailsDescription Indent"><asp:Label ID="txtItemDesc" runat="server" CssClass="DetailsText"></asp:Label></td>
                                        <td class="Price"><asp:Label ID="txtItemPrice" runat="server" CssClass="DetailsText"></asp:Label></td>
                                        <td class="Points"><asp:Label ID="txtItemPoints" runat="server" CssClass="DetailsText"></asp:Label></td>
                                        <td class="OrderMisc"><asp:Label ID="txtItemMisc" runat="server" CssClass="DetailsText"></asp:Label></td>
                                    </tr>
                            </ItemTemplate>
                            <FooterTemplate>
                                    <tr class="DetailsRow SubRow">
                                        <td class="OrderDetailsDescription Indent"><asp:Label ID="lblItemSubtotal" runat="server" CssClass="DetailsText"></asp:Label></td>
                                        <td class="Price"><asp:Label ID="txtItemSubtotalDetails" runat="server" CssClass="DetailsText Bold"></asp:Label></td>
                                        <td class="Points"><asp:Label ID="txtItemPointsSubtotalDetails" runat="server" CssClass="DetailsText"></asp:Label></td>
                                        <td class="OrderMisc"></td>
                                    </tr>
                                </table>
                            </FooterTemplate>
                        </asp:Repeater>
                    </div>
                </ItemTemplate>
            </asp:Repeater>
            <div class="Clear"></div>
            
            <%--<table id="tblCartSessions" cellpadding="0" cellspacing="0">
                <tr class="DetailsRow" id="rowHeaderCart">
                    <th class="orderDetailsDescription"><asp:Label ID="lblCartSession" runat="server" CssClass="DetailsSubHeader"></asp:Label></th>
                    <th><asp:Label ID="lblCartPrice" runat="server" CssClass="DetailsSubHeader"></asp:Label></th>
                    <th><asp:Label ID="lblCartPoints" runat="server" CssClass="DetailsSubHeader"></asp:Label></th>
                    <th><asp:Label ID="lblCartOptions" runat="server" CssClass="DetailsSubHeader"></asp:Label></th>
                </tr>
                <asp:Repeater id="rptCartSessionSet" runat="server">
                    <ItemTemplate>
                        <tr class="DetailsRow" id="rowCartSession" runat="server">
                            <td><asp:Label ID="txtCartOrderDetails" runat="server" CssClass="DetailsText"></asp:Label></td>
                            <td class="Price"><asp:Label ID="txtCartPriceDetails" runat="server" CssClass="DetailsText"></asp:Label></td>
                            <td class="Points"><asp:Label ID="txtCartPointsDetails" runat="server" CssClass="DetailsText"></asp:Label></td>
                            <td>
                                <asp:ImageButton ID="ibtnModify" runat="server" ImageUrl="../images/cartmodify.gif" onmouseout="this.src='images/cartmodify.gif'" onmouseover="this.src='images/cartmodify_hover.gif'" />
                                <asp:ImageButton ID="ibtnDelete" runat="server" ImageUrl="../images/cartdelete.gif" onmouseout="this.src='images/cartdelete.gif'" onmouseover="this.src='images/cartdelete_hover.gif'" />
                                <span></span>
                            </td>
                        </tr>
                    </ItemTemplate>
                </asp:Repeater>
            </table>--%>
        </div>
        <div id="totals" class="SectionContainer">
            <table cellpadding="0" cellspacing="0">
                <tr id="rowBkFee">
                    <td class="OrderDetailsDescription"><asp:Label ID="lblBookingFee" runat="server" CssClass="DetailsSubHeader"></asp:Label></td>
                    <td class="Price"><asp:Label ID="txtBookingFeeDetails" runat="server" CssClass="DetailsText Bold"></asp:Label></td>
                    <td class="Points"></td>
                    <td class="OrderMisc"></td>
                </tr>
                <tr>
                    <td class="OrderDetailsDescription"><asp:Label ID="lblGrandTotal" runat="server" CssClass="DetailsSubHeader"></asp:Label></td>
                    <td class="Price"><asp:Label ID="txtGrandTotalDetails" runat="server" CssClass="DetailsText GrandTotal"></asp:Label></td>
                    <td class="Points"><asp:Label ID="txtGrandTotalPointsDetails" runat="server" CssClass="DetailsText"></asp:Label></td>
                    <td class="OrderMisc"><asp:Label ID="lblTotalTax" runat="server" CssClass="DetailsText"></asp:Label></td>
                </tr>
            </table>
        </div>
        <div id="cartlinks">
            <asp:ImageButton id="ibtnAddSession" runat="server" />
            <asp:ImageButton ID="ibtnCancel" runat="server" />
        </div>
    </div>
</div>