defmodule UserStoriesSpa.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invites" do
    field :response, :string
    field :event_id, :id
    field :user_id, :id

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:response, :event_id, :user_id])
    |> validate_required([:response, :event_id, :user_id])
  end
end
