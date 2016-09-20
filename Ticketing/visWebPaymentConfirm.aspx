<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visWebPaymentConfirm.aspx.vb" Inherits="visInternetTicketing.visWebPaymentConfirm" EnableViewState="false" EnableViewStateMac="false"%>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Register tagprefix="visInternetTicketing" Tagname="OrderSummary" src="Controls/visOrderSummary.ascx" %>
<%@ Register Assembly="InternetTicketing.Controls.WebForms" Namespace="InternetTicketing.Controls.WebForms" TagPrefix="vis" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
	<link href="visStyles.css" type="text/css" rel="stylesheet" />
	<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
	<link href="visStylesUser.css" type="text/css" rel="stylesheet" />
	<script type="text/javascript" language="javascript" src="visJavaCommon.js"></script>

    <%-- Placeholder script/style to stop the countdown breaking before this page is integrated with new master page --%>
    <%-- It is ok to delete these once this page is changed to the new master page --%>
            <%= ContentDelivery.Script("jquery-1.8.1.min.js")%>
            <%= ContentDelivery.Script("Vista/Vista.js").ToString()%> <%-- Namespace declaration, must be at top because some asp.net controls use the namespace --%>
            <%= ContentDelivery.Script("Vista/Countdown/Countdown.js")%>
            <%= ContentDelivery.Css("Ticketing/Countdown.css").ToString()%>     
    <%-- End of placeholder files --%>
