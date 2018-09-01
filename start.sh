#!/bin/sh

source .env
bundle exec puma -C config/puma.rb
