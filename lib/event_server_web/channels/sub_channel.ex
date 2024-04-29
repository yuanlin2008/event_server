defmodule EventServerWeb.SubChannel do
  use EventServerWeb, :channel

  @impl true
  def join("sub", _payload, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_in("subscribe", %{"targets"=>targets}, socket) do
    subscribe(targets)
    {:reply, :ok, socket}
  end

  @impl true
  def handle_in("unsubscribe", %{"targets"=>targets}, socket) do
    unsubscribe(targets)
    {:reply, :ok, socket}
  end

  defp subscribe(targets) do
    Enum.each(targets, fn(target)->
      EventServerWeb.Endpoint.subscribe(target)
    end)
  end

  defp unsubscribe(targets) do
    Enum.each(targets, fn(target)->
      EventServerWeb.Endpoint.unsubscribe(target)
    end)
  end
end
