set :application, "Linticket"
set :repository,  "Linticket"

set :user, "linweb"

set :scm, :git
set :deploy_to, "/var/www/linticket.sof2009.se"

default_run_options[:pty] = true
ssh_options[:forward_agent] = true
set :use_sudo, false
set :scm_verbose, false
set :rails_env, "production" 


set :branch, "live"
set :repository, "git@github.com:jage/linticket.git"
set :deploy_via, :remote_cache
set :git_shallow_clone, 1
set :git_enable_submodules, 1
set :keep_releases, 5


role :web, "master.sof2009.se"                          # Your HTTP server, Apache/etc
role :app, "master.sof2009.se"                          # This may be the same as your `Web` server
role :db,  "master.sof2009.se", :primary => true # This is where Rails migrations will run

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end