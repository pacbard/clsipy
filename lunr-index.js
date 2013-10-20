
var index = lunr(function () {
    this.field('body');
    this.ref('url');
});

var documentTitles = {};



documentTitles["index.html#common-latex-service-interface"] = "Common LaTeX Service Interface";
index.add({
    url: "index.html#common-latex-service-interface",
    title: "Common LaTeX Service Interface",
    body: "# Common LaTeX Service Interface The Common LaTeX Service Interface (CLSI) is an HTTP RESTful API for compiling LaTeX documents online.  "
});

documentTitles["index.html#how-to-get-access"] = "How to get access";
index.add({
    url: "index.html#how-to-get-access",
    title: "How to get access",
    body: "## How to get access To access the CLSI server you will need a developer token. To request a token, please email the server maintainer.   "
});

documentTitles["index.html#how-to-report-a-missing-package"] = "How to report a missing package";
index.add({
    url: "index.html#how-to-report-a-missing-package",
    title: "How to report a missing package",
    body: "## How to report a missing package If the CLSI maintainer decided to run a striped-down version of LaTeX, it is possible that some packages are not installed by default. Please contact the CSLI maintainer for more information regarding missing packages. "
});

documentTitles["index.html#client"] = "Client";
index.add({
    url: "index.html#client",
    title: "Client",
    body: "## Client If you are looking for a client to access this CLSI server, check out the [Remote LaTeX](http://github.com/pacbard/RLatex) client. "
});



documentTitles["access.html#accessing-the-clsi"] = "Accessing the CLSI";
index.add({
    url: "access.html#accessing-the-clsi",
    title: "Accessing the CLSI",
    body: "# Accessing the CLSI  An example XML request looks like      &lt;?xml version=\&quot;1.0\&quot; encoding=\&quot;UTF-8\&quot;?&gt;     &lt;compile&gt;         &lt;token&gt;...&lt;/token&gt;         &lt;options&gt;             &lt;output-format&gt;pdf&lt;/output-format&gt;             &lt;compiler&gt;latex&lt;/compiler&gt;         &lt;/options&gt;         &lt;resources root-resource-path=\&quot;main.tex\&quot;&gt;             &lt;resource path=\&quot;main.tex\&quot;&gt;&lt;!CDATA[                 \documentclass{article}                 \begin{document}                 Hello world!                  \input{chapter1.tex}                 \end{document}             ]&gt;&lt;/resource&gt;             &lt;resource                 path=\&quot;chapter1.tex\&quot;                 url=\&quot;http://scribtex.github.com/clsi/examples/chapter1.tex\&quot;                 modified=\&quot;2012-02-14 12:36:54\&quot;&gt;             &lt;/resource&gt;         &lt;/resources&gt;     &lt;/compile&gt;  These requests should be sent as POST requests to /compile, e.g.      curl --data-binary @request.xml http://clsi.example.com/compile  Note that XML is assumed to be the default format unless otherwise specified. "
});



documentTitles["request.html#request-format"] = "Request Format";
index.add({
    url: "request.html#request-format",
    title: "Request Format",
    body: "# Request Format  "
});

documentTitles["request.html#token"] = "Token";
index.add({
    url: "request.html#token",
    title: "Token",
    body: "## Token  Every request must include your API access token under the _token_ option. This can currently only be obtained by an email request to the CLSI owner.  "
});

documentTitles["request.html#resources"] = "Resources";
index.add({
    url: "request.html#resources",
    title: "Resources",
    body: "## Resources  Every request must contain a list of _resources_ (files to included in the compilation), containing at least one resource. Resources must have a _path_ attribute, and either a _content_ or an _url_ attribute. For XML requests, the content should be provided as the contents of &lt;resource&gt; tag rather than as an attribute. More information about each attribute is given below:  * _path_ - This specifies where the file should be written to on disk before   performing the compile. Any directories are created automatically so only the   full file path of each file needs to be supplied. * _url_ - An URL where the contents of the file can be downloaded from. The   response from the URL is written verbatim into the file before compilation.   Content downloaded from URLs is cached for an arbitrary length of time so the   URL may not be downloaded with every request to the CLSI. The cache can be   invalidated using the _modified_ property which is explained in more detail   below. * _content_ - Alternatively, the file contents may be specified directly. For   speed, it is generally quicker to provide the file contents from URLs where   possible as these can be cached on disk for quicker access. * _modified_ - If providing the file via an URL this specifies when the file was   last modified. This should be a string formatted like \&quot;YYYY-MM-DD hh:mm:ss\&quot;   (TODO: Check if there is an official way to write this). Note that times   should be provided in UTC as the server records when the data was last fetched   in UTC (this is currently regarded as a slight bug. Instead the URL should be   redownloaded if the modified date is ahead of the previously supplied modified   date). If no modified date is provided, a cached version of the URL will   always be used where available.  "
});

