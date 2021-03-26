defmodule UserStoriesSpaWeb.InviteController do
  use UserStoriesSpaWeb, :controller

  alias UserStoriesSpa.Invites
  alias UserStoriesSpa.Invites.Invite
  alias UserStoriesSpa.Users

  action_fallback UserStoriesSpaWeb.FallbackController

  def index(conn, _params) do
    invites = Invites.list_invites()
    render(conn, "index.json", invites: invites)
  end

  def create(conn, %{"invite" => invite_params}) do
    email = invite_params["user_email"]
    user = Users.get_user_by_email(email)
    [link, new_invite_params] = if user do
      lin = "http://events-spa.gkriti.art/events/" <> to_string(invite_params["event_id"])
      [lin, Map.put(invite_params, "user_id", user.id)]
    else
      new_user = %{
        name: "---CHANGE THIS TO YOUR NAME---",
        email: email,
        password_hash: "nohash"
      }
      {:ok, created} = Users.create_user_artificial(new_user)
      lin = "http://events-spa.gkriti.art/users/" <>  to_string(created.id) <> "/edit"
      [lin, Map.put(invite_params, "user_id", created.id)]
    end
    with {:ok, %Invite{} = invi} <- Invites.create_invite(new_invite_params) do
      invite = Invites.load_user(invi)
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
      |> render("show.json", invite: invite)
    end
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.json", invite: invite)
  end

  def update(conn, %{"id" => id, "invite" => invite_params}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{} = invite} <- Invites.update_invite(invite, invite_params) do
      render(conn, "show.json", invite: invite)
    end
  end

  def delete(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{}} <- Invites.delete_invite(invite) do
      send_resp(conn, :no_content, "")
    end
  end
end
