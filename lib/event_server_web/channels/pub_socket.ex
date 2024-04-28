defmodule EventServerWeb.PubSocket do
  use Phoenix.Socket

  channel "pub", EventServerWeb.PubChannel

  @impl true
  def connect(_params, socket, _connect_info) do
    {:ok, socket}
  end

  @impl true
  def id(_socket), do: nil
end
