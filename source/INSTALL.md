## Installation
To install, just create a new gear with the following commands:

    rhc app create clsi -t python-2.6
    cd clsi
    git remote add upstream -m master https://github.com/pacbard/clsipy.git
    git pull -s recursive -X theirs upstream master
    git push

## Token
Create the token using this command

    rhc env set CLSI_TOKEN=your_token

Use your token to access the server

### Cron
Cron can be used to clean up the compiled folder once a day. Just add a cron-1.4 folder to your application with the command

    rhc cartridge add cron-1.4 -a clsi

and push your app.
