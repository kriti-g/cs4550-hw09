defmodule UserStoriesSpaWeb.InviteView do
  use UserStoriesSpaWeb, :view
  alias UserStoriesSpaWeb.InviteView
  alias UserStoriesSpaWeb.UserView

  def render("index.json", %{invites: invites}) do
    %{data: render_many(invites, InviteView, "invite.json")}
  end

  def render("show.json", %{invite: invite}) do
    %{data: render_one(invite, InviteView, "invite.json")}
  end

  def render("invite.json", %{invite: invite}) do
    %{id: invite.id,
      response: invite.response,
      user: render_one(invite.user, UserView, "user.json"),
      event_id: invite.event_id
    }
  end
end
