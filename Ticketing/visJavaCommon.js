//-- Printing
function supportedPrint(){
	try {
		sAgent = navigator.userAgent;
		bIsMac = sAgent.indexOf("Mac") > -1;
		bIsIE = sAgent.indexOf("MSIE") > -1;
		bIsIE3 = sAgent.indexOf("IE 3") > -1;
		bIsIE4 = sAgent.indexOf("IE 4") > -1;
		bIsIE5 = sAgent.indexOf("IE 5")  > -1;
		bIsNav = sAgent.indexOf("Mozilla") > -1 && !bIsIE;

		//-----
		//The part above gives a value of 'supported' to IE5 browsers, which
		//can support the function, and a value of 'notSupported' to other browsers,
		//which can't.
		//The part below tells the browser what to do, depending on which	one it is.
		//-----

		if (bIsMac || bIsIE3 || bIsIE4){
			printNow();
		}else{
			window.print();
		}
	}catch(e) {
		try {
			//Just try to print, without attempting to recognise brwser
			window.print();
		} catch(e) {
		}
	}
}

//------------------------
//-- visSelect.aspx starts
//------------------------

//-- This function is called "OnMouseOver" of the cinema and movie LinkButtons to show the full name of the cinema/movie as may be truncated %>
//-- It is only here for early browser versions which do not support the "ChangeNameAdvanced" function below, which is called "OnMouseOver" of the table cell %>
function ChangeName(LinkButton, strChangeTo) {
	try {
		LinkButton.innerHTML = strChangeTo;
	} catch(e) {
	}				
}

//-- This function is called "OnMouseOver" of the table cell containing a cinema or movie. It shows the full name of what may be a truncated cinema/movie name %>
//-- It is wrapped up in a try/catch as it will fall over on some earlier browser since we are using getElementById() function. IE 5+ and Netscape 6+ are Ok. %>
function ChangeNameAdvanced(LinkButton, strChangeTo) {
	try {
		document.getElementById(LinkButton).innerHTML = strChangeTo;
	} catch (e) {					
	}						
}
//----------------------
//-- visSelect.aspx ends
//----------------------

//Sets ticket description css class on visSelectTickets
function setDescriptionCss(ID, LoyaltyTicket, LoyaltyMemberFound){
    try {
        if (LoyaltyTicket == '1') {
            //Ticket is loyalty ticket. Use different class
            if (LoyaltyMemberFound == 'True') {
                document.getElementById(ID).className = 'TicketTypeLoyaltySignedIn';
            } else {
                document.getElementById(ID).className = 'TicketTypeLoyalty';
            }
        } else {
            document.getElementById(ID).className = 'TicketType';
        }
    } catch (e){
        document.getElementById(ID).className = 'TicketType';
    }
}

function ResizeConcessionsTable(ImageDisplayMode, PromotionEnabled) {
    var viewImage;
    var largeImage;
    var description;
    var origCost;
    try {
        if (ImageDisplayMode == 0) {
            viewImage = $('colViewImage').getWidth();
            description = $('colDescription').getWidth();
            description = description + viewImage;
            $('colDescription').setStyle({
                width: description + 'px'
            });
            $('colViewImage').setStyle({
                width: 0
            });
        } else {
            largeImage = $('colLargeImage').getWidth();
            description = $('colDescription').getWidth();
            description = description + largeImage;
            $('colDescription').setStyle({
                width: description + 'px'
            });
            $('colLargeImage').setStyle({
                width: 0
            });                                     
        }
        
        if (PromotionEnabled == 0) {
            origCost = $('colOriginalCost').getWidth();
            description = $('colDescription').getWidth();
            description = description + origCost;
            $('colDescription').setStyle({
                width: description + 'px'
            });
            $('colOriginalCost').setStyle({
                width: 0
            });
        }
    } catch (e) {
    }
}

function SetPromoCss(ID) {
    try {
        document.getElementById(ID).className = 'TicketTypePricePromo';
    } catch(e) {
        
    }
}
    

