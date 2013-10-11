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

    rhc cartridge add cron-1.4 -a clsi

and push your app.

# TODO
- [x] Support compiler input
- [x] Check tokens at compilation
- [x] Define env variables at startup
- [ ] Support async compilation
- [ ] Support JSON requests

# License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Copyright](http://pacbard.mit-license.org/) © 2013 Emanuele Bardelli - bardellie@gmail.com
