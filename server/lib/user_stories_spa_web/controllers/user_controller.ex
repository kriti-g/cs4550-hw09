defmodule UserStoriesSpaWeb.UserController do
  use UserStoriesSpaWeb, :controller

  alias UserStoriesSpa.Users
  alias UserStoriesSpa.Users.User
  alias UserStoriesSpaWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :delete]
  plug :require_this_user when action in [:show, :delete]
  action_fallback UserStoriesSpaWeb.FallbackController

  def require_this_user(conn, _arg) do
    this_user_id = String.to_integer(conn.params["id"])
    if conn.assigns[:user].id == this_user_id do
      conn
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "Accessing a user which doesn't match the session."}))
      |> halt()
    end
  end

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    case Users.create_user(user_params) do
      {:ok, %User{} = user} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.user_path(conn, :show, user))
        |> render("show.json", user: user)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to register new user."}))
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    case Users.update_user(user, user_params) do
      {:ok, %User{} = user} ->
        render(conn, "show.json", user: user)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update user."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    case Users.delete_user(user) do
      {:ok, %User{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete user."}))
    end
  end
end
