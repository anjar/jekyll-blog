---
layout: post
title:  "Upgrade All Python PIP Packages"
date:   2014-05-02 16:45:11 +0700
categories: python
tags : [Django, PIP, Upgrade]

---
When you have many python package in your project, its obviously lazy to when trying to update all package one by one, so i need to find a way going to update all package using pip, but unfortunately when i check PIP github issue, theres is an open and ongoing feature request for PIP is to add an upgrade-all command to PIP. and then i&#39;m googling to search how to update all package using pip. Thanks Stackoverflow and google, i found the solution how to update all package using pip, heres the solution i used

{% highlight bash lineons %}
pip freeze --local | grep -v '^\-e' | cut -d = -f 1  | xargs pip install -U
{% endhighlight %}

So next time you want to upgrade all your python package using pip, you can use this script&nbsp;

source :

-http://stackoverflow.com/questions/2720014/upgrading-all-packages-with-pip
-http://mikegrouchy.com/blog/2014/06/pro-tip-pip-upgrade-all-python-packages.html
