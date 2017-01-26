---
layout: post
title:  "Remove All Docker Container and Images"
date:   2017-01-26 13:45:11 +0700
categories: docker
tags : [Docker, Images, Container]

---
After build and rebuild Docker it will created lots of images and containers. In case you want remove all of them to save your disk space, here the solution that if find when googling.

Warning: This command will destroy all your images and containers. It will not be possible to restore them! DIWYOR

Execute those commands in a shell:

# Delete all containers
{% highlight bash lineons %}
docker rm $(docker ps -a -q)
{% endhighlight %}
# Delete all images
{% highlight bash lineons %}
docker rmi $(docker images -q)
{% endhighlight %}

This solution has be proposed by GitHub user [@crosbymichael][crosbymichael] in this [issue][github-issue]

[crosbymichael]: https://github.com/crosbymichael
[github-issue]:https://github.com/dotcloud/docker/issues/928#issuecomment-23538307
