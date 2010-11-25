# -*- encoding : utf-8 -*-
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

User.create(:username => 'admin', :email => 'admin@kobra.ks.liu.se', :admin => true, :password => "liukort", :password_confirmation => "liukort")
puts ""
puts "Default user created: (Username: admin Password: liukort)"
puts ""
puts "No data are seeded to Studentkoll, the student database, add yourself with your own LiU-card information!"