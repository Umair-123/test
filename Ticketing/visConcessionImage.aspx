<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="visConcessionImage.aspx.vb" Inherits="visInternetTicketing.visConcessionImage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title><asp:Literal id="PageTitle" runat="server" /></title>
    <link href="visStyles.css" type="text/css" rel="stylesheet" />
	<!-- visStylesUser.css must proceed visStyles.css, so to override the default styles if requested -->
    <link href="visStylesUser.css" type="text/css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
    <div id="ConcessionImage">
        <img id="imgItem" class="ImageConcession" runat="server" />
        
        <div>
            <div>
                <asp:Label ID="lblConcessionName" CssClass="ConcessionImageText" runat="server"></asp:Label>
                <p>
                    <asp:Label ID="lblConcessionDescription" CssClass="ConcessionImageDescription" runat="server"></asp:Label>
                </p>
            </div>
            <div>
                <asp:HyperLink ID="lnkClose" CssClass="StandardLink" runat="server" NavigateUrl="#" onclick="window.close();"></asp:HyperLink>
            </div>
        </div>
        
    </div>
    </form>
</body>
</html>
