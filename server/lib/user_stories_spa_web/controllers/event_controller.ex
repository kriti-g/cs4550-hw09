defmodule UserStoriesSpaWeb.EventController do
  use UserStoriesSpaWeb, :controller

  alias UserStoriesSpa.Events
  alias UserStoriesSpa.Events.Event
  alias UserStoriesSpaWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete, :create]
  plug :require_owner when action in [:update, :delete]

  action_fallback UserStoriesSpaWeb.FallbackController

  def require_owner(conn, _arg) do
    event_id = String.to_integer(conn.params["id"])
    event = Events.get_event!(event_id)
    user = conn.assigns[:user]
    if (user.id == event.user_id) do
      conn
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{"error" => "You don't have access to this event."}))
      |> halt()
    end
  end

  def index(conn, _params) do
    events = Events.list_events()
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params}) do
    case Events.create_event(event_params) do
      {:ok, %Event{} = ev} ->
        eve = Events.load_user(ev)
        even = Events.load_comments(eve)
        event = Events.load_invites(even)
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.event_path(conn, :show, event))
        |> render("show.json", event: event)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to create new event."}))
      end
  end

  def show(conn, %{"id" => id}) do
    event = Events.get_event!(id)
    render(conn, "show.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)
    case Events.update_event(event, event_params) do
      {:ok, %Event{} = event} ->
        conn
        |> render("show.json", event: event)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update event."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)
    case Events.delete_event(event) do
      {:ok, %Event{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete event."}))
    end
  end
end
