<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visSelectConcessions.aspx.vb" Inherits="visInternetTicketing.visSelectConcessions" MasterPageFile="~/Site.Master" %>

<%@ Import Namespace="Vista.Cdn.Client" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Bundles" %>
<%@ Import Namespace="Vista.Web" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.ContentDelivery" %>
<%@ Register Assembly="InternetTicketing.Controls.WebForms" Namespace="InternetTicketing.Controls.WebForms" TagPrefix="vis" %>
<%@ Register Src="~/Controls/SignInWidget.ascx" TagPrefix="vis" TagName="SignInWidget" %>
<%@ Register Src="~/Controls/SignedInWidget.ascx" TagPrefix="vis" TagName="SignedInWidget" %>

<asp:Content ID="Css" ContentPlaceHolderID="Css" runat="server">
    <%: ContentDelivery.Css("PlusMinusNumeric.css")%>
    <%: ContentDelivery.Css("CategoryTabs.css")%>
    <%: ContentDelivery.Css("Ticketing/SelectConcessions.css")%>
    <%: ContentDelivery.Css("Ticketing/ConcessionTabs.css")%>
</asp:Content>

<asp:Content runat="server" ContentPlaceHolderID="Script">
    <%: ContentDelivery.Script("Vista/PlusMinusNumeric/PlusMinusNumeric.js")%>
    <%: ContentDelivery.Script("Vista/Loyalty/TicketingSignInWidget.js")%>
    <%: ContentDelivery.ScriptBundle(JsBundles.SelectConcessions)%>

    <script type="text/javascript">
        Vista.Urls.Concession = {};
        Vista.Urls.Concession.AddPromotionCode = '<%: ResolveUrl("~/visSelectConcessions.aspx/AddPromotionCode") %>';

        Vista.Lang.Concessions = {};
        Vista.Lang.Concessions.AddPromotion = <%= Concession.AddPromotionButton.ToJson()%>;
        Vista.Lang.Concessions.RemovePromotion = <%= Concession.RemovePromotionButton.ToJson()%>;
        Vista.Lang.Concessions.PromotionNotFound = <%= Concession.PromotionNotFound.ToJson()%>;
        Vista.Lang.Concessions.ErrorMemberOnly = <%= Concession.ErrorMemberOnly.ToJson()%>;
        Vista.Lang.Concessions.OldPriceTextPrefix = <%= Concession.OldPriceTextPrefix.ToJson()%>;
        Vista.Lang.Concessions.NewPriceTextPrefix = <%= Concession.NewPriceTextPrefix.ToJson()%>;
    </script>
</asp:Content>