function ShowContents(CurrentLang, CinemaId, SessionId, TicketId, Mode) {
	openWindow('visTicketContents.aspx?visLang=' + CurrentLang + '&visCinId=' + CinemaId + '&visSessId=' + SessionId + '&visTickId=' + TicketId + '&visMode=' + Mode, 360, 580);
}

function ShowConcessionContents(CurrentLang) {
    openWindow('visConcessionContents.aspx?visLang=' + CurrentLang, 360, 580);
}

function OpenConcImage(ItemImgPath, CinemaID, ItemID, CurrentLang, Height, Width) {
    //Measurements in pixels
    var imgHeight;
    var imgWidth;
    
    imgHeight = Height + 180;
    imgWidth = Width + 30;
    
    openWindow('visConcessionImage.aspx?visLang=' + CurrentLang + '&visImage=images/concessions/' + ItemImgPath + '&visCinemaId=' + CinemaID + '&visItemCode=' + ItemID, imgHeight, imgWidth);
}

function FocusFirstName() {
	var blnFocus;
	var blnDisabled;
	
	blnFocus = true;

	try {
		blnDisabled = document.Form1.txtFirstName.disabled;	
	} catch(e) {		
		blnFocus = false;
	}	
	
	if ((blnFocus == true) && (blnDisabled == false)) {
		document.Form1.txtFirstName.focus();
	}	
}

function FocusEmail() {
	var blnFocus;
	var blnDisabled;
	
	blnFocus = true;

	try {
		blnDisabled = document.Form1.txtEmail.disabled;	
	} catch(e) {		
		blnFocus = false;
	}	
	
	if ((blnFocus == true) && (blnDisabled == false)) {
		document.Form1.txtEmail.focus();
	}	
}

function CheckLogin() {
	//TWM - Client side validation. If we can stop a post back to the server that we know will fail then good!
	//remember that server side validation is required too. for those people who like to tamper with client-side script.

	try {
		var blnReturn;
		var strRequired;
		
		strRequired = '*';		
		blnReturn = true;

		//important this are checked in order they appear on the page.
		//that way we give focus to the top most field that hasn't been filled in.
		if (document.getElementById('txtEmail').value.trim() == '') {		
			document.getElementById('lblValidateEmail').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtEmail.focus();
			}		
			
			blnReturn = false;				
		} else {
			document.getElementById('lblValidateEmail').innerHTML = '';		
		}

		if (document.getElementById('txtPassword').value.trim() == '') {
			document.getElementById('lblValidatePassword').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtPassword.focus();
			}					
			
			blnReturn = false;
		}  else {
			document.getElementById('lblValidatePassword').innerHTML = '';		
		}
		
		if (blnReturn == false) {
			document.getElementById('lblMessage').innerHTML = document.getElementById('txtRequiredFields').value;
		}
		
		return blnReturn;	
	} catch(e) {
		//Just allow server side to handle
	}
}

function CheckReminder() {
	//TWM - Client side validation. If we can stop a post back to the server that we know will fail then good!
	//remember that server side validation is required too. for those people who like to tamper with client-side script.

	try {
		var blnReturn;
		var strRequired;
		
		strRequired = '*';		
		blnReturn = true;

		//important this are checked in order they appear on the page.
		//that way we give focus to the top most field that hasn't been filled in.
		if (document.getElementById('txtEmail').value.trim() == '') {
			document.getElementById('lblValidateEmail').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtEmail.focus();
			}			
			
			blnReturn = false;		
		} else {
			document.getElementById('lblValidateEmail').innerHTML = '';		
		}
		
		if (blnReturn == false) {
			document.getElementById('lblMessage').innerHTML = document.getElementById('txtRequiredFields').value;
		}
		
		return blnReturn;	
	} catch(e) {
		//Just allow server side to handle
	}
}

String.prototype.trim=function(){
	//so we can trim a string
    return this.replace(/^\s*|\s*$/g,'');
}

