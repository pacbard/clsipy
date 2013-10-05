import base64
from subprocess import call
from os.path import abspath, dirname, join
import sys, os
import uuid
import shutil

# missing module fix
sys.path.append(os.path.join(os.environ['OPENSHIFT_REPO_DIR'], 'wsgi'))
virtenv = os.environ['APPDIR']+'/virtenv'
os.environ['PYTHON_EGG_CACHE'] = os.path.join(virtenv, 'lib/python2.6/site-packages')
virtualenv = os.path.join(virtenv, 'bin/activate_this.py')
try:
    execfile(virtualenv, dict(__file__=virtualenv))
except:
    pass

import untangle

# openshift env variables
# TODO: Move these settings to env variable
TMP = os.environ['OPENSHIFT_TMP_DIR']
PUBLIC = os.environ['OPENSHIFT_REPO_DIR']+'wsgi/static/download/'
DATA = os.environ['OPENSHIFT_DATA_DIR']
BIN = DATA+"texlive/bin/x86_64-linux/"

class clsi:
    def __init__(self):
        self.id = str(uuid.uuid4())
        self.tmp = TMP + self.id + "/"
        self.public = PUBLIC + self.id + "/"
        self.token = None
        self.format = "pdf"
        self.compiler = "pdflatex"
        
    def parse(self, data):
        req = untangle.parse(data)
        if req.compile.token:
            self.token = req.compile.token.cdata
        if req.compile.options.output_format:
            self.format = req.compile.options.output_format.cdata
        if req.compile.options.compiler:
            self.compiler = req.compile.options.compiler.cdata
        root = req.compile.resources['root-resource-path']
        to_compile = self.tmp + root
        # Writes the files to disk
        for file in req.compile.resources.resource:
            if not os.path.exists(self.tmp):
                os.makedirs(self.tmp)
            f = open(self.tmp+file['path'], 'w')
            if file['encoding'] == 'base64':
                f.write(base64.b64decode(file.cdata))
            elif file['encoding'] == 'utf-8':
		data = file.cdata
                f.write(data.encode('utf-8'))
            else:
                print 'Error in file encoding'
        return(to_compile)

    def run(self, file):
        dir = os.path.dirname(file)+"/"


        # Change PATH and run latexmk
        # Adjust compiler option to latexmk
        if self.compiler == "pdflatex":
            call("PATH=${PATH}:"+ BIN +" && latexmk -"+ self.format +" -outdir="+ dir +" "+ file, shell=True)
        elif self.compiler == "latex":
            call("PATH=${PATH}:"+ BIN +" && latexmk -"+ self.format +" -outdir="+ dir +" "+ file, shell=True)
        else:
            call("PATH=${PATH}:"+ BIN +" && latexmk -"+ self.compiler +" -"+ self.format +" -outdir="+ dir +" "+ file, shell=True)

        log, out = self._move_results(file)
        self._rm_tmp()
        return [log, out]


    def _move_results(self, file):
        dir = os.path.dirname(file)+'/'
        base = os.path.basename(file)
        name = os.path.splitext(base)[0]
        out = dir+name+'.'+self.format
        log = dir+name+'.log'
        if not os.path.exists(self.public):
            os.makedirs(self.public)
        
        if os.path.exists(out):
            shutil.move(out, self.public + name + '.' + self.format)
        if os.path.exists(log):
            shutil.move(log, self.public + name +'.log')
            
        if os.path.exists(self.public + name + '.' + self.format):
            return([self.id+'/'+name+'.log', self.id+'/'+name+'.'+self.format])
        else:
            return([self.id+'/'+name+'.log', None])
    
    def _rm_tmp(self):
        if os.path.isdir(self.tmp):
            shutil.rmtree(self.tmp)
        
