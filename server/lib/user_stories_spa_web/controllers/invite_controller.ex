defmodule UserStoriesSpaWeb.InviteController do
  use UserStoriesSpaWeb, :controller

  alias UserStoriesSpa.Invites
  alias UserStoriesSpa.Invites.Invite
  alias UserStoriesSpa.Users
  alias UserStoriesSpaWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete, :create]

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
    case Invites.create_invite(new_invite_params) do
      {:ok, %Invite{} = invi} ->
        invite = Invites.load_user(invi)
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
        |> render("show.json", invite: invite)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to create invite."}))
    end
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.json", invite: invite)
  end

  def update(conn, %{"id" => id, "invite" => invite_params}) do
    invite = Invites.get_invite!(id)

    case Invites.update_invite(invite, invite_params) do
      {:ok, %Invite{} = invite} ->
        render(conn, "show.json", invite: invite)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update invite."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    case Invites.delete_invite(invite) do
      {:ok, %Invite{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete invite."}))
    end
  end
end