function CheckRegister() {
	//TWM - Client side validation. If we can stop a post back to the server that we know will fail then good!
	//remember that server side validation is required too. for those people who like to tamper with client-side script.

	try {
		var blnReturn;
		var strRequired;	
		
		strRequired = '*';
		blnReturn = true;

		//important this are checked in order they appear on the page.
		//that way we give focus to the top most field that hasn't been filled in.
		if (document.getElementById('txtFirstName').value.trim() == '') {		
			document.getElementById('lblValidateFirstName').innerHTML = strRequired;

			if (blnReturn == true) {
				document.Form1.txtFirstName.focus();
			}			
			
			blnReturn = false;		
		} else {
			document.getElementById('lblValidateFirstName').innerHTML = '';		
		}
		
		if (document.getElementById('txtLastName').value.trim() == '') {		
			document.getElementById('lblValidateLastName').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtLastName.focus();
			}			
			
			blnReturn = false;				
		} else {
			document.getElementById('lblValidateLastName').innerHTML = '';		
		}

		if (document.getElementById('txtEmail').value.trim() == '') {		
			document.getElementById('lblValidateEmail').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtEmail.focus();
			}			
			
			blnReturn = false;				
		} else {
			document.getElementById('lblValidateEmail').innerHTML = '';		
		}

		if (document.getElementById('txtPassword').value.trim() == '') {
			document.getElementById('lblValidatePassword').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtPassword.focus();
			}			
			
			blnReturn = false;
		} else {
			document.getElementById('lblValidatePassword').innerHTML = '';		
		}
		
		if (document.getElementById('ddlDOBMonth').value == "-"){
			document.getElementById('lblValidateDateOfBirth').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.ddlDOBMonth.focus();
			}			
			
			blnReturn = false;
		} else if (document.getElementById('ddlDOBDay').value == "-") {
			document.getElementById('lblValidateDateOfBirth').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.ddlDOBDay.focus();
			}			
			
			blnReturn = false;
		} else if (document.getElementById('ddlDOBYear').value == "-") {
			document.getElementById('lblValidateDateOfBirth').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.ddlDOBYear.focus();
			}			
			
			blnReturn = false;
		} else {
			document.getElementById('lblValidateDateOfBirth').innerHTML = '';		
		}
		
		if (document.getElementById('ddlGender').value.trim() == '') {
			document.getElementById('lblValidateGender').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.ddlGender.focus();
			}			
			
			blnReturn = false;
		} else {
			document.getElementById('lblValidateGender').innerHTML = '';		
		}
		
		if (document.getElementById('txtHomeNumber').value.trim() == ''
			|| document.getElementById('txtHomeNumber').value.replace(/[^\d]/g,'') == '') {
			document.getElementById('lblValidateHomeNumber').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtHomeNumber.focus();
			}			
			
			blnReturn = false;
		} else {
			document.getElementById('lblValidateHomeNumber').innerHTML = '';		
		}
		
		if (document.getElementById('txtMobileNumber').value.trim() == ''
			|| document.getElementById('txtMobileNumber').value.replace(/[^\d]/g,'') == '') {
			document.getElementById('lblValidateMobileNumber').innerHTML = strRequired;
			
			if (blnReturn == true) {
				document.Form1.txtMobileNumber.focus();
			}			
			
			blnReturn = false;
		} else {
			document.getElementById('lblValidateMobileNumber').innerHTML = '';		
		}
		
		
		if (blnReturn == false) {
			document.getElementById('lblMessage').innerHTML = document.getElementById('txtRequiredFields').value;
		}
		
		return blnReturn;	
	} catch(e) {
		//Just allow server side to handle
	}
}

function PasswordReminder(lang) {
	openWindow("visMbrReminder.aspx?visLang=" + lang, "180", "505");	
}

function SignUp(lang) {
	openWindow("visMbrRegister.aspx?visLang=" + lang, "500", "505");
}

function openAgreementWindow(page,winHeight,winWidth){
	window.open (page, 'agreementwindow', config='height=' + winHeight +', width=' + winWidth + ', toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, directories=no, status=no')
}

function DisplayLayer(id) {
	try {
		var objDiv;
				
		objDiv = document.getElementById(id);
		objDiv.style.display = "";
		//Bring to the top (Note: can never put a layer on top of a ListBox or DropDownList as they are ActiveX controls)		
		objDiv.style.zIndex = 999;
		
	} catch(e) {
	}
}

