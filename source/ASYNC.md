# Asynchronous Compiling

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

    http://clsi.example.com/download/<compile-id>/response.xml

depending on the format you would like.

The response will contain a status as above, which will either be _compiling_ if
the compile is still going on, or _success_ or _failure_ if it has finished. Any
output files will be listed when they are available.

We recommend polling at progressively longer intervals, e.g. 0.2s, 0.4s, 0.8s,
1.6s, 3.2s.
