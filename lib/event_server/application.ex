defmodule EventServer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      EventServerWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:event_server, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: EventServer.PubSub},
      # Start a worker by calling: EventServer.Worker.start_link(arg)
      # {EventServer.Worker, arg},
      # Start to serve requests, typically the last entry
      EventServerWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: EventServer.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  @spec config_change(any(), any(), any()) :: :ok
  def config_change(changed, _new, removed) do
    EventServerWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