function ConcealLayer(id) {
	try {
		var objDiv;
				
		objDiv = document.getElementById(id);
		objDiv.style.display = "none";
		
	} catch(e) {
	}
}

//-----------------------------
//Speech prompt jscript starts
//-----------------------------

function HideShowLayer(id) {
	try {
		var objDiv;

		objDiv = document.getElementById(id);

		if (objDiv.style.visibility == "hidden") {
			objDiv.style.visibility = "visible";
			//Bring to the top (Note: can never put a layer on top of a ListBox or DropDownList as they are ActiveX controls)		
			objDiv.style.zIndex = 999;
		} else {objDiv.style.visibility = "hidden";
		}	
	} catch(e) {
	}
}

function ShowLayer(id) {
	try {
		var objDiv;

		objDiv = document.getElementById(id);	
		objDiv.style.visibility = "visible";
	} catch(e) {
	}
}

function HideLayer(id) {
	try {
		var objDiv;

		objDiv = document.getElementById(id);	
		objDiv.style.visibility = "hidden";
	} catch(e) {
	}
}

//----------------------------------------------------------------------------------------------
//-- Functions for swapping images onEvent
//-- Preloading is important when changing images on the fly.
//-- A slow connection will not get the desired effect unless images are pre-loaded.
//-- You can use the preload function, specifying your images locations in the body onload event for example
//----------------------------------------------------------------------------------------------
function MM_swapImgRestore() {
	var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) {
	var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
	d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document); return x;
}

