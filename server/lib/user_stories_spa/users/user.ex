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

  @password_opts [
    length: [min: 8, max: 30, messages: [too_short: "Password is too short!"]],
    character_set: [
      upper_case: [1, :infinity], # at least one upper case letters
      numbers: [1, :infinity],  # from 1 to 4 number characters
    ]
  ]

  @doc false
  def changeset(user, attrs) do
    IO.inspect([:before, attrs])
    password = attrs["password"]
    IO.inspect([:after, attrs, password])
    PasswordValidator.validate(password, @password_opts)
    user
    |> cast(attrs, [:name, :email])
    |> add_password_hash(attrs["password"])
    |> validate_required([:name, :email, :password_hash])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  def changeset_force(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password_hash])
    |> validate_required([:name, :email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  def add_password_hash(cset, nil) do
    cset
  end

  def add_password_hash(cset, password) do
    change(cset, Argon2.add_hash(password))
  end
end
