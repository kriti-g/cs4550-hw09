defmodule UserStoriesSpa.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field :date, :naive_datetime
    field :desc, :string
    field :name, :string
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:name, :desc, :date, :user_id])
    |> validate_required([:name, :desc, :date, :user_id])
  end
end