</head>
<body class="FormStandard" onload="window.history.go(1);">
    <form id="frmWebPaymentConfirm" method="post" runat="server">
    <!--#INCLUDE FILE = "visSkinBodyHeader.htm" -->
			<table id="tblDetails" class="DetailsTableBorder">
			    <tr>
		            <td>
		                <visInternetTicketing:OrderSummary id="visOrderSummary" runat="server" />
		            </td>
		        </tr>
		    </table>
			<table class="BodyTable" id="tblBody">
				<tr>
					<td><asp:table id="tblError" runat="server" CssClass="ErrorTable"></asp:table>
						<table>
							<tr>
								<td>
                                    <vis:CountdownControl runat="server" ID="countdownTimer"/>
									<div id="InfoLabelLayer1" style="VISIBILITY: visible">
									    <table>
									        <tr>
											    <td></td>
											    <td><asp:label id="lblWelcome" runat="server" CssClass="PaymentPageWelcome"></asp:label></td>
											    <td></td>
										    </tr>
										    <tr>
											    <td colSpan="3"></td>
										    </tr>
										    <tr>
											    <td></td>
											    <td><asp:label id="lblAbovePayDetail" runat="server" CssClass="PaymentText"></asp:label></td>
											    <td></td>
										    </tr>
									    </table>
									</div>
									<asp:table id="tblExtraCardDetails" runat="server" EnableViewState="False">
									    <asp:TableRow>
									        <asp:TableCell></asp:TableCell>
									        <asp:TableCell></asp:TableCell>
									        <asp:TableCell></asp:TableCell>
									        <asp:TableCell></asp:TableCell>
									        <asp:TableCell></asp:TableCell>
									        <asp:TableCell></asp:TableCell>
									    </asp:TableRow>
									</asp:table>
									<table>
										<tr>
											<td colspan="5"></td>
										</tr>
										<tr>
											<td colspan="1">
											</td>
											<td class="5PxHeighDONOTCHANGE" colspan="3">
												<div id="ProcAnimation" style="DISPLAY: none"><asp:image id="imgProcessing" runat="server" CssClass="ImageProcessing" ImageUrl="Processing.gif"></asp:image></div>
											</td>
											<td colspan="1"></td>
										</tr>
										<!-- TEMPLATE ROW DO YOUR FORMATTING CHANGES HERE- also used for aesthetics -->
										<tr>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										<!-- TEMPLATE ROW ENDS -->
										<tr>
											<td colspan="1"></td>
											<td colspan="4">
												<table id="InfoLabelLayer2">
													<tr>
														<td>
															<asp:label id="lblPaymentWarning" runat="server" CssClass="PaymentWarning"></asp:label>
														</td>
													</tr>
												</table>
											</td>
											<td colspan="1"></td>
										</tr>
										<tr>
											<td colspan="6"></td>
										</tr>
										<tr>
											<td colspan="1"></td>
											<td colspan="4">
												<table id="InfoLabelLayer3">
													<tr>
														<td>
															<asp:Label ID="lblBackOptions" Runat="server" CssClass="PaymentText"></asp:Label>
														</td>
													</tr>
												</table>
											</td>
											<td colspan="1"></td>
										</tr>
										<tr>
											<td colspan="6"></td>
										</tr>
										<tr id="rowSingleSessionNavButtons" runat="server">
											<td colspan="1"></td>
											<td colspan="2">
												<table>
													<tr>
														<td>
														    <a id="lnkChangeTickets" runat="server" tabindex="3" onclick="DisableButtons('this','lnkChangeTickets');"><img id="imgChangeTickets" runat="server" class="ImageChangeTickets" /></a>
															<a id="lnkChangeSeats" runat="server" tabindex="3" onclick="DisableButtons('this','lnkChangeSeats');"><img id="imgChangeSeats" runat="server" class="ImageChangeSeats" /></a>
															<a id="lnkChangeConcessions" runat="server" tabindex="3" onclick="DisableButtons('this','lnkChangeConcessions');"><img id="imgChangeConcessions" runat="server" class="ImageSelectConcessions" /></a>
															<asp:imagebutton id="ibtnCancel" runat="server" CssClass="ImageCancel" ImageUrl="Images/cancel.gif" TabIndex="4"></asp:imagebutton>
														</td>
													</tr>
												</table>
											</td>
											<td colspan="3">
											    <a id="lnkCancelOrder" runat="server" tabindex="4" style="DISPLAY:none" onclick="DisableButtons('this','lnkCancelOrder');"><img id="imgCancelOrder" runat="server" class="ImageCancel" /></a>
											</td>
										</tr>
										<tr>
											<td colspan="1"></td>
											<td colspan="4">
												<table>
													<tr>
														<td>
														    <!--#INCLUDE FILE = "visSSLProvider.htm" -->
													    </td>
														<td></td>
														<td><asp:label id="lblVerify" runat="server" CssClass="PaymentText"></asp:label></td>
													</tr>
												</table>
											</td>
											<td colspan="1"></td>
										</tr>
										<tr>
											<td colspan="6">&nbsp;</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<input id="txtPayClick" type="hidden" name="txtPayClick" runat="server" /> <input id="txtPaymentAttempts" type="hidden" runat="server" />
						<input id="txtMovieName" type="hidden" name="txtMovieName" runat="server" /> <input id="txtMovieRating" type="hidden" name="txtMovieRating" runat="server" />
						<input id="txtCinemaName" type="hidden" name="txtCinemaName" runat="server" /> <input id="txtSessionDate" type="hidden" name="txtSessionDate" runat="server" />
						<input id="txtSessionTime" type="hidden" name="txtSessionTime" runat="server" /> <input id="txtTicketInfo" type="hidden" name="txtTicketInfo" runat="server" />
						<input id="txtConcessionInfo" type="hidden" name="txtConcessionInfo" runat="server" /><input id="txtPointsCost" type="hidden" name="txtPointsCost" runat="server" />
						<input id="txtOrderTotal" type="hidden" name="txtOrderTotal" runat="server" /><input id="txtCinemaOpName" type="hidden" name="txtCinemaOpName" runat="server" />
						<input id="txtTechnicalDetails" type="hidden" name="txtTechnicalDetails" runat="server" />
						<input id="txtPrintAtHome" type="hidden" name="txtPrintAtHome" runat="server" /><input id="txtCinEmailDisplayName" type="hidden" name="txtEmailDisplayName" runat="server" />
						<input id="txtCinEmailFromAddress" type="hidden" name="txtEmailFromAddress" runat="server" /><input id="txtDateOrderChanged" type="hidden" runat="server" />
						<input id="txtCancelClick" type="hidden" runat="server" />
						<input id="txtSelectedMobileMake" type="hidden" runat="server" /><input id="txtLoyaltyMemberChecked" type="hidden" runat="server" />
						<input id="txtCinEmailCopyAddress" type="hidden" name="txtEmailCopyAddress" runat="server" />
						
						<% ' Save posted values so that values are retained on postback %>
						<input id="visPayerID" type="hidden" name="visPayerID" runat="server" />
						<input id="visAuthID" type="hidden" name="visAuthID" runat="server" />
						<input id="visCardType" type="hidden" name="visCardType" runat="server" />
						<input id="visUserID" type="hidden" name="visUserID" runat="server" />
						<div style="DISPLAY: none"><asp:button id="btnPayNowClick" runat="server" Width="0px" Text="Button" Height="0px"></asp:button><asp:button id="btnBackSeatsClick" runat="server" Width="0px" Text="Button" Height="0px"></asp:button><asp:button id="btnCancelClick" runat="server" Width="0px" Text="Button" Height="0px"></asp:button><asp:button id="btnBackTicketsClick" runat="server" Width="0px" Text="Button" Height="0px"></asp:button></div>
					</td>
				</tr>
			</table>
	<!--#INCLUDE FILE = "visSkinBodyFooter.htm" -->
    </form>
    
    <script type="text/javascript" language="javascript">
		<!--
