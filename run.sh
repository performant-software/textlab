#!/bin/sh
cd /app
bundle exec rake assets:precompile
bundle exec puma -C config/puma.rb
