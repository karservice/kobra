source 'http://rubygems.org'

gem 'rails', '>=3.1.0.rc1'

gem 'delayed_job'
gem 'devise'

gem 'jquery-rails'

gem 'sqlite3-ruby', :require => 'sqlite3'

# Thin
gem 'thin'
gem 'foreman'

# Deploy with Capistrano
gem 'capistrano'
gem 'capistrano-ext'

# Active sanity checks database for invalid records
gem 'active_sanity'

# Asset Pipeline
gem 'json'
gem 'sass'
gem 'coffee-script'
gem 'uglifier'

group :development do
  # Have to use thin since webrick + pg crashes in development mode
  gem 'thin'
  # Debugger
  gem 'ruby-debug19', :require => 'ruby-debug'
end

group :production do
  # Oracle needs this (with correct path)
  # export DYLD_LIBRARY_PATH=/opt/local/lib/oracle
  gem 'ruby-oci8' # Needs oracle-instantclient
  gem "activerecord-oracle_enhanced-adapter", :git => "git://github.com/rsim/oracle-enhanced.git"
  gem 'mysql2'
  # env ARCHFLAGS="-arch x86_64" gem install pg
  gem 'pg'
end

group :test do
  gem 'turn'
end

# Bundle the extra gems:
# gem 'bj'
# gem 'nokogiri', '1.4.1'
# gem 'sqlite3-ruby', :require => 'sqlite3'
# gem 'aws-s3', :require => 'aws/s3'

# Bundle gems for the local environment. Make sure to
# put test-only gems in this group so their generators
# and rake tasks are available in development mode:
# group :development, :test do
#   gem 'webrat'
# end