documentTitles["request.html#root-resource-path"] = "Root Resource Path";
index.add({
    url: "request.html#root-resource-path",
    title: "Root Resource Path",
    body: "## Root Resource Path  This specifies the main file which LaTeX should be run on. LaTeX will be called with something like      latex &lt;root-resource-path&gt;  The root resource path defaults to \&quot;main.tex\&quot;.  "
});

documentTitles["request.html#options"] = "Options";
index.add({
    url: "request.html#options",
    title: "Options",
    body: "## Options  The CLSI provides multiple compilers and output formats which can be specified in the options section.  The request may contain an optional options block:          &lt;options&gt;         &lt;compiler&gt;latex&lt;/compiler&gt;         &lt;output-format&gt;ps&lt;/output-format&gt;     &lt;/options&gt;  where you can specify the compiler to use, and the output format. Possible compilers are:  * &lt;code&gt;pdflatex&lt;/code&gt; - possible output formats: pdf * &lt;code&gt;latex&lt;/code&gt; - possible output formats: dvi, ps, pdf * &lt;code&gt;xelatex&lt;/code&gt; - possible output formats: pdf * &lt;code&gt;lualatex&lt;/code&gt; - possible output formats: pdf  If the compiler and/or the output format are not specified as arguments, the CLSI will use ```pdflatex``` as compiler and ```pdf``` as output format. For this reason, most user will not need to specify a compiler or output formats. "
});



documentTitles["response.html#response-format"] = "Response Format";
index.add({
    url: "response.html#response-format",
    title: "Response Format",
    body: "# Response Format  The response follows a similar schema to the request, and is returned in the same format as the request. An example XML response is:      &lt;?xml version=\&quot;1.0\&quot; encoding=\&quot;UTF-8\&quot;?&gt;     &lt;compile&gt;       &lt;status&gt;success&lt;/status&gt;       &lt;output&gt;         &lt;file type=\&quot;pdf\&quot; url=\&quot;http://clsi.example.com/download/042621e09d8b6fdf9ceaa3c223827/test.pdf\&quot; mimetype=\&quot;application/pdf\&quot;/&gt;       &lt;/output&gt;       &lt;logs&gt;         &lt;file type=\&quot;log\&quot; url=\&quot;http://clsi.example.com/download/042621e09d8b6fdf9ceaa3c223827/test.log\&quot; mimetype=\&quot;text/plain\&quot;/&gt;       &lt;/logs&gt;     &lt;/compile&gt;  "
});

documentTitles["response.html#status"] = "Status";
index.add({
    url: "response.html#status",
    title: "Status",
    body: "## Status  The status can be either:  * _success_ - The compile ran successfully and an output document was produced. * _failure_ - For some reason the compile was unable to run or produce any   output. More information is given in the _error_ attribute explained below. * _compiling_ - The compile has not yet finished. See _Asynchronous Compiling_   below.  "
});

