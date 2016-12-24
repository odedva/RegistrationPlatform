![HUJI Hackathon](https://github.com/odedva/RegistrationPlatform/blob/master/public/assets/img/mini-logo.png "HUJI Hackathon")

# Registration Platform

# First created for HUJI Hackathon 2016

## Users &amp; Teams registration platform, written in nodejs, expressjs, ejs, mongodb, passportjs

### Main features:
1. User Registration
2. User login
3. Team Registration (configurable maximum amount of users per team)
4. Teams overview (for mix & match)
5. Parameters control over platform status (Open\Closed)
6. RSVP process
7. It's Responsive :)

### Platform screen shots can be found below the instructions (so you'll see how easy it is to get up and running!)

### Fast bootstrap:

1.  $ npm install

2. define config/env/development.js with your stuff:

   * Mongodb connection string (mongo):```mongodb://<dbuser>:<dbpassword>@<url>:<port>/<dbname>```
  
   * Mail address (only gmail) - for sending confirmation email, password reset email and etc (`config.emailAddr`)
  
   * Mail password (`config.emailPass`)
  
   * Support mail address - for presenting to users for contact the event organizers (`config.supportEmailAddr`)

   * Admin mail address - registering a user with this emaill address will permit this user to see administration pages (`config.adminEmail`)
  
   * Event name (`config.eventname`)
  
   * Event website link (`config.eventwebsite`)
  
   * Event facebook link (`config.eventfacebook`)
  
   * Maximum amount of users in each team - any number is now supported! (`config.maxNumOfUsersInTeam`)

##### Most of these parameters can be (and better be for security issues) automatically configured via environment variables, see env names in the file.
  
##### Currently, there are no verifications of these parameters, so making something wrong might cause issues or fatal errors.

### RUNNING

1. $ node server.js

2. you are good to go!

## Good Luck!

### Screen Shots (More information about the platform can be found below)
![Login](https://github.com/odedva/RegistrationPlatform/blob/master/public/assets/img/screenshots/login.png "Login Page")
![Register](https://github.com/odedva/RegistrationPlatform/blob/master/public/assets/img/screenshots/register.png "Register Page")
![Main Page](https://github.com/odedva/RegistrationPlatform/blob/master/public/assets/img/screenshots/main.png "Main Page")
![Create Team Page](https://github.com/odedva/RegistrationPlatform/blob/master/public/assets/img/screenshots/create.png "Create Team Page")
![Find A Team](https://github.com/odedva/RegistrationPlatform/blob/master/public/assets/img/screenshots/mingle.png "Find A Team Page")


### General and API Information
1. First things first: This platform was developed during my academic studies, so I didnt had the time to invest in a nice design (UI & code) and hacks do appear - in order to generalize stuff, and because some of this code was written to fast-handle some bugs and issues we had on the way.

2. In order to be an admin, register a user with an email which is set as environment variable ADMIN_EMAIL. this will automatically grant him admin permission to acces admin pages

3. Models: Users, Teams, Params. 

 1. Users - general fields, `email` (unique email), `isMember` (of a team), `team` (id of the team that this user is part of).
 2. Teams - general fields, `admin_email` (team admin email), `members` (team members email array), `isClosed` (whether this team is looking for members).
 3. Params - `name` (parmeter name), `isOpen` (boolean value for uses like user registraion is open. team registration is closed and etc.)
 
3. Administration pages (only available for admin user):
 1. /printusers - this page contains a full list of registered members with most of their information., boolean fields are editable.
 2. /params - this page contains a list of the boolean parameters which are editable. the default parameters are:
    *  `users` - This parameter contorl the status of new *User* registration. if it's false, user registration is disabled
    *  `team` - This parameter contorl the status of *Team* registration and platform. if it's false, the whole team platform is closed.

### This repository is based on this [hackhands tutorial](https://hackhands.com/how-to-get-started-on-the-mean-stack/) and got deeply improved to fit a Team registration platform

#### Disclaimer - I am not responsible for any issues with this code\platform, in any case.
