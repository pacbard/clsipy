The Common LaTeX Service Interface
==================================

The Common LaTeX Service Interface (CLSI) is an HTTP API for compiling LaTeX
documents. Requests can be sent in XML.
This is an implementation of a Common Latex Server Interface (CLSI) using an OpenShift Python gear.

# Installation
To install, just create a new gear with the following commands:

    rhc app create clsi -t python-2.6
    cd clsi
    git remote add upstream -m master https://github.com/pacbard/clsipy.git
    git pull -s recursive -X theirs upstream master
    git push

## Optional: Cron
Cron can be used to clean up the compiled folder once a day. Just add a cron-1.4 folder to your application with the command

    rhc cartridge add chron-1.4 -a clsi

and push your app.

# TODO
- [ ] Support compiler input
- [ ] Check tokens at compilation
- [ ] Support JSON requests

Accessing the CLSI
==================

An example XML request looks like

    <?xml version="1.0" encoding="UTF-8"?>
    <compile>
        <token>...</token>
        <options>
            <output-format>pdf</output-format>
            <compiler>latex</compiler>
        </options>
        <resources root-resource-path="main.tex">
            <resource path="main.tex"><!CDATA[
                \documentclass{article}
                \begin{document}
                Hello world! 
                \input{chapter1.tex}
                \end{document}
            ]></resource>
            <resource
                path="chapter1.tex"
                url="http://scribtex.github.com/clsi/examples/chapter1.tex"
                modified="2012-02-14 12:36:54">
            </resource>
        </resources>
    </compile>

These requests should be sent as POST requests to /compile, e.g.

    curl --data-binary @request.xml http://clsi.example.com/compile

Note that XML is assumed to be the default format unless otherwise specified.

Request Format
==============

Token
-----

Every request must include your API access token under the _token_ option. This
can currently only be obtained by an email request to the CLSI owner.

Resources
---------

Every request must contain a list of _resources_ (files to included in the
compilation), containing at least one resource. Resources must have a _path_
attribute, and either a _content_ or an _url_ attribute. For XML requests, the
content should be provided as the contents of <resource> tag rather than as an
attribute. More information about each attribute is given below:

* _path_ - This specifies where the file should be written to on disk before
  performing the compile. Any directories are created automatically so only the
  full file path of each file needs to be supplied.
* _url_ - An URL where the contents of the file can be downloaded from. The
  response from the URL is written verbatim into the file before compilation.
  Content downloaded from URLs is cached for an arbitrary length of time so the
  URL may not be downloaded with every request to the CLSI. The cache can be
  invalidated using the _modified_ property which is explained in more detail
  below.
* _content_ - Alternatively, the file contents may be specified directly. For
  speed, it is generally quicker to provide the file contents from URLs where
  possible as these can be cached on disk for quicker access.
* _modified_ - If providing the file via an URL this specifies when the file was
  last modified. This should be a string formatted like "YYYY-MM-DD hh:mm:ss"
  (TODO: Check if there is an official way to write this). Note that times
  should be provided in UTC as the server records when the data was last fetched
  in UTC (this is currently regarded as a slight bug. Instead the URL should be
  redownloaded if the modified date is ahead of the previously supplied modified
  date). If no modified date is provided, a cached version of the URL will
  always be used where available.

Root Resource Path
------------------

This specifies the main file which LaTeX should be run on. LaTeX will
be called with something like

    latex <root-resource-path>

The root resource path defaults to "main.tex".

Options
-------

The CLSI provides multiple compilers and output formats which can be specified
in the options section.

The request may contain an optional options block:
    
    <options>
        <compiler>latex</compiler>
        <output-format>ps</output-format>
    </options>

where you can specify the compiler to use, and the output format. Possible compilers are:

* <code>pdflatex</code> - possible output formats: pdf
* <code>latex</code> - possible output formats: dvi, ps, pdf
* <code>xelatex</code> - possible output formats: pdf
* <code>lualatex</code> - possible output formats: pdf