<% 
		'---------------------------------------------------------------------------------------------
		'-- IMPORTANT - DEVLOPERS PLEASE READ: Always use this way of commenting.
		'--								HTML Comments can be read by the client
		'--								We do not want clients knowing what our jscript functions do!
		'---------------------------------------------------------------------------------------------
%>


<% 
		'---------------------------------------------------------------------------------------------
		'-- This function hides and shows the clock layer.
		'---------------------------------------------------------------------------------------------
%>	
		function HideClockLayer(id) {
			var objDiv;

			<% '-- Wrap up for early browser version that don't support getElementById %>
			try {
				<% '-- Get the layer object %>
				objDiv = document.getElementById(id);

				<% '-- If the layer is hidden then show it, otherwise hide it. %>
				if (objDiv.style.visibility == "hidden") {
					objDiv.style.visibility = "visible";
				} else {
					objDiv.style.visibility = "hidden";
				}			
			} catch(e) {
			}
		}	

<% 
		'---------------------------------------------------------------------------------------------
		'-- This function hides and shows the processing animation layer.
		'---------------------------------------------------------------------------------------------
%>	
		function HideShowLayer(id) {
			var objDiv;

			<% '-- Wrap up for early browser version that don't support getElementById %>
			try {
				<% '-- Get the layer object %>
				objDiv = document.getElementById(id);

				<% '-- If the layer is hidden then show it, otherwise hide it. %>
				if (objDiv.style.display == "none") {
					objDiv.style.display = "inline";					
				} else {
					objDiv.style.display = "none";
				}
				
				<% '-- If the layer is now shown then restart the animated gif. %>
				if (objDiv.style.display == "inline") {
				    objDiv.style.visibility = 'visible';
				    setTimeout('showAnim()', 200);
					
				}				
			} catch(e) {
			}
		}
		
		function showAnim() {
		    document.frmWebPaymentConfirm.imgProcessing.src="Processing.gif#";
		}

<% 
		'---------------------------------------------------------------------------------------------
		'-- This function hides and shows the processing animation layer.
		'---------------------------------------------------------------------------------------------
%>	
		function ShowProcessing(id) {
			var objDiv;

			<% '-- Wrap up for early browser version that don't support getElementById %>
			try {
				<% '-- Get the layer object %>
				objDiv = document.getElementById(id);

				objDiv.style.display = "inline";					
				document.frmWebPaymentConfirm.imgProcessing.src="Processing.gif#";
				
			} catch(e) {
			}
		}
		
<% 
		'---------------------------------------------------------------------------------------------
		'-- This function disables the order tickets button and displays processing animation if terms and conditions are agreed to.
		'-- once a button is disabled, not even javascript can click a button programatically when disabled so must click another button which does essentially the same thing
		'---------------------------------------------------------------------------------------------
%>	
		function PClick(PayButton) {
			<% '-- Second stop the clock to allow payment to process. %>
			countdown.stop();
			<% '-- Flag hidden field so know not to display clock until payment is finished, and order last update time is refreshed. %>
			document.frmWebPaymentConfirm.txtPayClick.value = 'Yes';			
			<% '-- Disable all buttons including paynow and call click event for the PayNow server side control, which will attempt to finalise the booking %>
			DisableButtons(PayButton, 'btnPayNowClick');
			<% '-- Show processing animation as last thing we do or animated gif might not show properly. %>
			HideClockLayer('ClockLayer');			
			<% '-- Show processing animation as last thing we do or animated gif might not show properly. %>
			HideShowLayer('ProcAnimation');
		}

<% 
		'---------------------------------------------------------------------------------------------
		'-- This function disables the order tickets button.
		'-- once a button is disabled, not even javascript can click a button programatically when disabled so must click another button which does essentially the same thing
		'---------------------------------------------------------------------------------------------
