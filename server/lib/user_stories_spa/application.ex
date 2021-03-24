defmodule UserStoriesSpa.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      UserStoriesSpa.Repo,
      # Start the Telemetry supervisor
      UserStoriesSpaWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: UserStoriesSpa.PubSub},
      # Start the Endpoint (http/https)
      UserStoriesSpaWeb.Endpoint
      # Start a worker by calling: UserStoriesSpa.Worker.start_link(arg)
      # {UserStoriesSpa.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: UserStoriesSpa.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    UserStoriesSpaWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
