defmodule EventServerWeb.PubSocket do
  use Phoenix.Socket

  channel "pub", EventServerWeb.PubChannel

  @impl true
  def connect(%{"secret" => secret}, socket, _connect_info) do
    case Application.fetch_env(:event_server, :pub_secret) do
      :error ->
        # do not need to check secret.
        {:ok, socket}

      {:ok, ^secret} ->
        # secret matched
        {:ok, socket}

      _ ->
        :error
    end
  end

  @impl true
  def id(_socket), do: nil
end
