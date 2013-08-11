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

# dotCloud env varialbes
#TMP = '/home/dotcloud/tmp/'
#PUBLIC = '/home/dotcloud/current/static/download/'

# openshift env variables
TMP = os.environ['OPENSHIFT_TMP_DIR']
PUBLIC = os.environ['OPENSHIFT_REPO_DIR']+'wsgi/static/download/'
BIN = os.environ['OPENSHIFT_DATA_DIR']

class clsi:
    def __init__(self):
        self.id = str(uuid.uuid4())
        self.tmp = TMP + self.id + "/"
        self.public = PUBLIC + self.id + "/"

    def whichLatex(self):
        return "pdflatex", ""
        # dotcloud
        return "rubber", "-d"
        
    def parse(self, data):
        req = untangle.parse(data)
        token = req.compile.token
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
        base = os.path.basename(file)
        name = os.path.splitext(base)[0]

        latex, args = whichLatex()
        command = [latex, args, file]
        try:
                cwd = os.getcwd()
        except OSError:
                os.chdir("..")
                cwd = os.getcwd()
        os.chdir(self.tmp) # Changes the current directory to self.tmp. Currently, latexmk.py does not support --output-dir
        call(command)
        log, pdf = self._move_results(file)
        self._rm_tmp()
        os.chdir(cwd) # Returns to the current working directory
        return [log, pdf]


    def _move_results(self, file):
        dir = os.path.dirname(file)+'/'
        base = os.path.basename(file)
        name = os.path.splitext(base)[0]
        pdf = dir+name+'.pdf'
        log = dir+name+'.log'
        if not os.path.exists(self.public):
            os.makedirs(self.public)
        
        if os.path.exists(pdf):
            shutil.move(pdf, self.public + name +'.pdf')
        if os.path.exists(log):
            shutil.move(log, self.public + name +'.log')
            
        if os.path.exists(self.public + name +'.pdf'):
            return([self.id+'/'+name+'.log', self.id+'/'+name+'.pdf'])
        else:
            return([self.id+'/'+name+'.log', None])
    
    def _rm_tmp(self):
        if os.path.isdir(self.tmp):
            shutil.rmtree(self.tmp)
        
