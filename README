KOBRA - Ticket management for LiU students

INSTALL
=======

* Make sure Ruby 1.9 is installed on the system
* Install bundler and rake (rubygem) `gem install bundler rake`
* Run `bundle install --without production` to install the gems for development use
* Install default database.yml `mv config/database.yml.example config/database.yml` for development.
  Use MySQL for production use. (PostgreSQL should work also, not tested)
* Run `bundle exec rake db:setup` to install the database with default admin user (Username: admin Password: liukort)
* Run `bundle exec rails server` and you're good to go! Surf in to http://127.0.0.1:3000/ to view the site

For production use, access to the University databases STURE (PostgreSQL) and STUDENTKOLL (Oracle) is needed.