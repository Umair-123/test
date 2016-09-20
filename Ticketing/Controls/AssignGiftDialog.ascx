<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="AssignGiftDialog.ascx.vb" Inherits="visInternetTicketing.Controls.AssignGiftDialog" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>
<%@ Import Namespace="Vista.Web" %>

<form id="assign-gift-modal" class="modal-dialog-container">
    <h2><%: AssignGift.Heading1%><em><%: AssignGift.Heading2%></em></h2>
    
    <div class="assign-gift-wrapper">
        <div class="form-line">
            <span class="assign-gift-label"><%: AssignGift.LabelGift%></span>
            <ul class="assign-gift-value">
            </ul>
        </div>

        <div class="form-line assign-gift-quantity-line">
            <label for="assign-gift-quantity"><%: AssignGift.LabelQuantity%></label>
            <div class="plus-minus-numeric">
                <button type="button" class="minus icon icon-minus"></button><%--
            --%><input type="text" id="assign-gift-quantity" name="quantity" class="quantity" min="1" value="1"/><%--
            --%><button type="button" class="plus icon icon-plus"></button>
            </div>
        </div>
        
        <%= Fields.TextFieldFor(Function(f) f.Name, "assign-gift-name")%>
        <%= Fields.TextFieldFor(Function(f) f.Email, "assign-gift-email")%>
        <%= Fields.TextFieldFor(Function(f) f.SenderName, "assign-gift-sender-name")%>
        <%= Fields.TextAreaFor(Function(f) f.GiftMessage, "assign-gift-message")%>

        <div class="assign-gift-recipients">
            <h3><%: AssignGift.RecentRecipients%></h3>
            <ul class="checkbox-list">
            </ul>
        </div>

    </div>

    <button type="button" class="user-action assign-gift-close"><span><%: AssignGift.ButtonClose %></span></button>
    
    <div class="button-list-single">
        <button type="submit" class="page-action assign-gift-save"><span><%: AssignGift.ButtonAdd%></span></button>
    </div>
    
    <script type="text/javascript">
        Vista.Lang.AssignGift = {};
        Vista.Lang.AssignGift.Heading1 = <%= AssignGift.Heading1.ToJson()%>;
        Vista.Lang.AssignGift.Heading2 = <%= AssignGift.Heading2.ToJson()%>;
        Vista.Lang.AssignGift.EditHeading1 = <%= AssignGift.EditHeading1.ToJson()%>;
        Vista.Lang.AssignGift.EditHeading2 = <%= AssignGift.EditHeading2.ToJson()%>;
        Vista.Lang.AssignGift.ButtonSave = <%= AssignGift.ButtonSave.ToJson()%>;
        Vista.Lang.AssignGift.ButtonAdd = <%= AssignGift.ButtonAdd.ToJson()%>;
    </script>
</form>