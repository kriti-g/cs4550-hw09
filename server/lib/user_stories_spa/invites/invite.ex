defmodule UserStoriesSpa.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invites" do
    field :response, Ecto.Enum, values: [:Maybe, :Yes, :No, :Pending]

    belongs_to :event, UserStoriesSpa.Events.Event
    belongs_to :user, UserStoriesSpa.Users.User

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:response, :event_id, :user_id])
    |> validate_required([:response, :event_id, :user_id])
  end
end
