rails_env = ENV['RAILS_ENV'] || production

listen 8090 # by default Unicorn listens on port 8080
worker_processes 2 # this should be >= nr_cpus

if rails_env == 'production'
  user 'linweb'
  pid "/var/www/linticket.sof2009.se/shared/pids/unicorn.pid"
  stderr_path "/var/www/linticket.sof2009.se/current/log/unicorn.log"
  stdout_path "/var/www/linticket.sof2009.se/current/log/unicorn.log"
  working_directory "/var/www/linticket.sof2009.se/current"
end


before_fork do |server, worker|
  # the following is highly recomended for Rails + "preload_app true"
  # as there's no need for the master process to hold a connection
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!

  old_pid = 'tmp/pids/unicorn.pid.oldbin'
  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      # someone else did our job for us
    end
  end

end

after_fork do |server, worker|
  # per-process listener ports for debugging/admin/migrations
  # addr = "127.0.0.1:#{9293 + worker.nr}"
  # server.listen(addr, :tries => -1, :delay => 5, :tcp_nopush => true)

  # the following is *required* for Rails + "preload_app true",
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection

  # if preload_app is true, then you may also want to check and
  # restart any other shared sockets/descriptors such as Memcached,
  # and Redis.  TokyoCabinet file handles are safe to reuse
  # between any number of forked children (assuming your kernel
  # correctly implements pread()/pwrite() system calls)
end
