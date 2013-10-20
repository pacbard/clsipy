## Request Format

### Token

Every request must include your API access token under the _token_ option. This
can currently only be obtained by an email request to the CLSI owner.

### Resources

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

### Root Resource Path

This specifies the main file which LaTeX should be run on. LaTeX will
be called with something like

    latex <root-resource-path>

The root resource path defaults to "main.tex".

### Options

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