function MM_swapImage() {
	var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
	if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_preloadImages() {
	var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
	var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
	if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

//-----------------------------------------------------------------------------------------------
//-- Functions for swapping images end
//-----------------------------------------------------------------------------------------------

//-- Function for calculating order total
function CalcOrderTotal(DecPlaces, sign, dec, mode) {
	var ValueInCents;
	var objTotal;
	var blnTicketsSelected;
	var div;
	var blnIsSeatAllocationOn = false;
	var isSeatAllocationOn;
	var isAvailForLtyDiscount;

	ValueInCents = 0;
	
	//Loop through all elements in the form
	for(i=0; i<document.forms[0].elements.length; i++){
		try {
		    var element = document.forms[0].elements[i];
		    if (element.id.indexOf('TotalInCents') > -1) {
				//This is one of the hidden objects which 
				//holds the total value in cents for each (TicketType * Qty)
				ValueInCents += parseFloat(element.value);						
			}
			
			//only applies to ticket selection
            if (element.id.indexOf('ddlQty') > -1) {
				if (element.value > 0) {
				    blnTicketsSelected = true;
				    // 2012/05/25 SJ - the old, non-jQuery version of this was not working in IE6
				    var jElement = $(element);
				    isSeatAllocationOn = jElement.attr("IsSeatAllocationOn");
				    if (isSeatAllocationOn == 'Y') {
				        blnIsSeatAllocationOn = true;
				    }
				}
            }
		} catch(e) {
            //no id associated with this element
		}
	}
	
	//Round to appropriate decimal places
	ValueInCents = ValueInCents.toFixed(DecPlaces);
	
	//Swap out decimal place for one specified in web.config (javascript by default uses "." regardless of client regional settings)
	ValueInCents = ValueInCents.toString();
	ValueInCents = ValueInCents.replace('.', dec);	
	
	//Set the order total
	objTotal = document.getElementById('objOrderTotal');
	
	if (sign.indexOf('#') > -1) {
	    objTotal.innerHTML = sign.replace('#', ValueInCents);
	} else {
	    objTotal.innerHTML = sign + ValueInCents;
	}
	
	if (mode == 'visSelectTickets') {
    	if (blnTicketsSelected == true) {

		    //We have a total, show appropriate buttons
		    ShowLayer('divOrderTickets');

		    if (document.forms[0].txtAllocatedSeating.value.toString() == 'Y' && (document.forms[0].txtForceSeatSelection.value.toString() == 'N') && (document.forms[0].txtEnableManualSeatSelection.value.toString() == 'Y') && blnIsSeatAllocationOn) {
			    ShowLayer('divSelectSeats');
		    }
			else {
		        HideLayer('divSelectSeats');
		    }

		    if (blnIsSeatAllocationOn === true && document.forms[0].txtForceSeatSelection.value.toString() === 'Y') {
                // When forcing seat selection ALWAYS hide the concessions button on visSelectTickets
                div = document.getElementById('divSelectConcessions');
		        div.style.display = 'none'; // instead of visible = 'hidden' so it doesn't leave a gap between buttons
            }
            else {
                if(document.forms[0].txtEnableConcessionSales.value.toString() === 'Y') {
                    // Show concession button
                    ShowLayer('divSelectConcessions');
		            div = document.getElementById('divSelectConcessions');
		            div.style.display = 'inline';
                }
                else {
                    // Hide concession button
                    div = document.getElementById('divSelectConcessions');
		            div.style.display = 'none';
                }
            }
	    } else {
		    //No total, make sure appropriate buttons are hidden
		    HideLayer('divOrderTickets');
		    HideLayer('divSelectSeats');
		    HideLayer('divSelectConcessions');
	    }
    }
}

//-- This function used to calculate ticket type sub-totals at client-side.
//-- If the user has already calculated total AT THE CINEMA then it will reset the bk fee and total so page knows the user has changed their mind and user gets some visual enterpretation.
function CalculateTotals(Qty, DecimalPlaces, FullValueInCents, subtotal, sign, dec, TicketValueInCents, mode) {
    var FullValue
	var objTicketValueInCents
	
	//Calculate currency value from cents with appropriate decimal places
	FullValueInCents = (FullValueInCents * Qty)/100;
    FullValue = FullValueInCents.toFixed(DecimalPlaces);
		
	//Swap out decimal place for one specified in web.config (javascript by default uses "." regardless of client regional settings)
	FullValue = FullValue.toString();
	FullValue = FullValue.replace('.', dec);
	
	//Set the "subtotal" value on the webpage
	if (sign.indexOf('#') > -1) {
	    subtotal.innerHTML = sign.replace('#', FullValue);
	} else {
        subtotal.innerHTML = sign + FullValue;
	}
	
	//Record the "ticket value in cents" in a hidden field for calculating total
    objTicketValueInCents = document.getElementById(TicketValueInCents);	
    objTicketValueInCents.value = FullValueInCents;
    
    CalcOrderTotal(DecimalPlaces, sign, dec, mode);	

}

function CalculatePoints(Qty, PointsCost, PointsText, DecimalPlaces, DecimalSeparator, SubTotalField, SubtotalValueField) {
    var FullValue;
    var FullValueText;
	var SubtotalValue;
	
	FullValue = PointsCost * Qty;
	//Swap out decimal place for one specified in web.config (javascript by default uses "." regardless of client regional settings)
	FullValueText = FullValue.toFixed(DecimalPlaces);
	FullValueText = FullValueText.toString();
	FullValueText = FullValueText.replace('.', DecimalSeparator);
	
	//Set the "subtotal" value on the webpage
	//Wrap in a try catch in case the field has been hidden
	try {
	    if (FullValue > 0) {
	        if (PointsText.indexOf('<AMOUNT>') > -1) {
	            SubTotalField.innerHTML = PointsText.replace('<AMOUNT>', FullValueText);
	        } else {
                SubTotalField.innerHTML = PointsText + FullValueText;
	        }
	    } else {
	        SubTotalField.innerHTML = '';
	    }    
    		
	    //Record the "ticket value in cents" in a hidden field for calculating total
        SubtotalValue = document.getElementById(SubtotalValueField);	
        SubtotalValue.value = FullValue;
	} catch (e) {
	}

    //Call this to update the total
    CalcOrderPoints(PointsText, DecimalPlaces, DecimalSeparator);	

}

function CalcOrderPoints(PointsText, DecimalPlaces, DecimalSeparator) {
	var PointsValue;
	var PointsValueText;
	var objTotal;
	
	PointsValue = 0;
	
	//Loop through all elements in the form
	for(i=0; i<document.forms[0].elements.length; i++){
		try {					
			if (document.forms[0].elements[i].id.indexOf('TotalInPoints') > -1) {
				//This is one of the hidden objects which 
				//holds the total value in cents for each (TicketType * Qty)
				if (document.forms[0].elements[i].value != '') {
				    PointsValue += parseFloat(document.forms[0].elements[i].value);
				}
			}
		} catch(e) {
			//no id associated with this element
		}
	}
	//Swap out decimal place for one specified in web.config (javascript by default uses "." regardless of client regional settings)
	PointsValueText = PointsValue.toFixed(DecimalPlaces);
	PointsValueText = PointsValueText.toString();
	PointsValueText = PointsValueText.replace('.', DecimalSeparator);	
	
	//Set the order total
	objTotal = document.getElementById('objOrderTotal');
	
	if (PointsValue > 0) {
	    if (PointsText.indexOf('<AMOUNT>') > -1) {
	        objTotal.innerHTML += ('<br />' + PointsText.replace('<AMOUNT>', PointsValueText));
	    } else {
	        objTotal.innerHTML += ('<br />' + PointsText + PointsValueText);
	    }
	}
}

//ECS 14/06/2011 T11757
//Validate member ticket selected
function ValidateMemberTicket(combo, messageMember, messageNonMember) {
    var memberTicketsSelected = $('select[value!="0"][MembershipTicket="1"]').length;
    var ticketsSelected = $('select[value!="0"]').length;
    var memberCombo = false;

    if ((ticketsSelected > 1 && memberTicketsSelected > 0) || memberTicketsSelected > 1) {
        if (combo) {
            document.getElementById(combo).value = '0';
            memberCombo = $("#" + combo).attr("MembershipTicket") === "1";
        }
        displayErrorMessage(true, memberCombo ? messageMember : messageNonMember);
    }
    else {
        displayErrorMessage(false, null);
    }
}

function displayCardNumberField(){
    var memberTicketsSelected = $('select[value!="0"][MembershipTicket="1"]').length;
    var txtCard = document.getElementById("txtMembershipCardNumberEntry");
    var tblCard = document.getElementById("tblMembershipCardNumberEntry");
    var tblVisible = false;

    if (tblCard) {
        tblVisible = tblCard.style.display === "";

        tblCard.style.display = memberTicketsSelected > 0 ? "" : "none";
        if (tblVisible === false && txtCard) {
            txtCard.value = "";
        }
    }
}

//ECS 14/06/2011 T11757
//Show error message
function displayErrorMessage(show, message) {
    var tblErrorId = "tblError";
    var lblErrorId = "#tblError > tbody > tr > td:nth-child(2)";
    try {
        if (show) {
            document.getElementById(tblErrorId).style.display = "";
            $(lblErrorId).html(message);
        }
        else {
            document.getElementById(tblErrorId).style.display = "none";
        }
    }
    catch (err) {
        //do nothing
    }
}

function openWindow(page,winHeight,winWidth){
	window.open (page, 'newwindow', config='height=' + winHeight +', width=' + winWidth + ', toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, directories=no, status=no')
}

// Sets focus to loyalty page controls ahead of menu items on header.
function VistaFocus(Page) {
	try {
		if ((Page == 'visLtyHome.aspx') || (Page == 'visLtyTicketsLogin.aspx')) {
			document.Form1.visLtyLogin_txtUserName.focus();							
		} else if (Page == 'visLtyCreateUser.aspx') {
			document.Form1.txtFirstName.focus();
		} else if (Page == 'visLtyCreateUserID.aspx') {
			document.Form1.txtCardNumber.focus();
		} else if (Page == 'visLtyForgotDetails.aspx') {
		    document.frmLtyForgotDetails.txtForgotInput.focus();
		}
	} catch(e) {
		//control may be in a hidden mode
	}
}


function GetReqsForNextRecognition(ClubID, BalanceList) {
    try {
        var objBalance;
        objBalance = BalanceList.split(";");
        
        //Example only. Change this as required for each club
        if (ClubID == 2) {
            var limitConc = 65; //every 65 points earns this reward
            var limitTicket = 100; //every 100 points earns this reward
            var pointsFound = false;
                        
            var i;
            for(i=0;i<objBalance.length;i++) {
                //Add additional points balance names as required to display points
                if (objBalance[i].indexOf("Member Points") >= 0) {
                    limitConc = limitConc - objBalance[i].substring(objBalance[i].lastIndexOf("~") + 1) % limitConc;
                    limitTicket = limitTicket - objBalance[i].substring(objBalance[i].lastIndexOf("~") + 1) % limitTicket;
                    pointsFound = true;
                    break;
                }
            }
            //Set next recognition labels. Limit to 1 reward only.
            if ((limitConc < 0 && limitTicket < 0) || !pointsFound) {
                //Points balance not found so dont display
                document.getElementById('visLtyLogin_tblRecognitionList').style.display = 'none';
            } else if (limitConc >= limitTicket) {
                document.getElementById('visLtyLogin_lblNextRecognition_Name').innerHTML = 'Free Ticket'
                document.getElementById('visLtyLogin_lblNextRecognition_Amount').innerHTML = limitTicket + ' points required';
            } else if (limitConc < limitTicket) {
                document.getElementById('visLtyLogin_lblNextRecognition_Name').innerHTML = 'Free Concession Combo'
                document.getElementById('visLtyLogin_lblNextRecognition_Amount').innerHTML = limitConc + ' points required';
            }
            
        } else {
            //Dont display any text
            document.getElementById('visLtyLogin_tblRecognitionList').style.display = 'none';
        }
        
        //Remove this when clubs and text is setup correctly
        document.getElementById('visLtyLogin_tblRecognitionList').style.display = 'none';
        
        
    } catch(e) {
        //Dont display any text
        document.getElementById('visLtyLogin_tblRecognitionList').style.display = 'none';
    }
        
}

function LoadMobileThumbnail() {
    var imgThumb;
    imgThumb = document.getElementById('imgMobileThumb');
}

function UpdateCartCount() {
    var cartSessionCount;
    var cartTable;
    
    cartSessionCount = 0;
    
    cartTable = document.getElementById('tblCartSessions');
    for(i=0;i < cartTable.rows.length;i++) {
        if (cartTable.rows[i].id != 'rowHeaderCart') {
            cartSessionCount += 1;
        }
    }
        
    if (cartSessionCount > 0) {
        document.getElementById('cart').style.display = 'block';
    } else {
        document.getElementById('cart').style.display = 'none';        
    }
}

function RemoveFromSummary(elementid) {
    var cartRow;
    
    cartRow = document.getElementById(elementid);
    cartRow.style.display = 'none';
}

function DisableFormImageButtons() {
    var elements;
    elements = document.forms[0].getElementsByTagName("input");
    for (i=0; i<elements.length; i++){
        if (elements[i].type == 'image') {
            elements[i].disabled=true;
        }
    }
}

function SetInitialTicketDisplay(tickClass, show) {
    var rows = $('tr[ticketclass="' + tickClass + '"]');

    for (var i = 0; i < rows.length; i++) {
        if (show) {
            $(rows[i]).show();
        } else {
            $(rows[i]).hide();
        }
    }
}

function HideShowTickets(tickClass, areaCategory) {
    var rows = $('tr[ticketclass="' + tickClass + '"][areacategory="' + areaCategory + '"]'),
        i;

    for (i = 0; i < rows.length; i++) {
        $(rows[i]).toggle();
    }
}

function HideShowAreaCategory(areaCategory) {
    var visibleRows = $('tr[areacategory="' + areaCategory + '"]:visible'),
        hiddenRows = $('tr[areacategory="' + areaCategory + '"]:hidden'),
        i;

    if (hiddenRows.length === 0) {
        for (i = 0; i < visibleRows.length; i++) {
            $(visibleRows[i]).hide();
        }
    }
    else {
        for (i = 0; i < hiddenRows.length; i++) {
            $(hiddenRows[i]).show();
        }
    }
}

function dialogPrompt(text) {
    if(!confirm(text)) {
        return false;
    } else {
        return true;
    }
}
 
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
} 