defmodule UserStoriesSpaWeb.EventView do
  use UserStoriesSpaWeb, :view
  alias UserStoriesSpaWeb.EventView
  alias UserStoriesSpaWeb.UserView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("event.json", %{event: event}) do
    %{id: event.id,
      name: event.name,
      desc: event.desc,
      date: event.date,
      user: render_one(event.user, UserView, "user.json")}
  end
end
