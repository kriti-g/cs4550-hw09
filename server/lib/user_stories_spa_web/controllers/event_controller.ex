defmodule UserStoriesSpaWeb.EventController do
  use UserStoriesSpaWeb, :controller

  alias UserStoriesSpa.Events
  alias UserStoriesSpa.Events.Event

  action_fallback UserStoriesSpaWeb.FallbackController

  def index(conn, _params) do
    events = Events.list_events()
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params, "session" => session}) do
    case Phoenix.Token.verify(UserStoriesSpa.Endpoint, "user_id", session.token, max_age: 86400) do
      {:ok, user_id} ->
        with {:ok, %Event{} = ev} <- Events.create_event(event_params) do
          eve = Events.load_user(ev)
          even = Events.load_comments(eve)
          event = Events.load_invites(even)
          conn
          |> put_status(:created)
          |> put_resp_header("location", Routes.event_path(conn, :show, event))
          |> render("show.json", event: event)
        end
      {:error, _} ->
        conn
        |> put_resp_header(
          "content-type",
        "application/json; charset=UTF-8")
        |> send_resp(:unauthorized, Jason.encode!(%{error: "Failed to create."}))
    end
  end

  def show(conn, %{"id" => id}) do
    event = Events.get_event!(id)
    render(conn, "show.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)

    with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
      render(conn, "show.json", event: event)
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
