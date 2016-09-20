<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="SessionOverview.ascx.vb" Inherits="visInternetTicketing.Controls.SessionOverview" %>
<%@ Import Namespace="Vista.Cdn.Client" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Routing" %>
<%@ Import Namespace="InternetTicketing.Infrastructure.Localisation" %>

<div class="session-overview">
    <img src="<%: ContentDelivery.EntityImage(CdnMediaType.FilmPosterGraphic, MovieIdentifier, 55, 80)%>" width="55" height="80" alt="<%:MovieTitle %>" class="movie-poster" />
    <h4 class="session-overview-line movie-title"><%: MovieTitle %></h4>
    <div class="session-overview-line session-time"><%: String.Format(SessionOverview.SessionShowingTime, Formatter.FormatShortDateAndTime(SessionTime))%></div>
    <div class="session-overview-line cinema-screen-name"><%: String.Format("{0} - {1}", CinemaName, ScreenName)%></div>
</div>