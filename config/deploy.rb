# -*- encoding : utf-8 -*-
set :stages, %w(staging production)
set :default_stage, "staging"

# Set the correct RVM environment
set :rvm_ruby_string, 'ruby-1.9.2'
set :rvm_type, :user

# Production deployment
set :application, "Kobra"
set :repository,  "Kobra"

set :user, "linweb"

set :scm, :git
set :deploy_to, "/var/www/kobra.ks.liu.se"

default_run_options[:pty] = true
ssh_options[:forward_agent] = true
set :use_sudo, false
set :scm_verbose, false
set :rails_env, "production"


set :branch, "master"
set :repository, "git@github.com:jage/cobra.git"
set :deploy_via, :remote_cache
set :git_shallow_clone, 1
set :keep_releases, 5


role :web, "sof.lysator.liu.se"                          # Your HTTP server, Apache/etc
role :app, "sof.lysator.liu.se"                          # This may be the same as your `Web` server
role :db,  "sof.lysator.liu.se", :primary => true # This is where Rails migrations will run

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    # Respawn Unicorn
    run "kill -USR2 `cat #{File.join(current_path, 'tmp', 'pids', 'unicorn.pid')}`"
  end
  desc "Link in uploaded stuff"
  task :relink_shared_directories, :roles => :app do
    run "ln -fs #{shared_path}/db/production.sqlite3 #{current_path}/db/production.sqlite3"
    run "ln -fs #{shared_path}/db/development.sqlite3 #{current_path}/db/development.sqlite3"
    run "ln -fs #{shared_path}/config/database.yml #{current_path}/config/database.yml"
    run "ln -fs #{shared_path}/config/initializers/gmail.rb #{current_path}/config/initializers/gmail.rb"
  end
end
after "deploy:update", "deploy:relink_shared_directories"
before :"deploy:symlink", :"deploy:assets";

desc "Compile asets"
task :assets do
  run "cd #{release_path}; RAILS_ENV=#{rails_env} bundle exec rake assets:precompile"
end

namespace :bundler do
  task :create_symlink, :roles => :app do
    shared_dir = File.join(shared_path, 'bundle')
    release_dir = File.join(current_release, '.bundle')
    run("mkdir -p #{shared_dir} && ln -s #{shared_dir} #{release_dir}")
  end

  task :bundle_new_release, :roles => :app do
    bundler.create_symlink
    run "cd #{release_path} &&
    env LD_LIBRARY_PATH=/usr/lib/oracle/xe/app/oracle/product/10.2.0/client/lib ORACLE_HOME=/usr/lib/oracle/xe/app/oracle/product/10.2.0/client bundle install --deployment --without test development"
  end
end

after 'deploy:update_code', 'bundler:bundle_new_release'
