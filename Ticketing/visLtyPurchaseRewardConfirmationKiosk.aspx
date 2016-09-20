<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visLtyPurchaseRewardConfirmationKiosk.aspx.vb" Inherits="visInternetTicketing.visLtyPurchaseRewardConfirmationKiosk" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head runat="server">
    <title>
		<asp:Literal id="PageTitle" runat="server" />
	</title>
    <!-- <LINK href="visStyles.css" type="text/css" rel="stylesheet"> -->
	<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
	<!-- <LINK href="visStylesUser.css" type="text/css" rel="stylesheet"> -->
	
	<link href="visStylesKiosk.css" type="text/css" rel="stylesheet" />
	<!-- visStylesKioskUser.css must proceed visStylesKiosk.css, so to override the default styles if requested -->
	<link href="visStylesKioskUser.css" type="text/css" rel="stylesheet" />	
	<script language="javascript" src="visJavaCommon.js"></script>
</head>
<body class="Page Background" >
    <form id="frmLtyRedeemConf" runat="server" method="post">

        <div class="ContentsContainer" align="center">
            <div id="divRedeemConf" style="padding-top:12px" >
                <table id="tblRedeemConf" class="ltyRewardConfTable LoyaltyHomeDetailsText" width="573">
                    <tr>
                        <td colspan="2">
                            <asp:Label id="lblRedeemConfTitle" runat="server" cssclass="LoyaltyHomeHeaderText"></asp:Label> 
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top:12px" >
                            <asp:Label id="lblRedeemConfDetails" runat="server" ></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                    </tr>
                    <tr>
                        <td width="200">
                            <asp:Label id="lblItemLabel" runat="server" ></asp:Label>
                        </td>
                        <td>
                            <asp:Label id="lblItemValue" runat="server" ></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label id="lblPointsCodeLabel" runat="server" ></asp:Label>
                        </td>
                        <td>
                            <asp:Label id="lblPointsCodeValue" runat="server" ></asp:Label>
                        </td>
                    </tr>    
                    <tr>
                        <td>
                            <asp:Label id="lblRemainingPointsLabel" runat="server" ></asp:Label>
                        </td>
                        <td>
                            <asp:Label id="lblRemainingPointsValue" runat="server" ></asp:Label>
                        </td>
                    </tr>              
                    <tr>
                        <td colspan="2">
                            <br />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:Label id="lblPickupLocationDetails" runat="server" ></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label id="lblPickupLocationLabel" runat="server" ></asp:Label>
                        </td>
                        <td>
                            <asp:DropDownList id="ddlCinemas" runat="server" cssclass="LtyChooseCinemaDropDown"></asp:DropDownList>
                            <asp:Label id="lblPickupLocationValue" runat="server" ></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:Label id="lblRewardPickupExpiry" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <br />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <asp:Label id="lblCollectionInstructions" runat="server"></asp:Label>
                        </td>
                    </tr>
                </table>
            </div>
            <div id="divItemRedeemed" class="response-message-container" style="margin:0 5px 0 5px;">
                <asp:Label ID="lblMessage" runat="server" CssClass="response-message LtyForgotMessage LtyForgotText" />
                <br />
            </div>
            <div id="ProcAnimation" class="image-processing-container" style="display: none; text-align:center">
                <asp:image id="imgProcessing" runat="server" CssClass="ImageProcessing" ImageUrl="images/kiosk/processing.gif"></asp:image>
            </div>
            <div id="divButtons" style="width: 573px; text-align: right;">
                
                <asp:LinkButton ID="ibtnKioskBack" runat="server" CssClass="button ImageBackKiosk LtyRewardConfKioskBack" TabIndex="4" />
                <asp:LinkButton ID="ibtnCancel" Visible="False" runat="server" CssClass="button ImageCancelRedemption LtyRewardConfCancel" TabIndex="2" />
                <asp:LinkButton ID="ibtnKioskCancel" Visible="False" runat="server" CssClass="button ImageKioskCancel LtyRewardConfKioskCancel" TabIndex="3" />
                <asp:LinkButton ID="ibtnConfirm" runat="server" CssClass="button ImageRedeem LtyRewardConfRedeem" TabIndex="1" />

                <a id="lnkCloseWindow" class="LtyRewardConfClose StandardLink" href="javascript:window.close();" runat="server"></a>    
            </div>
        </div>

        <input type="hidden" id="txtItemGroup" runat="server" />  
        <input type="hidden" id="txtItemClass" runat="server" />  
        <input type="hidden" id="txtItemCode" runat="server" /> 
        <input type="hidden" id="txtItemName" runat="server" /> 
        <input type="hidden" id="txtIsCollected" runat="server" /> 
        <input type="hidden" id="txtRecogId" runat="server" />
        <input type="hidden" id="txtPointsCost" runat="server" /> 
        <input type="hidden" id="txtLimitToComplexId" runat="server" /> 
        <input type="hidden" id="txtPickupNotes" runat="server" />
        <input type="hidden" id="txtPickupExpiry" runat="server" />
        <input type="hidden" id="txtDaysToCollectReward" runat="server" />
        <input type="hidden" id="txtIsKioskMode" runat="server" />
        <input type="hidden" id="txtQtyRemainingLabelId" runat="server" />    

        <% 'IE requires a second textbox on the form to handle enter key as submit %>    
        <asp:TextBox ID="txtHidden" runat="server" style="visibility:hidden;display:none;" />
    </form>
    
    <form name="frmComplete" action=".\visPurchaseRewardsKiosk_Cancel.html" method="post">
    </form> 
    
    <script language="javascript">
		<!--
