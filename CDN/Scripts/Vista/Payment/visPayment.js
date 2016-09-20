// TODO: this is simply a dump of the inline script. Need to be tidied up.

// ---------------------------------------------------------------------------------------------
// -- This function hides and shows the clock layer.
// ---------------------------------------------------------------------------------------------
	
function HideClockLayer(id) {
    var objDiv;

     // Wrap up for early browser version that don't support getElementById 
    try {
         // Get the layer object 
        objDiv = document.getElementById(id);

         // If the layer is hidden then show it, otherwise hide it. 
        if (objDiv.style.visibility == "hidden") {
            objDiv.style.visibility = "visible";
        } else {
            objDiv.style.visibility = "hidden";
        }			
    } catch(e) {
    }
}	


//-------------------------------------------------------------------------------------------
// This function hides and shows the processing animation layer.
//-------------------------------------------------------------------------------------------

function HideShowLayer(id) {
    var objDiv;

     // Wrap up for early browser version that don't support getElementById 
    try {
         // Get the layer object 
        objDiv = document.getElementById(id);

         // If the layer is hidden then show it, otherwise hide it. 
        if (objDiv.style.display == "none") {
            objDiv.style.display = "inline";					
        } else {
            objDiv.style.display = "none";
        }
        
         // If the layer is now shown then restart the animated gif. 
        if (objDiv.style.display == "inline") {
            objDiv.style.visibility = 'visible';
            setTimeout("showAnim()",200);
        }			
    } catch(e) {
    }
}

function showAnim() {
    document.frmPayment.imgProcessing.src="Processing.gif#";
}


//-------------------------------------------------------------------------------------------
// This function hides and shows the processing animation layer.
//-------------------------------------------------------------------------------------------

function ShowProcessing(id) {
    var objDiv;

     // Wrap up for early browser version that don't support getElementById 
    try {
         // Get the layer object 
        objDiv = document.getElementById(id);

        objDiv.style.display = "inline";					
        document.frmPayment.imgProcessing.src="Processing.gif#";
        
    } catch(e) {
    }
}


//-------------------------------------------------------------------------------------------
// This function disables the order tickets button and displays processing animation if terms and conditions are agreed to.
// once a button is disabled, not even javascript can click a button programatically when disabled so must click another button which does essentially the same thing
//-------------------------------------------------------------------------------------------

function PClick(PayButton, id) {
     // Second stop the clock to allow payment to process. 
    countdown.stop();
     // Flag hidden field so know not to display clock until payment is finished, and order last update time is refreshed. 
    document.frmPayment.txtPayClick.value = 'Yes';			
     // Disable all buttons including paynow and call click event for the PayNow server side control, which will attempt to finalise the booking 
    if (id == 'ibtnPayPal') {
        DisableButtons(PayButton, 'btnPayPalClick');
    } else {
        DisableButtons(PayButton, 'btnPayNowClick');
    }

     // Show processing animation as last thing we do or animated gif might not show properly. 
    HideClockLayer('ClockLayer');
     // Show processing animation as last thing we do or animated gif might not show properly. 
    HideShowLayer('ProcAnimation');

    return false;
}


//-------------------------------------------------------------------------------------------
// This function disables the order tickets button.
// once a button is disabled, not even javascript can click a button programatically when disabled so must click another button which does essentially the same thing
//-------------------------------------------------------------------------------------------

function DisableButtons(Button, id) {

     // Depending on which button was clicked, attempt to disable all other buttons 
    if (id == 'btnPayNowClick') {
        try {
            document.getElementById('ibtnPayPal').disabled = 'true';
            document.getElementById('ibtnPayPal').className = 'CursorArrow';
            document.getElementById('ibtnCancel').disabled = 'true';
            document.getElementById('ibtnCancel').className = 'CursorArrow';
            disableAnchor('', '');
            disableAnchor('lnkTerms', '');
        } catch(e) {
        }
    }
    
    if (id == 'btnPayPalClick') {
        try {
            document.getElementById('ibtnPayNow').disabled = 'true';
            document.getElementById('ibtnPayNow').className = 'CursorArrow';
            document.getElementById('ibtnCancel').disabled = 'true';
            document.getElementById('ibtnCancel').className = 'CursorArrow';
            disableAnchor('', '');
            disableAnchor('lnkTerms', '');
        } catch(e) {
        }
    }
    
    if (id == 'btnCancelClick') {
        try {
            document.getElementById('ibtnPayPal').disabled = 'true';
            document.getElementById('ibtnPayPal').className = 'CursorArrow';
            document.getElementById('ibtnPayNow').disabled = 'true';
            document.getElementById('ibtnPayNow').className = 'CursorArrow';
            document.frmPayment.txtCancelClick.value = 'Yes';
            disableAnchor('', '');
            disableAnchor('lnkTerms', '');
        } catch(e) {
        }						
    }
    
    if (id == 'lnkChangeSeats') {
        try {
            document.getElementById('ibtnPayPal').disabled = 'true';
            document.getElementById('ibtnPayPal').className = 'CursorArrow';
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
            document.getElementById('ibtnPayPal').disabled = 'true';
            document.getElementById('ibtnPayPal').className = 'CursorArrow';
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
            document.getElementById('ibtnPayPal').disabled = 'true';
            document.getElementById('ibtnPayPal').className = 'CursorArrow';
            document.getElementById('ibtnPayNow').disabled = 'true';
            document.getElementById('ibtnPayNow').className = 'CursorArrow';
            document.getElementById('ibtnCancel').disabled = 'true';
            document.getElementById('ibtnCancel').className = 'CursorArrow';
            disableAnchor('', 'lnkChangeConcessions');
            disableAnchor('lnkTerms', '');
        } catch(e) {
        }						
    }
        
     // Wrap up for early browser versions not supporting getElementById 
     // Now disable the button that was clicked 
    try {
         // Try a dummy getElementById so if not supported will exit this try immediately 
        var TestGetId;				
        TestGetId = document.getElementById(id).id;
    
         // First disable the button clicked so it cannot be clicked again until page returns. 
        Button.disabled = true;
         // Change cursor back to default to visually show button is disabled. 
        Button.className = 'CursorArrow';
        
         // Since the button has been disabled, we can no longer click it. So we click an invisible button which in server side code simply calls the real button server side click function  
        document.getElementById(id).click();		
    } catch(e) {
    }
    
     // If cancel button was clicked, show processing animation as last thing we do. Otherwise gif may not show properly. 
    if (id == 'btnCancelClick') {
        try {
             // Show processing animation 
            HideShowLayer('ProcAnimation');				
        } catch(e) {
        }
    }
}


