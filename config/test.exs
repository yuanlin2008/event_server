import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :event_server, EventServerWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "2XcnJqTcm7lgnYvP8WHkGy9cuh8My846bKfxbQkLBqR0zO9T7uDdJZUe6EZ+wtfO",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
