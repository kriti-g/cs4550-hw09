# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :user_stories_spa,
  ecto_repos: [UserStoriesSpa.Repo]

# Configures the endpoint
config :user_stories_spa, UserStoriesSpaWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "9aZ1EsCPeoHveI1uSkcKBQA2vD6WgadKqDCgRLj1pNiKnL4Fx11/l8YR8GOiWLRW",
  db_pass: "ainuu2vaeD6i",
  base: "9aZ1EsCPeoHveI1uSkcKBQA2vD6WgadKqDCgRLj1pNiKnL4Fx11/l8YR8GOiWLRW",
  render_errors: [view: UserStoriesSpaWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: UserStoriesSpa.PubSub,
  live_view: [signing_salt: "WGJCSiRn"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