documentTitles["response.html#errors"] = "Errors";
index.add({
    url: "response.html#errors",
    title: "Errors",
    body: "## Errors  If there was a problem with the request, or the compile was unable to run for some reason, the response will contain an error section:      &lt;?xml version=\&quot;1.0\&quot; encoding=\&quot;UTF-8\&quot;?&gt;     &lt;compile&gt;       &lt;status&gt;failure&lt;/status&gt;       &lt;error&gt;         &lt;type&gt;NoOutputProduced&lt;/type&gt;         &lt;message&gt;no compiled documents were produced&lt;/message&gt;       &lt;/error&gt;       &lt;logs&gt;         &lt;file type=\&quot;log\&quot; url=\&quot;http://clsi.example.com/download/4c2100ec6ffe6a6dd82792cb507def84/output.log\&quot; mimetype=\&quot;text/plain\&quot;/&gt;       &lt;/logs&gt;     &lt;/compile&gt;  Possible errors are:  * *ParseError* - the XML you sent was bad in some way. The message will contain more information * *InvalidToken* - The token you supplied was not correct * *UnknownCompiler* - The compiler you specified is not supported * *ImpossibleOutputFormat* - The output format you specified is not possible with the compiler you specified * *InvalidPath* - One of the paths you supplied for the resources is not valid * *NoOutputProduced* - The compile did not produce any output, most likely due to a problem with your LaTeX syntax. See the returned log for more details * *Timeout* - Part of the compiler process took too long to do and was aborted. Do you have server destroying infinite loops in your LaTeX?  "
});

documentTitles["response.html#compile-id"] = "Compile ID";
index.add({
    url: "response.html#compile-id",
    title: "Compile ID",
    body: "## Compile ID  Each request is given a unique ID which is returned as the _compile_id_ attribute. This can be used to later refer to the same compile. This is mainly useful when compiling asynchronously (see below).  "
});

documentTitles["response.html#output-files-and-logs"] = "Output Files and Logs";
index.add({
    url: "response.html#output-files-and-logs",
    title: "Output Files and Logs",
    body: "## Output Files and Logs  Any output files and logs which are produced are returned in the _output_files_ and _logs_ attributes respectively. These are collections of items with the following properites:  * _output_ -  Output file produced by the compiler. The file extension can be specified with the compilation request. * _log_ -  LaTeX log file. This will be always be returned by the server regardless of the compilation status. "
});



documentTitles["async.html#asynchronous-compiling"] = "Asynchronous Compiling";
index.add({
    url: "async.html#asynchronous-compiling",
    title: "Asynchronous Compiling",
    body: "# Asynchronous Compiling  By default the HTTP connection is left open until the compile is finished and then the response is returned. While the CLSI is comparatively fast, compiling a LaTeX document can still take a long time and this can leave you with a connection sitting open for a while.   The asynchronous options tells the CLSI to return immediately, before the compilation is finished. A unique ID is provided which allows you to poll the server to find out of the compile is complete.  Asynchronous compiling is enabled by passing the _asynchronous_ option in the request:      &lt;compile&gt;         &lt;options&gt;             &lt;asynchronous&gt;true&lt;/asynchronous&gt;             ...         &lt;/options&gt;         ...     &lt;/compile&gt;  The CLSI will return a response immediately, except there will be no files listed yet, and the status will be _compiling_. E.g.      {         \&quot;compile\&quot; : {             \&quot;status\&quot;      : \&quot;compiling\&quot;,             \&quot;compile_id\&quot; : \&quot;...\&quot;         }     }  To check on the progress of a compile you can perform a GET request to       http://clsi.example.com/download/&lt;compile-id&gt;/response.xml  depending on the format you would like.  The response will contain a status as above, which will either be _compiling_ if the compile is still going on, or _success_ or _failure_ if it has finished. Any output files will be listed when they are available.  We recommend polling at progressively longer intervals, e.g. 0.2s, 0.4s, 0.8s, 1.6s, 3.2s. "
});



documentTitles["install.html#installation"] = "Installation";
index.add({
    url: "install.html#installation",
    title: "Installation",
    body: "# Installation To install, just create a new gear with the following commands:      rhc app create clsi -t python-2.6     cd clsi     git remote add upstream -m master https://github.com/pacbard/clsipy.git     git pull -s recursive -X theirs upstream master     git push  "
});

documentTitles["install.html#cron"] = "Cron";
index.add({
    url: "install.html#cron",
    title: "Cron",
    body: "## Cron Cron can be used to clean up the compiled folder once a day. Just add a cron-1.4 folder to your application with the command      rhc cartridge add cron-1.4 -a clsi  and push your app. "
});



documentTitles["license.html#license"] = "License";
index.add({
    url: "license.html#license",
    title: "License",
    body: "# License  The MIT License (MIT)  Copyright (c) 2013 Emanuele Bardelli &lt;bardellie@gmail.com&gt;  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \&quot;Software\&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.  THE SOFTWARE IS PROVIDED \&quot;AS IS\&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. "
});


