![HUJI Hackathon](https://github.com/odedva/RegistrationPlatform/blob/master/public/assets/img/mini-logo.png "HUJI Hackathon")

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

### API and general Information
1. Once the platform is up, a new user should be registered via /register. In order to make this user an admin, the field of `isAdmin` should be changed to `true` in the users collection in mongodb. 

 This type of user have access to all APIs even if the registartion is closed and etc. Moreover, this user can view some   administration pages and make updates to users\parameters.

2. Models: Users, Teams, Params. 

 1. Users - general fields, `email` (unique email), `isAdmin` (whether this user has admin permissions), `isMember` (of a team), `team` (id of the team that this user is part of).
 2. Teams - general fields, `admin_email` (team admin email), `members` (team members email array), `isClosed` (whether this team is looking for members).
 3. Params - `name` (parmeter name), `isOpen` (boolean value for uses like user registraion is open. team registration is closed and etc.)
 
3. Administration pages (only available for admin users):
 1. /printusers - this page contains a full list of registered members with most of their information., boolean fields are editable.
 2. /params - this page contains a list of the boolean parmateres which are editable. the default parameters are:
    *  `users` - This parameter contorl the status of new *User* registration. if it's false, user registration is disabled
    *  `team` - This parameter contorl the status of *Team* registration and platform. if it's false, the whole team platform is closed.

### This repository is based on this [hackhands tutorial](https://hackhands.com/how-to-get-started-on-the-mean-stack/) and got deeply improved to fit a Team registration platform

#### Disclaimer - I am not responsible for any issues with this code\platform, in any case.