//-------------------------------------------------------------------------------------------
// This function removes the hyperlink reference from the specified anchor				
//-------------------------------------------------------------------------------------------


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


//-------------------------------------------------------------------------------------------
// This function opens a new browser window to the size specified and navigates to the url specified				
//-------------------------------------------------------------------------------------------

function openWindow(url,winHeight,winWidth){
    window.open (url, 'newwindow', config='height=' + winHeight +', width=' + winWidth + ', toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, directories=no, status=no');
}	


//-----------------------------------------------------------------------------------------------
// This function checks whether the value of an element is numeric and if not, blanks the value
//-----------------------------------------------------------------------------------------------
    
function CheckNumeric(component){
    try {
        strValue = component.value;
        
        if (isNaN(strValue)) {
             // The value is non-numeric, so remove the last key stroke which made it non-numeric 		
            component.value = component.value.substring(0,(component.value.length -1));
            
             // Make sure that the value is numeric after doing truncate 
            if (isNaN(component.value)) {
                component.value = '';
            }
        }			
    } catch(e) {
    }
}	


//-----------------------------------------------------------------------------------------------
// This function saves the value of the selected card type to refresh page with correct fields for that card type
//-----------------------------------------------------------------------------------------------
    
function SaveCardTypeSelected() {
    try {
        var dropList = document.getElementById('dropCardType');
        document.frmPayment.txtSelectedCardType.value = dropList.options[dropList.selectedIndex].value;
    } catch (e) {
        txtSelectedCard.value = '';
    }
}


//-----------------------------------------------------------------------------------------------
// This function saves the value of the mobile make to retrieve the correct models for that make
//-----------------------------------------------------------------------------------------------
    
function SaveMobileMakeSelected() {
    try {
        var dropList = document.getElementById('dropMobileMake');
        document.frmPayment.txtSelectedMobileMake.value = dropList.options[dropList.selectedIndex].value;
    } catch (e) {
        txtSelectedMobileMake.value = '';
    }
}


//-----------------------------------------------------------------------------------------------
// This function saves whether the loyalty check box has been ticked to display the card number field
//-----------------------------------------------------------------------------------------------
    
function SaveLoyaltyCheckboxState() {
    try {
        var checkbox = document.getElementById('chkLoyalty');
        document.frmPayment.txtLoyaltyMemberChecked.value = checkbox.checked;
    } catch (e) {
        txtLoyaltyMemberChecked.value = '';
    }
}

//-----------------------------------------------------------------------------------------------
// This function configures back page transfers to this page
//-----------------------------------------------------------------------------------------------

function BackPageCheck(){
    var moveForward = true;
    var cookieName = "visPayment_PaymentSubmitted";
    var cookieIndex = document.cookie.indexOf(cookieName);

    if (cookieIndex != -1){
        var payNowButton = document.getElementById("ibtnPayPal");

        moveForward = false;
        document.frmPayment.txtPayClick.value = 'No';	
        
        var cookie_date = new Date ( ); 
        cookie_date.setTime(cookie_date.getTime() - 1);
        document.cookie = cookieName += "=; expires=" + cookie_date.toGMTString();

        document.getElementById("txtFromBackButton").value = "1";     
        document.getElementById("ibtnPayNow").removeAttribute("disabled");                    
    }
    if (moveForward == true) window.history.go(1);
}

 // This sets which wallet card has been selected 

function WalletSelectionChange(selector) {
    var txtSelectedWalletCard = document.getElementById('txtSelectedWalletCard');

    txtSelectedWalletCard.value = selector.value;
}


//-----------------------------------------------------------------------------------------------
// This will trigger onload calls even when the back button is pressed in non-IE browsers
//-----------------------------------------------------------------------------------------------

$(document).ready( function(){
   BackPageCheck();
});
//-->

var countdown,
    cart;
$(function () {
    countdown = new Vista.Countdown($('.countdown'));

    cart = new Vista.Cart.Cart(new Vista.Cart.View($('#cart-summary')));

});