<asp:Content ID="PageContent" ContentPlaceHolderID="ContentBody" runat="server">
    <form id="frmSelectConcessions" method="post" runat="server">
        <%: ""%>
        <vis:BreadcrumbControl ID="BreadcrumbControl" runat="server" />

        <div class="order-details">
            <vis:CountdownControl runat="server" ID="countdownTimer" />
            <vis:CartControl ID="cart" runat="server" />
        </div>

        <div id="concessions">
            <h2><%: Concession.Heading1%><em><%: Concession.Heading2%></em></h2>

            <% If Not String.IsNullOrEmpty(PageData.ErrorMessage) Then%>
            <span class="notification"></span>
            <p class="error-text"><%: PageData.ErrorMessage%></p>
            <% End If%>

            <% If PageData.DisplayConcessions Then%>
            <p class="blurb"><%:Concession.Blurb %></p>
            <% End If%>

            <div class="signin-widget">
                <vis:SignInWidget ID="SignInWidget" runat="server"></vis:SignInWidget>
                <vis:SignedInWidget ID="SignedInWidget" runat="server"></vis:SignedInWidget>
            </div>

            <div class="category-tabs">
                <% If PageData.DisplayConcessions Then%>
                <ol class="categories">
                    <% For Each tab In PageData.Tabs%>
                    <li><a href="#<%: tab.Key %>"><%: tab.Name%></a></li>
                    <% Next%>
                </ol>

                <div class="concession-tabs category-tabs-items">
                    <% If PageData.DisplayPromotionHeader Then%>
                    <div class="promotion-header">
                        <div class="promotion-error">
                            <span class="icon icon-small icon-notification"></span>
                            <p></p>
                        </div>
                        <%: Concession.EnterPromotion %><%-- 
                        --%><input id="txtPromotionCode" type="text" runat="server" /><%-- 
                        --%><% If PageData.PromotionCodeEntered Then%><%--
                        --%>
                        <button value="remove" type="button" class="user-action"><span class="icon icon-remove" data-js-buttonwatch="true"><%: Concession.RemovePromotionButton%></span></button>
                        <% Else%><%--
                        --%>
                        <button value="add" type="button" class="user-action"><span class="icon icon-add" data-js-buttonwatch="true"><%: Concession.AddPromotionButton%></span></button>
                        <% End If%>
                    </div>
                    <%End If%>
                    <% For Each tab In PageData.Tabs%>
                    <ul id="<%: tab.Key %>" class="tab">
                        <% For Each item In tab.Items.OrderBy(Function(i) i.Description)%>
                        <li class="item<%: If(item.Quantity > 0, " active", "") %>">
                            <div class="front">
                                <div class="image-container">
                                    <img alt="<%: item.Description %>" src="<%: item.ImageUri %>" />
                                </div>
                                <div class="item-details">
                                    <label for="<%: item.Key %>"><%: item.Description%></label>
                                </div>
                                <% If item.ExtendedDescription <> "" Then%>
                                <div class="description-toggle">
                                    <span><%: Concession.ConcessionMoreInfo%> </span>
                                    <span class="icon icon-small icon-arrow-right"></span>
                                </div>
                                <% Else%>
                                <div class="placeholder"></div>
                                <% End If%>

                                <span class="price original" data-value="<%: item.PriceInCents %>">
                                    <% If item.HasPromotionApplied Then %><%: Concession.OldPriceTextPrefix%>&nbsp;<% End If%><%: item.OriginalDisplayPrice%>
                                </span>
                                <span class="price discount" data-value="<%: item.PromotionPrice%>" data-has-promotion-code="<%: item.HasPromotionCodeApplied%>">
                                    <% If item.HasPromotionApplied Then %><%: Concession.NewPriceTextPrefix%>&nbsp;<% End If%><%: item.PromotionDisplayPrice%>
                                </span>
                                <div class="item-footer">
                                    <div class="item-footer-quantity plus-minus-numeric">
                                        <button type="button" class="clear icon icon-clear"></button>
                                        <button type="button" class="minus icon icon-minus"></button>
                                        <input type="text" id="<%: item.Key %>" class="quantity" name="<%: item.Key %>" value="<%: item.Quantity %>" min="0" max="<%: item.MaxQuantity %>" data-unavailable="<%: item.IsUnavailable.ToJson()%>" />
                                        <button type="button" class="plus icon icon-plus"></button>
                                    </div>
                                </div>
                            </div>

                            <div class="back">
                                <div class="item-details">
                                    <label for="<%: item.Key %>"><%: item.Description%></label>
                                    <span class="icon icon-small icon-delete description-toggle"></span>
                                </div>
                                <hr />
                                <div class="item-extended-description">
                                    <p><%: item.ExtendedDescription%></p>
                                </div>

                            </div>
                            
                        </li>
                        <% Next item%>
                    </ul>
                    <% Next tab%>
                </div>

                <%End If%>
            </div>

            <button id="btnConcessionsNext" type="button" class="page-action" data-js-buttonwatch="true" data-js-buttonwatch-disableallonsubmit="true" data-js-buttonwatch-optionalclass="page-action-disabled" runat="server"><span><%: Concession.Next%></span></button>
        </div>


        <input id="txtDateOrderChanged" type="hidden" runat="server" />
        <input id="txtCancelOrder" type="hidden" runat="server" />

    </form>
</asp:Content>
