var nodemailer = require('nodemailer'),
    signer = require('nodemailer-dkim').signer,
    habitat = require("habitat"),
    fs = require("fs");

habitat.load();
var env = new habitat(),
    useremail = env.get("EMAIL"),
    userpwd = env.get("PASS");

function sendEmail(user, event) {
  // create reusable transport method (opens pool of SMTP connections)
  var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: useremail,
          pass: userpwd
      }
  });
  // transporter.use('stream', signer({
  //     domainName: '',
  //     keySelector: 'google',
  //     privateKey: fs.readFileSync('')
  // }));

  var htmlStart = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width"><title>Plottio</title><link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"><link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300" rel="stylesheet" type="text/css"><link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></head><body style="font-family: \"Open Sans\", sans-serif !important;">',
      logoHeader = '<div style="margin-left: 10px;margin-right: 30px; padding: 0;vertical-align: middle;background-color: #1abc9c; height: 120px; text-align:center;">Hello from EventFeed</div>',
      emailHeader = '<div style="margin-left: 30px;margin-right: 30px;"><h2>First Sentence</h2>',
      emailStart = '<p style="font-size: 14px; line-height: 1.6;">You have been invited to and event: '+event.name+'</p>',
      emailBody = '<p style="font-size: 14px; line-height: 1.6;"></p>',
      emailEnd = '<p style="font-size: 14px; line-height: 1.6;"><em></em></p>',
      emailBye = '<p style="font-size: 14px; line-height: 1.6;">Yours truly,</p> <h2>EventFeed Team</h2>',
      emailSocial = '<p style="font-size: 14px;"><button style="padding: 4px; border-style: none; background-color: #4099FF;" type="button" ><a style="color: #fff; text-decoration: none;" href="https://twitter.com">Twitter</a></button><br><button style="margin-top: 2px; padding: 4px; border-style: none; background-color: #3B5998; color: #fff;" type="button"><a style="color: #fff; text-decoration: none;" href="https://www.facebook.com">Facebook</a></button></p></div>',
      emailFooter = '<hr><div style="text-align: center; margin: 0 auto;"><em><p style="font-size:12px;">Sent by <a style="color: #1abc9c;" href="http://eventfeed.me">EventFeed</a> <br> </p></em></div>',
      htmlEnd = '</body></html>';

  //var body = '<p>Here we meet again,<br><br>Plottio Team would like to thank you for the support of this Social Journalism Revolution.<br><br>We know as a fdocument.appendChild(elem);t, that only together we can accomplish something as tremendous and we deeply value your contribution. An early access is just a small gift that will not suffice to express our gratitude. While we are working tirelessly on creating the best experience, please share the word with your social circles to help us achieve this goal.<br><br>P.S. Information on the website will be constantly updated to give you a "behind the scenes" insight on our progress, so feel free to check back anytime soon. Until next time.<br><br>Yours truly,<br><br>Plottio Team</p>'
  var body = htmlStart + logoHeader + emailHeader + emailStart + emailBody + emailEnd + emailBye + emailSocial + emailFooter + htmlEnd;

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "Plottio Team <info@plottio.com>", // sender address
      to: user, // list of receivers
      subject: "Invitation to an event", // Subject line
      headers: {"mailed-by":"eventfeed.me",
                "signed-by":"eventfeed.me"},
      //text: "Hi there! ✔", // plaintext body
      html: body// html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      }else{
          console.log("Message sent");
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });
}

exports.sendEmail = sendEmail;
