defmodule EventServerWeb.EndpointSub do
  use Phoenix.Endpoint, otp_app: :event_server

  # Subscriber socket.
  socket "/sub", EventServerWeb.SubSocket,
    websocket: true,
    longpoll: false
end