<% 
		'---------------------------------------------------------------------------------------------
		'-- IMPORTANT - DEVLOPERS PLEASE READ: Always use this way of commenting for javascript.
		'--								HTML Comments can be read by the client
		'--								We do not want clients knowing what our jscript functions do!
		'---------------------------------------------------------------------------------------------
%>

		function TraverseHistory(numOfPagesToTraverse) {
		    history.go(numOfPagesToTraverse);
		    return false;
		}
		
		
        function ScrollPage(hScrollIncrement, vScrollIncrement) {
	        window.scrollBy(hScrollIncrement, vScrollIncrement); // horizontal and vertical scroll increments
        }
        
        function RemoveScrollBars() {
            /*
            alert(window.scrollbars.visible);
            window.scrollbars.visible = false;
            alert(window.scrollbars.visible);
            
            alert(window.features);
            alert(document.body.style.border);
            alert(document.body.style.overflow);
            document.body.style.border = "none";
            alert(document.body.style.border);
            
            */
        }
        
	    function ReturnControlToKiosk() {
		    //This function is called when the user clicks "Cancel"
		    document.frmComplete.submit();
		    return false;
	    }

<% 
		'---------------------------------------------------------------------------------------------
		'-- This function hides and shows the processing animation layer.
		'---------------------------------------------------------------------------------------------
%>
		function HideShowLayer(id) {
			var objDiv;

			<% '-- Wrap up in a try/catch for earlier browser versions, which don't support getElementById %>			
			try {
				<% '-- Get the layer object %>			
				objDiv = document.getElementById(id);
				
				<% '-- If the layer is hidden then show it, otherwise hide it. %>
				if (objDiv.style.display == "none") {
					objDiv.style.display = "block";
				} else {
					objDiv.style.display = "none";
				}
				
				<% '-- If the layer is now shown then restart the animated gif. %>
				if (objDiv.style.display == "block") {
				    setTimeout("showAnim()",200);
				}
			} catch (e) {
			}
		}
		
		function showAnim() {
		    document.frmLtyRedeemConf.imgProcessing.src = 'images/kiosk/processing.gif'; 
		}
		
<% 
		'---------------------------------------------------------------------------------------------
		'-- This jscript code (run evertime page is loaded) loops through the array below and preloads the images specified.
		'-- This way people with a slow connection should still see the processing animated gif and count down clock Ok.
		'---------------------------------------------------------------------------------------------
%>	

		var a = new Array("Processing.gif");

		var d=document;
		if(d.images) {
			if(!d.MM_p) d.MM_p=new Array();
				var i,j = d.MM_p.length;
				for(i=0; i<a.length; i++)
					if (a[i].indexOf("#")!=0) {
						d.MM_p[j] = new Image;
						d.MM_p[j++].src=a[i];
					}
		}			
		//-->	
		</script>
</body>
</html>
