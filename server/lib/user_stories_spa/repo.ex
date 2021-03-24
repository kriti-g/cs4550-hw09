defmodule UserStoriesSpa.Repo do
  use Ecto.Repo,
    otp_app: :user_stories_spa,
    adapter: Ecto.Adapters.Postgres
end
