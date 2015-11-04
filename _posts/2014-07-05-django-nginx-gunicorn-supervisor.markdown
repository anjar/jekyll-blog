---
layout: post
title:  "Django with Nginx, Gunicorn and Supervisor"
date:   2014-07-05 20:45:11 +0700
categories: python nginx
tags : [Django, Gunicorn, Supervisor, Web Server]
image : /assets/img/post/nginx-gunicorn.jpg

---
Since i am new in django world, i don't know the best configuration for django with nginx, when i'm searching about i found out django can running in Nginx with Gunicorn and Supervisor, from gunicorn website : "Gunicorn 'Green Unicorn' is a Python WSGI HTTP Server for UNIX. It's a pre-fork worker model ported from Ruby's Unicorn project. The Gunicorn server is broadly compatible with various web frameworks, simply implemented, light on server resources, and fairly speedy."

And here is Supervisor from they're website "Supervisor is a client/server system that allows its users to monitor and control a number of processes on UNIX-like operating systems. It shares some of the same goals of programs like launchd, daemontools, and runit. Unlike some of these programs, it is not meant to be run as a substitute for init as 'process id 1'. Instead it is meant to be used to control processes related to a project or a customer, and is meant to start like any other program at boot time."

Firstly, we need to create some script tu run gunicorn for our project, we can create some directory like "run" or "bin" and create file called "gunicorn" and put this script to that file :

{% highlight bash lineons %}
#!/bin/bash

NAME="anxfeb"                                  # Name of the application
DJANGODIR=/home/anjar/anxfeb            # Django project directory
SOCKFILE=/tmp/socket/anxfeb.sock  # we will communicte using this unix socket
USER=anxfeb                                        # the user to run as
GROUP=anxfeb                                     # the group to run as
NUM_WORKERS=3                                     # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=anxfeb.settings             # which settings file should Django use
DJANGO_WSGI_MODULE=anxfeb.wsgi                     # WSGI module name

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $DJANGODIR
source env/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec env/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --env DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE.development \
  --workers $NUM_WORKERS \
  --user=$USER --group=$GROUP \
  --bind=unix:$SOCKFILE \
  --log-level=debug \
  --log-file=-</code></pre>

{% endhighlight %}

Don't forget to chmod your script to a+x, and then you can test your sript by running bin/gunicorn and see the output. Next, we create configuration file for supervisor, create new file in "/etc/supervisor/conf.d/"", for example anxfeb.conf and put this script:

{% highlight bash lineons %}
[program:anxfeb]
command = /home/anjar/anxfeb/bin/gunicorn
user = vagrant                                                        
stdout_logfile = /home/anjar/anxfeb/logs/gunicorn_supervisor.log   
redirect_stderr = true                                                
environment=LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8
{% endhighlight %}

Save your file and ask supervisor to reread configuration files and update supervisor.

{% highlight bash lineons %}
$ sudo supervisorctl reread
anxfeb: available
$ sudo supervisorctl update
anxfeb: added process group
{% endhighlight %}

You can also check the status of your app or start, stop or restart it using supervisor.

{% highlight bash lineons %}
$ sudo supervisorctl status anxfeb                       
anxfeb                            RUNNING    pid 29386, uptime 0:02:50
$ sudo supervisorctl stop anxfeb  
anxfeb: stopped
$ sudo supervisorctl start anxfeb                        
anxfeb: started
$ sudo supervisorctl restart anxfeb 
anxfeb: stopped
anxfeb: started
{% endhighlight %}

next, we create virtual host for nginx, you can read how to create virtual host in nginx by reading [this post][nginx-vhost] add upstream for your virtualhost and listen for socket that we created before

{% highlight nginx lineons %}
upstream django {
  server unix:tmp/socket/anxfeb.sock fail_timeout=0;
}

server {

    listen   80;
    server_name anxfeb.local;

    client_max_body_size 4G;

    location /static/ {
        alias   /home/anjar/anxfeb/anxfeb/static/;
    }

    location /media/ {
        alias   /home/anjar/anxfeb/anxfeb/media/;
    }

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        if (!-f $request_filename) {
            proxy_pass http://django;
            break;
        }
    }
}

{% endhighlight %}

source :

-[http://michal.karzynski.pl/blog/2013/06/09/django-nginx-gunicorn-virtualenv-supervisor][michal.karzynski.pl]
-[https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/gunicorn/][django-docs]
-[http://gunicorn-docs.readthedocs.org/en/latest/run.htm][gunicorn-docs]
-[https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-centos-7][do-comm]

[jekyll-docs]: http://jekyllrb.com/docs/home
[michal.karzynski.pl]: http://michal.karzynski.pl/blog/2013/06/09/django-nginx-gunicorn-virtualenv-supervisor/
[django-docs]: https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/gunicorn/
[gunicorn-docs]: http://gunicorn-docs.readthedocs.org/en/latest/run.htm
[do-comm]: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-centos-7