%>
		function DisableButtons(Button, id) {
			<% '-- Depending on which button was clicked, attempt to disable all other buttons %>
			if (id == 'btnPayNowClick') {
				try {
					document.getElementById('ibtnCancel').disabled = 'true';
					document.getElementById('ibtnCancel').className = 'CursorArrow';
					disableAnchor('', '');
					disableAnchor('lnkTerms', '');
				} catch(e) {
				}
			}
			
			if (id == 'btnCancelClick') {
				try {
					document.getElementById('ibtnPayNow').disabled = 'true';
					document.getElementById('ibtnPayNow').className = 'CursorArrow';
					document.frmWebPaymentConfirm.txtCancelClick.value = 'Yes';
					disableAnchor('', '');
					disableAnchor('lnkTerms', '');
				} catch(e) {
				}						
			}
			
			if (id == 'lnkChangeSeats') {
				try {
					document.getElementById('ibtnPayNow').disabled = 'true';
					document.getElementById('ibtnPayNow').className = 'CursorArrow';
					document.getElementById('ibtnCancel').disabled = 'true';
					document.getElementById('ibtnCancel').className = 'CursorArrow';
					disableAnchor('', 'lnkChangeSeats');
					disableAnchor('lnkTerms', '');
				} catch(e) {
				}						
			}		
			
			if (id == 'lnkChangeTickets') {
				try {
					document.getElementById('ibtnPayNow').disabled = 'true';
					document.getElementById('ibtnPayNow').className = 'CursorArrow';
					document.getElementById('ibtnCancel').disabled = 'true';
					document.getElementById('ibtnCancel').className = 'CursorArrow';
					disableAnchor('', 'lnkChangeTickets');
					disableAnchor('lnkTerms', '');
				} catch(e) {
				}						
			}
			
			if (id == 'lnkChangeConcessions') {
				try {
				    document.getElementById('ibtnPayNow').disabled = 'true';
					document.getElementById('ibtnPayNow').className = 'CursorArrow';
					document.getElementById('ibtnCancel').disabled = 'true';
					document.getElementById('ibtnCancel').className = 'CursorArrow';
					disableAnchor('', 'lnkChangeConcessions');
					disableAnchor('lnkTerms', '');
				} catch(e) {
				}						
			}
		
			<% '-- Wrap up for early browser versions not supporting getElementById %>
			<% '-- Now disable the button that was clicked %>
			try {
				<% '-- Try a dummy getElementById so if not supported will exit this try immediately %>
				var TestGetId				
				TestGetId = document.getElementById(id).id
			
				<% '-- First disable the button clicked so it cannot be clicked again until page returns. %>
				Button.disabled = true;
				<% '-- Change cursor back to default to visually show button is disabled. %>
				Button.className = 'CursorArrow';
				
				<% '-- Since the button has been disabled, we can no longer click it. So we click an invisible button which in server side code simply calls the real button server side click function  %>
				document.getElementById(id).click();		
			} catch(e) {
			}
			
			<% '-- If cancel button was clicked, show processing animation as last thing we do. Otherwise gif may not show properly. %>
			if (id == 'btnCancelClick') {
				try {
					<% '-- Show processing animation %>
					HideShowLayer('ProcAnimation');				
				} catch(e) {
				}
			}
		}
		
<% 
		'---------------------------------------------------------------------------------------------
		'-- This function removes the hyperlink reference from the specified anchor				
		'---------------------------------------------------------------------------------------------
%>	
		
		function disableAnchor(obj, ignoreObj){
			if (obj != '') {
				try {
					document.getElementById(obj).removeAttribute('href');
				} catch (e) {
				}
			}
			else {
				var anchors = document.getElementsByTagName('a');
				for (var i=0; i< anchors.length;i++) {
					try {
						var anchor = anchors[i];
						if (ignoreObj != anchor.id) {
							if (anchor.getAttribute('href') != '') {
								anchor.removeAttribute('href');
							}
						}
					} catch (e) {
					}
				}
			}
		}

<% 
		'---------------------------------------------------------------------------------------------
		'-- This function opens a new browser window to the size specified and navigates to the url specified				
		'---------------------------------------------------------------------------------------------
%>	
		function openWindow(url,winHeight,winWidth){
			window.open (url, 'newwindow', config='height=' + winHeight +', width=' + winWidth + ', toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, directories=no, status=no');
		}	
		
<% 
		'-------------------------------------------------------------------------------------------------
		'-- This function saves the value of the mobile make to retrieve the correct models for that make
		'-------------------------------------------------------------------------------------------------
%>			
		function SaveMobileMakeSelected() {
			try {
				var dropList = document.getElementById('dropMobileMake');
				document.frmWebPaymentConfirm.txtSelectedMobileMake.value = dropList.options[dropList.selectedIndex].value;
			} catch (e) {
				txtSelectedMobileMake.value = '';
			}
		}

<% 
		'-------------------------------------------------------------------------------------------------
		'-- This function saves whether the loyalty check box has been ticked to display the card number field
		'-------------------------------------------------------------------------------------------------
%>			
		function SaveLoyaltyCheckboxState() {
			try {
				var checkbox = document.getElementById('chkLoyalty');
				document.frmWebPaymentConfirm.txtLoyaltyMemberChecked.value = checkbox.checked;
			} catch (e) {
			    txtLoyaltyMemberChecked.value = '';
			}
		}
				
		//-->
		</script>
        
         <%-- TODO: move this to the script block once this page is using the new master page --%>
        <script type="text/javascript">
            var countdown;
            $(function () {
                countdown = new Vista.Countdown($('.countdown'));
            });
        </script>   
</body>
</html>
