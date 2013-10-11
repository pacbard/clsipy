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
