defmodule UserStoriesSpaWeb.PostController do
  use UserStoriesSpaWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    user = UserStoriesSpa.Users.authenticate(email, password)

    if user do
      sess = %{
        user_id: user.id,
        name: user.name,
        token: Phoenix.Token.sign(conn, "user_id", user.id)
      }
      conn
      |> put_resp_header(
        "content-type",
      "application/json; charset=UTF-8")
      |> send_resp(:created, Jason.encode!(%{session: sess}))
    else
      conn
      |> put_resp_header(
        "content-type",
      "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{error: "fail"}))
    end
  end
end
