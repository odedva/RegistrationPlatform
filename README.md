![HUJI Hackathon](https://github.com/oded-valtzer/RegistrationPlatform/blob/master/public/assets/img/mini-logo.png "HUJI Hackathon")

# Registration Platform - First created for HUJI Hackathon 2016. www.hujihackathon.co.il (currently down)

## User &amp; Teams registration website, nodejs, expressjs, ejs, mongodb, passportjs.

### Main features:
1. User Registration
2. User login
3. Team Registration (configurable amount of users per team)
4. Teams overview (for mix & match)
5. Parameters control over platform status (Open\Closed)
6. RSVP process

### Fast bootstrap:

1.  $ npm install

2. define config/env/development.js with your stuff:

   * mongodb connection string (mongo):```mongodb://<dbuser>:<dbpassword>@<url>:<port>/<dbname>```
  
   * mail address (only gmail) - for sending confirmation email, password reset email and etc (`config.emailAddr`)
  
   * mail password (`config.emailPass`)
  
   * support mail address - for presenting to users for contact the event organizers (`config.supportEmailAddr`)
  
   * event name (`config.eventname`)
  
   * event website link (`config.eventwebsite`)
  
   * event facebook link (`config.eventfacebook`)
  
   * amount of users in each team (`config.maxNumOfUsersInTeam`)

##### Most of these parameters can be (and better be for security issues) automatically configured via environment variables, see env names in the file.
  
##### Currently, there are no verifications of these parameters, so making something wrong might cause issues or fatal errors.

### RUNNING

1. $ node server.js

2. you are good to go!

## Good Luck!

### This repository is based on this [hackhands tutorial](https://hackhands.com/how-to-get-started-on-the-mean-stack/) and got deeply improved to fit a Team registration platform

#### Disclaimer - I am not responsible for any issues with this code\platform, in any case.
