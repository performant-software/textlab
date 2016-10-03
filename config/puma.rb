if ENV['RACK_ENV'] != 'development'
  port        ENV['PORT']     || 3000
  environment ENV['RACK_ENV'] || 'development'
  threads     (ENV["MIN_PUMA_THREADS"] || 0), (ENV["MAX_PUMA_THREADS"] || 16)
  preload_app!
end
