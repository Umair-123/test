<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visPayWithPoints.aspx.vb" Inherits="visInternetTicketing.visPurchaseRewards" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
    <head>
        
        <!-- TODO: move into styles css file --> 
        <style type="text/css">
            p
            {
                text-align: left;
            }
            
            p#pBlurb
            {
                padding-top: 5px;
                padding-left: 5px;
                padding-right: 5px;   
            }
            
            span.StandardText
            {
                font-size:11px;
                color:#000000;
                font-family:Verdana, Arial, Helvetica, sans-serif, "MS sans serif";
	            font-weight:normal;
	            font-style:normal;
            }
            
            span.OrderLabelTextMajor
            {
                font-size: 12px;
                color: #CC0000;
                font-weight: bold;
            }
            
            span.OrderValueTextMajor
            {
                font-size: 12px;
                font-weight: bold;
            }
            
            span.OrderLabelTextMinor
            {
                font-size: 11px;
                color: #CC0000;
            }
            
            span.OrderValueTextMinor
            {
                font-size: 11px;
            }
            
            table#tblPayWithPoints
            {
                width: 562px;
                margin-left: 5px;
                margin-right: 5px;
                border-collapse: collapse;
                border: 1px solid #29087B;
                text-align:center;
            }
            
            table#tblBody
            {
                width: 582px;
            }
            
            tr#thrHeader
            {
                background-color: #29087B;
                font-size:11px;
                color:#FFFF00;
                font-family:Verdana, Arial, Helvetica, sans-serif, "MS sans serif";
	            font-weight:normal;
	            font-style:normal;
	            height:30px;
            }
            
            #thcItemHeader
            {
                width:35%;
            }
            
            #thcPointsRequiredHeader
            {
                width:25%;
            }
            
            #thcPointsUsedHeader
            {
                width:20%;
            }
            
            table#tblPayWithPoints tr.ItemRow
            {
                height:30px;
            }
            
            table#tblPayWithPoints tr.ItemRow td
            {
                border-left:solid 1px #29087B;
                border-right:solid 1px #29087B;
                border-bottom:solid 1px #29087B;
                padding-left:5px;
                padding-right:5px;
            }
            
            table#tblPayWithPoints td.ItemText
            {
                text-align:left;
            }
            
            table#tblPayWithPoints td.ItemNumeric
            {
                text-align:right;
            }
            
            div#divOrderText
            {
                 padding:16px 5px 16px 5px;
                 height:50px;
            }
            
            /* tidy up this section, should cascade and group style here */
            span#lblTotalPointsAvailableLabel
            {
                float: left;
                width: 30%;
                text-align: left;  
            }
            
            span#lblTotalPointsAvailableValue
            {
                float: left;
                width: 10%;
                padding-right:10%;
                text-align: right;  
            }
            
            span#lblAmountSavedLabel
            {
                float: left;
                width: 40%;
                text-align: left;  
            }
            
            span#lblAmountSavedValue
            {
                float: left;
                width: 10%;
                text-align: right;  
            }
            
            span#lblTotalPointsUsedLabel
            {
                float: left;
                width: 30%;
                text-align: left;  
            }
            
            span#lblTotalPointsUsedValue
            {
                float: left;
                width: 10%;
                padding-right:10%;
                text-align: right;  
            }
            
            span#lblOrderTotalLabel
            {
                float: left;
                width: 40%;
                text-align: left;
                margin-left: 50%;
            }
            
            span#lblOrderTotalValue
            {
                float: left;
                width: 10%;
                text-align: right;  
            }
            
            td#tdPointsRequired input
            {
                display: none;   
            }
            
            .UndoButton
            {
                display: none;
            }
            
            .PointsUsedLabel
            {
                display: none;
            }
            
            #ibtnChangeSession
            {
                float:right;
            }	            
            
            #ibtnChangeTickets
            {
                float:right;
            }
            
            #ibtnSelectSeatsClick
            {
                float:right;
            }
            
            #ibtnSelectConcessions
            {
                float:right;
            }
            
            #ibtnNext
            {
                float:right;
            }     
        </style>
	    
	    <title></title>			
        <!-- <script type="text/javascript" language="javascript" src="prototype.js"></script> -->
	    <script type="text/javascript" language="javascript" src="visJavaCommon.js"></script>
	    <script type="text/javascript" language="javascript" src="jquery.js"></script>
        <script type="text/javascript" src="jquery-jtemplates.js"></script>
	    <script type="text/javascript" language="javascript" src="json2.js"></script>
	    <link href="visStyles.css" type="text/css" rel="stylesheet" />
	    <!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
	    <link href="visStylesUser.css" type="text/css" rel="stylesheet" />
    </head>
    <body class="FormStandard" onload="window.history.go(1);">
	    <form id="frmPayWithPoints" method="post" runat="server">         
		    <!--#INCLUDE FILE = "visSkinBodyHeader.htm" -->
		    
            <table class="BodyTable" id="tblBody">			    
			    <tr>
			        <td>
			            <!-- Blurb paragraph -->
			            <p id="pBlurb">
			                <asp:Label id="lblBlurb" runat="server" class="StandardText" />
			            </p>
            						
			            <!-- Pay with Points table -->
	                    <table id="tblPayWithPoints">
	                        <tr id="thrHeader" >
	                            <td id="thcItemHeader">
	                                <asp:Label id="lblItemHeader" runat="server" />
	                            </td>
	                            <td id="thcPriceHeader">
	                                <asp:Label id="lblPriceHeader" runat="server" />
	                            </td>
	                            <td id="thcPointsRequiredHeader">
	                                <asp:Label id="lblPointsRequiredHeader" runat="server" />
	                            </td>
	                            <td id="thcPointsUsedHeader">
	                                <asp:Label id="lblPointsUsedHeader" runat="server" />
	                            </td>	                
	                        </tr>			        
            			    
			                <asp:Repeater id="rptPayWithPoints" runat="server">
			                    <ItemTemplate>
			                        <tr id="trRedeemableItem" runat="server" class="ItemRow">
			                            <td id="tdItem" class="ItemText">
			                                <asp:Label id="lblItemDesc" runat="server" class="StandardText ItemDescLabel" />
			                            </td>
			                            <td id="tdPrice" class="ItemNumeric">
			                                <asp:Label id="lblItemPrice" runat="server" class="StandardText ItemPriceLabel" />
			                            </td>
			                            <td id="tdPointsRequired" class="ItemNumeric">
			                                <asp:Label id="lblPointsRequired" runat="server" class="StandardText PointsRequiredLabel" />
			                                <asp:ImageButton id="ibtnUndo" runat="server" class="UndoButton" imageurl="Images/undo-mini.gif" onclientclick="javascript:return UndoClick(this);" />
			                            </td>
			                            <td id="tdPointsUsed">
			                                <asp:Label id="lblPointsUsed" runat="server" class="StandardText PointsUsedLabel" />
			                                <asp:ImageButton id="ibtnRedeem" runat="server" class="RedeemButton" imageurl="Images/redeem-mini.gif" onclientclick="javascript:return RedeemClick(this);" />
			                            </td>	        
			                        </tr>	
			                    </ItemTemplate>
                            </asp:Repeater>
			            </table>
            			
            			
			            <!-- Order/Redemption labels -->
			            <div id="divOrderText">
			                <asp:Label id="lblTotalPointsAvailableLabel" runat="server" class="StandardText OrderLabelTextMinor" />
			                <asp:Label id="lblTotalPointsAvailableValue" runat="server" class="StandardText OrderValueTextMinor" />
                			    			
			                <asp:Label id="lblAmountSavedLabel" runat="server" class="StandardText OrderLabelTextMinor" />
			                <asp:Label id="lblAmountSavedValue" runat="server" class="StandardText OrderValueTextMinor" />
            			    
			                <asp:Label id="lblTotalPointsUsedLabel" runat="server" class="StandardText OrderLabelTextMinor" />
			                <asp:Label id="lblTotalPointsUsedValue" runat="server" class="StandardText OrderValueTextMinor" />
                			
    			            <div>
			                    <asp:Label id="lblOrderTotalLabel" runat="server" class="StandardText OrderLabelTextMajor" />
			                    <asp:Label id="lblOrderTotalValue" runat="server" class="StandardText OrderValueTextMajor" />		    			
    			            </div>
			            </div>
            			
			            <!-- Navigation buttons -->
			            <!-- TODO: url and css tidy up select/change concs -->
		                <div id="divNavButtons" >
		                    <div>
		                        <asp:imagebutton id="ibtnChangeTickets" runat="server" CssClass="ImageChangeTickets" ImageUrl="Images/ChangeTickets.gif" />
	                            <asp:imagebutton id="ibtnChangeSession" runat="server" CssClass="ImageChangeSession" ImageUrl="Images/changesession.gif" />
		                    </div>
	                        <div class="Clear">
	                            <asp:imagebutton id="ibtnNext" runat="server" CssClass="ImageNext" ImageUrl="Images/next.gif" onclientclick="javascript:SubmitClick();" />
	                            <asp:imagebutton id="ibtnSelectConcessions" runat="server" CssClass="ImageSelectConcessions" ImageUrl="Images/selectconcessions.gif" />
	                            <asp:imagebutton id="ibtnSelectSeatsClick" runat="server" CssClass="ImageSelectSeats" ImageUrl="Images/selectseats.gif" onclientclick="javascript:SubmitClick();" />
	                        </div>
	                    </div>
		                <div id="ProcAnimation" style="DISPLAY: none;">
		                    <asp:image id="imgProcessing" runat="server" CssClass="ImageProcessing" ImageUrl="Processing.gif#" />
		                </div>
		            </td>
			    </tr>
			</table>
			
			
		    
		    <input id="txtRedeemedItemList" type="hidden" name="txtRedeemedItemList" value="" />

            <!--#INCLUDE FILE = "visSkinBodyFooter.htm" -->
        </form>
        
        
        <script type="text/javascript">
            var m_orderItems;

            $(document).ready(function () {

                ParsePageJson();

                SetRedeemButtonVisibilty();

                SetRedeemButtonState();

                UpdateOrderLabels();
            });

            function ParsePageJson() {

                try {
                    // the page generates the JSON into a variable m_orderItemsJson
                    m_orderItems = jQuery.parseJSON(m_orderItemsJsonString);
                }
                catch (e) { }
            }

            function SetRedeemButtonVisibilty() {
                var payWithPointsTable;
                var jsonDataId;
                var redeemButton;
                var pointsUsedLabel;
                var undoButton;
                var blnItemIsRedeemed;

                try {
                    // for each item row in our table body, grab the item rows (skipping the header row)
                    if (document.getElementById("tblPayWithPoints").childNodes.length == 1) {
                        payWithPointsTable = document.getElementById("tblPayWithPoints").childNodes[0];
                    }
                    else {
                        payWithPointsTable = document.getElementById("tblPayWithPoints").childNodes[1];
                    }

                    for (var i = 0; i < payWithPointsTable.childNodes.length; i++) {
                        if (payWithPointsTable.childNodes[i].attributes == null)
                            continue;

                        jsonDataId = payWithPointsTable.childNodes[i].getAttribute("jsondataid");

                        if (jsonDataId == null)
                            continue;

                        // get corresponding json item
                        if (jsonDataId == m_orderItems[i - 1].itemId) {
                            redeemButton = GetRedeemButton(payWithPointsTable.childNodes[i]);
                            undoButton = GetUndoButton(payWithPointsTable.childNodes[i]);
                            pointsUsedLabel = GetPointsUsedLabel(payWithPointsTable.childNodes[i]);

                            blnItemIsRedeemed = (m_orderItems[i - 1].redeemedQty != 0);

                            // show only need to show/hide the redeem button for items that haven't been redeemed
                            if (!blnItemIsRedeemed) {
                                // if member does not have enough points for the item, and hasn't already redeemed it
                                if (m_PointsAvailable < m_orderItems[i - 1].pointsCost) {
                                    // hide redeem button / show '-' label
                                    redeemButton.style.display = "none";
                                    pointsUsedLabel.style.display = "inline";
                                }
                                else {
                                    // unless we've redeemed this item, show the redeem button again
                                    redeemButton.style.display = "inline";
                                    pointsUsedLabel.style.display = "none";
                                }
                            }
                        }
                    }
                }
                catch (e) { }
            }

            // Loop through the repeater hiding the redeem button if the item has been redeemed
            function SetRedeemButtonState() {
                var payWithPointsTable;
                var jsonDataId;
                var redeemButton;
                var pointsUsedLabel;
                var undoButton;
                var blnItemIsRedeemed;

                try {

                    // for each item row in our table body, grab the item rows (skipping the header row)
                    if (document.getElementById("tblPayWithPoints").childNodes.length == 1) {
                        payWithPointsTable = document.getElementById("tblPayWithPoints").childNodes[0];
                    }
                    else {
                        payWithPointsTable = document.getElementById("tblPayWithPoints").childNodes[1];
                    }

                    for (var i = 1; i < payWithPointsTable.childNodes.length; i++) {
                        if (payWithPointsTable.childNodes[i].attributes == null)
                            continue;

                        jsonDataId = payWithPointsTable.childNodes[i].getAttribute("jsondataid");

                        if (jsonDataId == null)
                            continue;

                        // get corresponding json item
                        if (jsonDataId == m_orderItems[i - 1].itemId) {

                            redeemButton = GetRedeemButton(payWithPointsTable.childNodes[i]);
                            pointsUsedLabel = GetPointsUsedLabel(payWithPointsTable.childNodes[i]);
                            undoButton = GetUndoButton(payWithPointsTable.childNodes[i]);

                            // Redeem button defaults as shown so only need to check one case ie. don't need to call 'HideUndoButton' or similar
                            if (m_orderItems[i - 1].redeemedQty != 0) {
                                // If order item is redeemed then hide the redeem button
                                HideRedeemButton(redeemButton);
                            }
                        }
                    }
                }
                catch (e) { }
            }

            function UpdateOrderLabels() {

                // post back to server to get correct format for these values
                var x = jQuery.post('visPayWithPoints.aspx?op=GetFormattedOrderLabels',
                { OrderTotalInCents: m_OrderTotalInCents, PointsAvailable: m_PointsAvailable, TotalAmountSaved: m_intAmountSavedInCents, PointsUsed: m_intPointsUsed },
                function (data) {
                    var formattedValues = jQuery.parseJSON(data);
                    document.getElementById("lblOrderTotalValue").innerHTML = formattedValues[0];
                    document.getElementById("lblTotalPointsAvailableValue").innerHTML = formattedValues[1];
                    document.getElementById("lblAmountSavedValue").innerHTML = formattedValues[2];
                    document.getElementById("lblTotalPointsUsedValue").innerHTML = formattedValues[3];
                });
            }

            function SubmitClick() {

                // include the JSON objects in postback
                document.getElementById("txtRedeemedItemList").value = JSON.stringify(m_orderItems);
            }

            function RedeemClick(redeemButton) {
                var parentContainer;
                var pointsRequiredLabel;
                var pointsUsedLabel;
                var origVal;
                var redeemableItem;

                try {
                    // get containing parent
                    parentContainer = redeemButton.parentNode.parentNode;

                    // Get objects from parent
                    redeemableItem = GetItemObject(parentContainer);
                    pointsRequiredLabel = GetPointsRequiredLabel(parentContainer);
                    pointsUsedLabel = GetPointsUsedLabel(parentContainer);

                    // Hide the redeem button and show the undo button
                    HideRedeemButton(redeemButton);

                    //update points required/used labels for this row
                    origVal = pointsUsedLabel.innerHTML;
                    pointsUsedLabel.innerHTML = pointsRequiredLabel.innerHTML;
                    pointsRequiredLabel.innerHTML = origVal;

                    //set item as redeemed
                    redeemableItem.redeemedQty += 1;

                    var discountValue = redeemableItem.valueInCents - redeemableItem.discPriceInCents;

                    m_intPointsUsed += redeemableItem.pointsCost;
                    m_intAmountSavedInCents += discountValue;
                    m_PointsAvailable -= redeemableItem.pointsCost;
                    m_OrderTotalInCents -= discountValue;

                    UpdateOrderLabels();

                    SetRedeemButtonVisibilty();
                }
                catch (e) { }

                return false;
            }

            function HideRedeemButton(redeemButton) {
                // get containing parent
                var parentContainer = redeemButton.parentNode.parentNode;

                // get objects from parent
                var undoButton = GetUndoButton(parentContainer);
                var pointsRequiredLabel = GetPointsRequiredLabel(parentContainer);
                var pointsUsedLabel = GetPointsUsedLabel(parentContainer);

                //hide redeem button
                redeemButton.style.display = "none";

                //show undo button
                undoButton.style.display = "inline";

                //hide points required to redeem label
                pointsRequiredLabel.style.display = "none";

                //show points used label
                pointsUsedLabel.style.display = "inline";
            }

            function UndoClick(undoButton) {

                try {
                    var parentContainer;
                    var redeemButton;
                    var pointsRequiredLabel;
                    var pointsUsedLabel;
                    var origVal;
                    var redeemableItem;

                    // get containing parent
                    parentContainer = undoButton.parentNode.parentNode;
                    redeemButton = GetRedeemButton(parentContainer);
                    pointsRequiredLabel = GetPointsRequiredLabel(parentContainer);
                    pointsUsedLabel = GetPointsUsedLabel(parentContainer);
                    redeemableItem = GetItemObject(parentContainer);

                    //show redeem button
                    redeemButton.style.display = "inline";

                    //hide undo button
                    undoButton.style.display = "none";

                    //show points required label
                    pointsRequiredLabel.style.display = "inline";

                    //hide points used label
                    pointsUsedLabel.style.display = "none";

                    //update points required/used labels
                    origVal = pointsRequiredLabel.innerHTML;
                    pointsRequiredLabel.innerHTML = pointsUsedLabel.innerHTML;
                    pointsUsedLabel.innerHTML = origVal;

                    //reduce redeemed qty
                    redeemableItem.redeemedQty -= 1;

                    var discountValue = redeemableItem.valueInCents - redeemableItem.discPriceInCents;

                    m_intPointsUsed -= redeemableItem.pointsCost;
                    m_intAmountSavedInCents -= discountValue;
                    m_PointsAvailable += redeemableItem.pointsCost;
                    m_OrderTotalInCents += discountValue;

                    UpdateOrderLabels();

                    SetRedeemButtonVisibilty();
                }
                catch (e) { }

                return false;
            }

            function GetPointsRequiredLabel(ParentRowContainer) {
                var ptsReqLabel;
                var childIndex;
                var childNode;

                // some browsers include the newline chars in the markup as text nodes, need to check for that before grabbing the undo button
                if (ParentRowContainer.childNodes.length == 9) {
                    childIndex = 5;
                    childNode = 1;
                }
                else {
                    // markup doesn't include newlines
                    childIndex = 2;
                    childNode = 0;
                }

                try {
                    ptsReqLabel = ParentRowContainer.childNodes[childIndex].childNodes[childNode];
                }
                catch (e) { }

                return ptsReqLabel;
            }

            function GetPointsUsedLabel(ParentRowContainer) {
                var ptsUsedLabel;
                var childIndex;
                var childNode;

                // some browsers include the newline chars in the markup as text nodes, need to check for that before grabbing the undo button
                if (ParentRowContainer.childNodes.length == 9) {
                    childIndex = 7;
                    childNode = 1;
                }
                else {
                    // markup doesn't include newlines
                    childIndex = 3;
                    childNode = 0;
                }

                try {
                    ptsUsedLabel = ParentRowContainer.childNodes[childIndex].childNodes[childNode];
                }
                catch (e) { }

                return ptsUsedLabel;
            }

            function GetUndoButton(ParentRowContainer) {
                var undoButton;
                var childIndex;
                var childNode;

                // some browsers include the newline chars in the markup as text nodes, need to check for that before grabbing the undo button
                if (ParentRowContainer.childNodes.length == 9) {
                    childIndex = 5;
                    childNode = 3;
                }
                else {
                    // markup doesn't include newlines
                    childIndex = 2;
                    childNode = 2;
                }

                try {
                    undoButton = ParentRowContainer.childNodes[childIndex].childNodes[childNode];
                }
                catch (e) { }

                return undoButton;
            }

            function GetRedeemButton(ParentRowContainer) {
                var redeemButton;
                var childIndex;
                var childNode;

                // some browsers include the newline chars in the markup as text nodes, need to check for that before grabbing the undo button
                if (ParentRowContainer.childNodes.length == 9) {
                    childIndex = 7;
                    childNode = 3;
                }
                else {
                    // markup doesn't include newlines
                    childIndex = 3;
                    childNode = 2;
                }

                try {
                    redeemButton = ParentRowContainer.childNodes[childIndex].childNodes[childNode];
                }
                catch (e) { }

                return redeemButton;
            }

            function GetItemObject(ParentRowContainer) {
                var rowId;

                try {

                    rowId = ParentRowContainer.getAttribute("RowId");

                    return m_orderItems[rowId];

//                  for (var i = 0; i < m_orderItems.length; i++) {
//                      if (m_orderItems[i].itemId == jsonDataId) {
//                          return m_orderItems[i];
//                      }
//                  }
                }
                catch (e) { }

                return null;
            }
        
        </script>
    </body>
</html>
