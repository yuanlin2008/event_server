defmodule EventServerWeb.PubChannel do
  use EventServerWeb, :channel

  @impl true
  def join("pub", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in(
        "publish",
        %{
          "target" => target,
          "event" => event,
          "payload" => payload
        },
        socket
      ) do
    EventServerWeb.Endpoint.broadcast(target, event, %{data: payload})
    {:noreply, socket}
  end
end