If the compiler and/or the output format are not specified as arguments,
the CLSI will use ```pdflatex``` as compiler and ```pdf``` as output format. For this
reason, most user will not need to specify a compiler or output formats.

Response Format
===============

The response follows a similar schema to the request, and is returned in the
same format as the request. An example XML response is:

    <?xml version="1.0" encoding="UTF-8"?>
    <compile>
      <status>success</status>
      <output>
        <file type="pdf" url="http://clsi.example.com/download/042621e09d8b6fdf9ceaa3c223827/test.pdf" mimetype="application/pdf"/>
      </output>
      <logs>
        <file type="log" url="http://clsi.example.com/download/042621e09d8b6fdf9ceaa3c223827/test.log" mimetype="text/plain"/>
      </logs>
    </compile>

Status
------

The status can be either:

* _success_ - The compile ran successfully and an output document was produced.
* _failure_ - For some reason the compile was unable to run or produce any
  output. More information is given in the _error_ attribute explained below.
* _compiling_ - The compile has not yet finished. See _Asynchronous Compiling_
  below.

Errors
------

If there was a problem with the request, or the compile was unable to run for
some reason, the response will contain an error section:

    <?xml version="1.0" encoding="UTF-8"?>
    <compile>
      <status>failure</status>
      <error>
        <type>NoOutputProduced</type>
        <message>no compiled documents were produced</message>
      </error>
      <logs>
        <file type="log" url="http://clsi.example.com/download/4c2100ec6ffe6a6dd82792cb507def84/output.log" mimetype="text/plain"/>
      </logs>
    </compile>

Possible errors are:

* *ParseError* - the XML you sent was bad in some way. The message will contain more information
* *InvalidToken* - The token you supplied was not correct
* *UnknownCompiler* - The compiler you specified is not supported
* *ImpossibleOutputFormat* - The output format you specified is not possible with the compiler you specified
* *InvalidPath* - One of the paths you supplied for the resources is not valid
* *NoOutputProduced* - The compile did not produce any output, most likely due to a problem with your LaTeX syntax. See the returned log for more details
* *Timeout* - Part of the compiler process took too long to do and was aborted. Do you have server destroying infinite loops in your LaTeX?

Compile ID
----------

Each request is given a unique ID which is returned as the _compile_id_
attribute. This can be used to later refer to the same compile. This is mainly
useful when compiling asynchronously (see below).

Output Files and Logs
---------------------

Any output files and logs which are produced are returned in the _output_files_
and _logs_ attributes respectively. These are collections of items with the
following properites:

TODO: Copy paste from Wiki

Asynchronous Compiling
======================

By default the HTTP connection is left open until the compile is
finished and then the response is returned. While the CLSI is comparatively fast,
compiling a LaTeX document can still take a long time and this can leave you
with a connection sitting open for a while. 

The asynchronous options tells the CLSI to return immediately, before the
compilation is finished. A unique ID is provided which allows you to
poll the server to find out of the compile is complete.

Asynchronous compiling is enabled by passing the _asynchronous_ option in the
request:

    <compile>
        <options>
            <asynchronous>true</asynchronous>
            ...
        </options>
        ...
    </compile>

The CLSI will return a response immediately, except there will be no files
listed yet, and the status will be _compiling_. E.g.

    {
        "compile" : {
            "status"      : "compiling",
            "compile_id" : "..."
        }
    }

To check on the progress of a compile you can perform a GET request to 

    http://clsi.scribtex.com/download/<compile-id>/response.xml

depending on the format you would like.

The response will contain a status as above, which will either be _compiling_ if
the compile is still going on, or _success_ or _failure_ if it has finished. Any
output files will be listed when they are available.

We recommend polling at progressively longer intervals, e.g. 0.2s, 0.4s, 0.8s,
1.6s, 3.2s.

# License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Copyright](http://pacbard.mit-license.org/) © 2013 Emanuele Bardelli - bardellie@gmail.com
