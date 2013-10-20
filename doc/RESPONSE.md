# Response Format

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

## Status

The status can be either:

* _success_ - The compile ran successfully and an output document was produced.
* _failure_ - For some reason the compile was unable to run or produce any
  output. More information is given in the _error_ attribute explained below.
* _compiling_ - The compile has not yet finished. See _Asynchronous Compiling_
  below.

## Errors

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

## Compile ID

Each request is given a unique ID which is returned as the _compile_id_
attribute. This can be used to later refer to the same compile. This is mainly
useful when compiling asynchronously (see below).

## Output Files and Logs

Any output files and logs which are produced are returned in the _output_files_
and _logs_ attributes respectively. These are collections of items with the
following properites:
* _output_ -  Output file produced by the compiler. The file extension can be specified with the compilation request.
* _log_ -  LaTeX log file. This will be always be returned by the server regardless of the compilation status.
