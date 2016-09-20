<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visLtyPurchaseRewardsKiosk.aspx.vb" Inherits="visInternetTicketing.visLtyPurchaseRewardsKiosk" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
	<head runat="server">
		<title></title>
		<!-- <link href="visStyles.css" type="text/css" rel="stylesheet" /> -->
		<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
		<!-- <link href="visStylesUser.css" type="text/css" rel="stylesheet" /> -->
		
		<link href="visStylesKiosk.css" type="text/css" rel="stylesheet" />
		<!-- visStylesKioskUser.css must proceed visStylesKiosk.css, so to override the default styles if requested -->
		<link href="visStylesKioskUser.css" type="text/css" rel="stylesheet" />
		<script type="text/javascript" language="javascript" src="visJavaCommon.js"></script>
	</head>
	<body class="Page Background" >
		<form id="frmLtyPurchaseRewards" method="post" runat="server">
			<div class="ContentsContainer">
			    
			    <div>
			        <div id="divError" runat="server" class="ErrorDiv" visible="false">
			            <asp:Label ID="lblErrorMsg" runat="server"></asp:Label>
			        </div>
			        <asp:LinkButton ID="ibtnKioskErrorCancel" runat="server" CssClass="button cancel-button" visible="false" />
			        
			        		        
			        <table id="tblMemberDetails" runat="server" width="575px" cellpadding="0" cellspacing="0" style="padding-top: 10px;">
			        	<tr>
		                    <td colspan="2" style="padding-left:4px;">
                                <asp:Label ID="lblHeader" runat="server" CssClass="LoyaltyHomeHeaderText"></asp:Label>
		                    </td>

		                </tr>
		                <tr>
		                    <td style="padding-left:4px;">
		                        <asp:Label id="lblTime" runat="server" CssClass="LoyaltyHomeDetailsText" />
		                        <asp:Label id="lblTimeValue" runat="server" CssClass="LoyaltyHomeDetailsText" />
		                        <br />
		                        <asp:Label id="lblPointsBalance" runat="server" CssClass="LoyaltyHomeDetailsText" />
		                        <asp:Label id="lblPointsBalanceValue" runat="server" CssClass="LoyaltyHomeDetailsText" />
		                    </td>
		                    <td>
		                        <asp:LinkButton CssClass="button cancel-button" ID="ibtnKioskCancel" runat="server" />
		                    </td>
		                </tr>
			            <tr>
			                <td colspan="2" style="padding-left:4px;padding-top:10px;">
			                    <asp:Label ID="lblDetails" runat="server" CssClass="LoyaltyHomeDetailsText" ></asp:Label>
			                </td>
			            </tr>
			        </table>
			        
                    <div id="divRewardGroupButtons" class="category-tabs" runat="server" style="padding-top:25px;">
                        <asp:Repeater ID="rptRewardGroupButtons" runat="server">
                            <ItemTemplate>
                                <asp:LinkButton CssClass="button category-button" ID="ibtnRewardGroup" runat="server" />
                            </ItemTemplate>
                        </asp:Repeater>
                    </div>   
                          
                    <div id="divRewardCategory" runat="server" style="display:none;text-align:left;width:570px;">
                        <asp:Label ID="lblCategory" class="LoyaltyHomeSubHeaderText" runat="server"></asp:Label>           
                    </div>

                    <asp:Repeater ID="rptRewardGroups" runat="server">
			            <ItemTemplate>
			                <table id="tblRewards" class="rewards-grid" runat="server">
			                <tr>
			                <td>
                                <asp:Repeater ID="rptRewardCategories" runat="server">
                                    <ItemTemplate>
                                        <tr>
                                            <td class="second-category-title">
                                                <a id="lnkRewardCategory" runat="server"></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table id="tblRewardItems" class="item-details" cellpadding="0" cellspacing="0" runat="server">
                                                    <tr>
                                                        <td>
	                                                        <asp:Repeater id="rptRewards" runat="server">
                                                                <ItemTemplate>
                                                                    <table class="reward-item" id="tblRewardItem" cellpadding="0" cellspacing="0">
                                                                        <tr>
                                                                            <td>
                                                                                <table id="tblRewardItemLeft" height="130px" style="float:left;width:405px;" runat="server" cellpadding="0" cellspacing="0" >
                                                                                    <tr>
                                                                                        <td height="130px" style="max-height:130px;vertical-align:top;" width="130px">
                                                                                            <asp:Image id="imgReward" runat="server" CssClass="ImageRecognitions" />
                                                                                        </td>
                                                                                        <td height="130px" style="vertical-align:top;padding-left:5px;padding-right:15px;">
                                                                                            <div>
                                                                                                <asp:Label id="lblName" runat="server" CssClass="LoyaltyHomeSubHeaderText"></asp:Label>
                                                                                            </div>
                                                                                            <div style="padding-top:5px;">
                                                                                                <asp:Label id="lblMessage" runat="server" CssClass="LoyaltyHomeDetailsText" />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                                <table id="tblRewardItemRight" height="130px" class="LoyaltyStandardTable" style="float:left;width:158px;border-top-width:0;border-right-width:0;border-bottom-width:0;" cellpadding="0" cellspacing="0" runat="server" >
                                                                                    <tr>
                                                                                        <td height="25px" class="tdRewardItemRight">
                                                                                            <asp:Label id="lblPointsCostLabel" style="padding-left:5px;float:left;" runat="server" CssClass="LoyaltyHomeDetailsText" />
                                                                                            <asp:Label id="lblPointsCost" style="padding-right:5px;float:right;" runat="server" CssClass="LoyaltyHomeDetailsText" />
                                                                                        </td> 
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td height="25px" class="tdRewardItemRight">
                                                                                            <asp:Label id="lblExpiryLabel" style="padding-left:5px;float:left;" runat="server" CssClass="LoyaltyHomeDetailsText" />
                                                                                            <asp:Label id="lblExpiryValue" style="padding-right:5px;float:right;" runat="server" CssClass="LoyaltyHomeDetailsText" />
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td height="25px" class="tdRewardItemRight">
                                                                                            <asp:Label id="lblQtyRemainingLabel" style="padding-left:5px;float:left;" runat="server" CssClass="LoyaltyHomeDetailsText" />
                                                                                            <asp:Label id="lblQtyRemaining" style="padding-right:5px;float:right;" runat="server" CssClass="LoyaltyHomeDetailsText" />
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="redeem-button-container">
                                                                                            <form id="frmConfirmRedeem" action="visLtyPurchaseRewardConfirmation.aspx" method="post" >
                                                                                                <input type="hidden" id="txtItemGroup" runat="server" />
                                                                                                <input type="hidden" id="txtItemClass" runat="server" />
                                                                                                <input type="hidden" id="txtItemCode" runat="server" />
                                                                                                <input type="hidden" id="txtItemName" runat="server" />
                                                                                                <input type="hidden" id="txtRecogId" runat="server" />
                                                                                                <input type="hidden" id="txtPointsCost" runat="server" />
                                                                                                <input type="hidden" id="txtIsCollected" runat="server" />
                                                                                                <input type="hidden" id="txtLimitToComplexId" runat="server" />
                                                                                                <input type="hidden" id="txtPickupNotes" runat="server" />
                                                                                                <input type="hidden" id="txtPickupExpiry" runat="server" />
                                                                                                <input type="hidden" id="txtQtyRemainingLabelId" runat="server" />
                                                                                                <asp:LinkButton id="ibtnRedeem" CssClass="redeem-button button" runat="server" />
                                                                                            </form>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </ItemTemplate>
                                                                <SeparatorTemplate>
                                                                    <div class="LtyRewardDivider"></div>
                                                                </SeparatorTemplate>
	                                                        </asp:Repeater>
                                                        </td>
                                                    </tr> 
	                                            </table>
		                                    </td>
		                                </tr>
		                            </ItemTemplate>                         
				                </asp:Repeater>
			                </td>
			                </tr>
			                </table>
			            </ItemTemplate>
			        </asp:Repeater>

			        <input type="hidden" id="txtCurrentRewardGroupTableId" runat="server" />
                </div>			        
			</div>
        </form>
        <form id="frmRedeem" action="visLtyPurchaseRewardConfirmation.aspx" method="post">
            <input type="hidden" id="txtItemGroup" runat="server" />
            <input type="hidden" id="txtItemClass" runat="server" />
            <input type="hidden" id="txtItemCode" runat="server" />
            <input type="hidden" id="txtItemName" runat="server" />
            <input type="hidden" id="txtRecogId" runat="server" />
            <input type="hidden" id="txtPointsCost" runat="server" />
            <input type="hidden" id="txtIsCollected" runat="server" />
            <input type="hidden" id="txtLimitToComplexId" runat="server" />
            <input type="hidden" id="txtPickupNotes" runat="server" />
            <input type="hidden" id="txtPickupExpiry" runat="server" />
            <input type="hidden" id="txtIsKioskMode" runat="server" />
            <input type="hidden" id="txtQtyRemainingLabelId" runat="server" />
        </form>
        
        <form name="frmComplete" action=".\visPurchaseRewardsKiosk_Cancel.html" method="get">
        </form>            

        <script type="text/javascript" language="javascript">

            <% 
            '---------------------------------------------------------------------------------------------
            '-- IMPORTANT - DEVLOPERS PLEASE READ: Always use this way of commenting for javascript.
            '--								HTML Comments can be read by the client
            '--								We do not want clients knowing what our jscript functions do!
            '---------------------------------------------------------------------------------------------
            %>

            function ScrollPage(hScrollIncrement, vScrollIncrement) {
    	        window.scrollBy(hScrollIncrement, vScrollIncrement); // horizontal and vertical scroll increments
            }


		    function ShowHideElement(id) {
                var elem;
                
                elem = document.getElementById(id);
                if (elem.style.display == 'block') {
                    elem.style.display = 'none';
                }
                else {
                    elem.style.display = 'block';
                }
		    }
		    
		    function OpenPopupWindow(targetWindow) {
		        var features;
		        
		        features = 'width=500,height=350,toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,copyhistory=no,resizable=yes';
                window.open('', targetWindow, features);

		        return true;
		    }
		    
		    function UpdateMemberPointsTotal(newPointsTotal, timeOfUpdate) {
		        var lblPointsBalanceValue = document.getElementById('lblPointsBalanceValue');
		        var lblTimeValue = document.getElementById('lblTimeValue');
		        lblPointsBalanceValue.firstChild.nodeValue = newPointsTotal;
		        lblTimeValue.firstChild.nodeValue = timeOfUpdate;
		    }
		    
		    function UpdateRedeemedItemQtyTotal(lblQtyId) {
		        var lblRedeemedItemValueId = document.getElementById(lblQtyId);
		        var nodeVal = lblRedeemedItemValueId.firstChild.nodeValue;
		        if (!isNaN(nodeVal - 1)) {
		            lblRedeemedItemValueId.firstChild.nodeValue -= 1;
		        }     
		    }
		    
            <% 
            '---------------------------------------------------------------------------------------------
            '-- This function shows/hides the rewards table for the label clicked.
            '---------------------------------------------------------------------------------------------
            %>
		    function ItemGroupClicked(tableId, label) {
                var category;
                var elem;
                elem = document.getElementById('txtCurrentRewardGroupTableId');
                category = document.getElementById('lblCategory');

                ShowHideElement(elem.value);
                ShowHideElement(tableId);
                elem.value = tableId;
                category.innerHTML = label;
                
                return false;
		    }

            <% 
            '---------------------------------------------------------------------------------------------
            '-- This function opens a popup window for the reward item to be redeemed.
            '---------------------------------------------------------------------------------------------
            %>		    
		    function OpenRedeemConfirmationWindow(txtItemGroupId, txtItemClassId, txtItemCodeId, txtItemName,
		                                            txtRecogId, txtPointsCost, txtIsCollected, txtLimitToComplexId,
		                                            txtPickupNotesId, txtPickupExpiryId, strQtyRemainingLabelId,
		                                            currentLang) {
		        var itemGroup;
		        var itemClass;
		        var itemCode;
		        var itemName;
		        var recogId;
		        var pointsCost;
		        var isCollected;
		        var limitToComplexId;
		        var pickupNotesId;
		        var pickupExpiryId;
		        var newWindow;
		     
		        
		        itemGroup = document.getElementById(txtItemGroupId).value;
		        itemClass = document.getElementById(txtItemClassId).value;
		        itemCode = document.getElementById(txtItemCodeId).value;
		        itemName = document.getElementById(txtItemName).value;
		        recogId = document.getElementById(txtRecogId).value;
		        pointsCost = document.getElementById(txtPointsCost).value;
		        isCollected = document.getElementById(txtIsCollected).value;
		        limitToComplexId = document.getElementById(txtLimitToComplexId).value;
		        pickupNotesId = document.getElementById(txtPickupNotesId).value;
		        pickupExpiryId = document.getElementById(txtPickupExpiryId).value;
                
                document.getElementById('txtItemGroup').value = itemGroup;
                document.getElementById('txtItemClass').value = itemClass;
                document.getElementById('txtItemCode').value = itemCode;
                document.getElementById('txtItemName').value = itemName;
                document.getElementById('txtRecogId').value = recogId;
                document.getElementById('txtPointsCost').value = pointsCost;
                document.getElementById('txtIsCollected').value = isCollected;
                document.getElementById('txtLimitToComplexId').value = limitToComplexId;
                document.getElementById('txtPickupNotes').value = pickupNotesId;
                document.getElementById('txtPickupExpiry').value = pickupExpiryId;                
                document.getElementById('txtQtyRemainingLabelId').value = strQtyRemainingLabelId;
                
		        frmRedeem.action = 'visLtyPurchaseRewardConfirmationKiosk.aspx?visLang=' + currentLang;
                //newWindow = window.open('', 'RedeemPopup'+popupCount, 'width=500,height=420,toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,copyhistory=no,resizable=yes');
                //newWindow.focus();
                //frmRedeem.target = 'RedeemPopup'+popupCount;
                frmRedeem.submit();
                
                //popupCount += 1;
		        return false;
		    }
		    var popupCount = 0;
		    
		    function ReturnControlToKiosk() {
			    //This function is called when the user clicks "Back"
			    document.frmComplete.submit();
			    return false;
		    }
		    
        </script>
    </body>
</html>
