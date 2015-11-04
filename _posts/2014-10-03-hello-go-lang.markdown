---
layout: post
title:  "Hello Go(Lang)"
date:   2014-10-03 10:45:11 +0700
categories: golang
tags : [go, hello world]
image : /assets/img/post/go.jpg

---
Go, also commonly referred to as golang, is a programming language developed at Google in 2007 by Robert Griesemer, Rob Pike, and Ken Thompson, and it was announced to public in November 2009.

The Go programming language is an open source project to make programmers more productive. Go is expressive, concise, clean, and efficient. Its concurrency mechanisms make it easy to write programs that get the most out of multi core and networked machines, while its novel type system enables flexible and modular program construction. Go compiles quickly to machine code yet has the convenience of garbage collection and the power of run-time reflection. It's a fast, statically typed, compiled language that feels like a dynamically typed, interpreted language.

Go can be considered the result of a rather conservative language evolution from languages such as C and C++. Go improves upon some of the misgivings of those languages:

- Poor dependency management
- Cumbersome type systems
- Difficult memory management
- Lack of parallel computation support
- Lack of multi-core support

Go also reduces the amount of code typing needed by being more expressive than C or C++.

Go makes it much easier to write robust, networked applications, without sacrificing much in the way of performance, compared to C or C++. The high performance is in large part due to the static compilation of the statically-typed Go code. A lot of optimizations are possible when a compiler can do all the code inspection work beforehand, as opposed to the dynamic JS compiler work done during runtime.

Here is sample code with GO:

{% highlight go lineons %}
package main

import "fmt"

func main() {
    fmt.Println("Hello, World")
}
{% endhighlight %}
