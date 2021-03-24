defmodule UserStoriesSpa.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string

    has_many :events, UserStoriesSpa.Events.Event, on_delete: :delete_all
    has_many :comments, UserStoriesSpa.Comments.Comment, on_delete: :delete_all
    has_many :invites, UserStoriesSpa.Invites.Invite, on_delete: :delete_all
    
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password_hash])
    |> validate_required([:name, :email, :password_hash])
  end
end
