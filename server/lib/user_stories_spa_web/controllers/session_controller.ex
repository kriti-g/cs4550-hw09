defmodule UserStoriesSpaWeb.PostController do
  use UserStoriesSpaWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    user = UserStoriesSpa.Users.get_user_by_email(email)
    # TODO: Verify password
    sess = %{
      user_id: user.id,
      name: user.name,
      email: user.email,
      token: Phoenix.Token.sign(conn, "user_id", user.id),
    }
    conn
    |> put_resp_header("content-type", "application/json; charset=UTF-8")
    |> send_resp(:created, Jason.encode!(sess))
  end
end
