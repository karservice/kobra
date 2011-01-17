source 'http://rubygems.org'

gem 'rails', '3.0.3'

gem 'delayed_job', :git => 'http://github.com/collectiveidea/delayed_job.git'
gem 'devise'

#gem 'jquery-rails'

gem 'sqlite3-ruby', '1.3.1', :require => 'sqlite3'

# Use unicorn as the web server
gem 'unicorn'

# Deploy with Capistrano
gem 'capistrano'
gem 'capistrano-ext'

group :development do
  # Debugger
  gem 'ruby-debug19', :require => 'ruby-debug'
end

group :production do
  gem 'ruby-oci8' # Needs oracle-instantclient
  gem 'activerecord-oracle_enhanced-adapter'
  gem 'mysql2'
  # env ARCHFLAGS="-arch x86_64" gem install pg
  gem 'pg'
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
