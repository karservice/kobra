KOBRA - Ticket management for LiU students

INSTALL
=======

* Install ruby 1.9
* Install bundler (rubygem)
* Run `bundle install --without production` for development use
* Install default database.yml `mv config/database.yml.example config/database.yml`
* Run `rake db:setup` to install the database with default admin user (Username: admin Password: liukort)
* Run `rails server` and you're good to go!