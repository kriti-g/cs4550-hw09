defmodule UserStoriesSpaWeb.PageController do
  use UserStoriesSpaWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
