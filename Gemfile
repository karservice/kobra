source 'http://rubygems.org'

gem 'rails', '>=3.1.0.rc4'
gem 'delayed_job' # Background jobs
gem 'devise' # Authentication
gem 'jquery-rails'
gem 'sqlite3-ruby', :require => 'sqlite3'
# Thin for serving the site, and foreman for handling thin
gem 'thin'
gem 'foreman'
# Deploy with Capistrano
gem 'capistrano'
gem 'capistrano-ext'
# Asset Pipeline
gem 'json'
gem 'sass'
gem 'coffee-script'
gem 'uglifier'
# Active sanity checks database for invalid records
gem 'active_sanity'

group :development do
  # Debugger
  gem 'ruby-debug19', :require => 'ruby-debug'
end

group :production do
  # Oracle needs this (with correct path)
  # export DYLD_LIBRARY_PATH=/opt/local/lib/oracle
  gem 'ruby-oci8' # Needs oracle-instantclient
  gem "activerecord-oracle_enhanced-adapter"
  gem 'mysql2'
  # env ARCHFLAGS="-arch x86_64" gem install pg
  gem 'pg'
end

group :test do
  gem 'turn'
end
