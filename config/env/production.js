var port = process.env.WEB_PORT || 80;
var host = process.env.IP || '127.0.0.1';
var mongo = process.env.MONGO_URL || '';
var emailAddr = process.env.EMAIL_ADDR || '';
var emailPass = process.env.EMAIL_PASS || '';
var supportEmailAddr = process.env.SUPP_EMAIL_ADDR || '';
var adminEmail = process.env.ADMIN_EMAIL || '';
var eventname = 'HUJI Hackathon';
var eventwebsite = 'http://www.hujihackathon.co.il';
var eventfacebook = 'https://www.facebook.com/HujiHack';
var maxNumOfUsersInTeam = 6; // maximum supported currently is 6, can be only enforce 6 or lower.
module.exports = {
    port: port,
    host: host,
    db: mongo,
    emailAddr: emailAddr,
    emailPass: emailPass,
    supportEmailAddr: supportEmailAddr,
    eventname: eventname,
    eventwebsite: eventwebsite,
    eventfacebook: eventfacebook,
    maxNumOfUsersInTeam: maxNumOfUsersInTeam,
    adminEmail: adminEmail
};