load 'deploy' if respond_to?(:namespace) # cap2 differentiator

##################################
# Edit these
set :application, "isnodejsuseful"
set :node_file, "useful.js"
set :host, "instaderek.com"
set :repository, "git://github.com/iamruinous/is-node-js-useful.git"
set :branch, "master"
set :deploy_to, "/home/deploy/apps/#{application}"
####################################

set :scm, :git
set :deploy_via, :remote_cache
role :app, host
set :user, "root"
set :use_sudo, true
set :admin_runner, 'deploy'
default_run_options[:pty] = true

namespace :deploy do
  task :start, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo :as => 'root'} start #{application}"
  end

  task :stop, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo :as => 'root'} stop #{application}"
  end

  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo :as => 'root'} restart #{application} || #{try_sudo :as => 'root'} start #{application}"
  end

  task :create_deploy_to_with_sudo, :roles => :app do
    run "#{try_sudo :as => 'root'} mkdir -p #{deploy_to}"
    run "#{try_sudo :as => 'root'} chown #{admin_runner}:#{admin_runner} #{deploy_to}"
  end

  task :write_upstart_script, :roles => :app do
    upstart_script = <<-UPSTART
  description "#{application}"

  start on startup
  stop on shutdown

  script
      # We found $HOME is needed. Without it, we ran into problems
      export HOME="/home/#{admin_runner}"

      cd #{current_path}
      exec sudo -u #{admin_runner} sh -c "/usr/local/bin/node #{current_path}/#{node_file} >> #{shared_path}/log/#{application}.log 2>&1"
  end script
  respawn
UPSTART
  put upstart_script, "/tmp/#{application}_upstart.conf"
    run "#{try_sudo :as => 'root'} mv /tmp/#{application}_upstart.conf /etc/init/#{application}.conf"
  end
end

before 'deploy:setup', 'deploy:create_deploy_to_with_sudo'
after 'deploy:setup', 'deploy:write_upstart_script'
