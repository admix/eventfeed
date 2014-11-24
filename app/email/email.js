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
  console.log("Registering for: " + JSON.stringify(event));
  // transporter.use('stream', signer({
  //     domainName: '',
  //     keySelector: 'google',
  //     privateKey: fs.readFileSync('')
  // }));

  // var htmlStart = '<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width"><title>Eventfeed</title><link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"><link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300" rel="stylesheet" type="text/css"><link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></head><body style="font-family: \"Open Sans\", sans-serif !important;">',
  //     logoHeader = '<div style="margin-left: 10px;margin-right: 30px; padding: 0;vertical-align: middle;background-color: #1abc9c; height: 120px; text-align:center;">Hello from EventFeed</div>',
  //     emailHeader = '<div style="margin-left: 30px;margin-right: 30px;"><h2>First Sentence</h2>',
  //     emailStart = '<p style="font-size: 14px; line-height: 1.6;">You have been invited!!!<br>Event: <span style="font-size: 19px; line-height: 1.6;">'+ event.name +' <br>by: '+event.createdByUsername+'<br>Private?: '+event.private+'<br>desciption: '+event.description+'<br>location: '+event.location.address+'<br>date: '+event.date+'</span></p>',
  //     emailBody = '<p style="font-size: 14px; line-height: 1.6;"></p>',
  //     emailEnd = '<p style="font-size: 14px; line-height: 1.6;"><em></em></p>',
  //     emailBye = '<p style="font-size: 14px; line-height: 1.6;">Yours truly,</p> <h2>EventFeed Team</h2>',
  //     emailSocial = '<p style="font-size: 14px;"><button style="padding: 4px; border-style: none; background-color: #4099FF;" type="button" ><a style="color: #fff; text-decoration: none;" href="https://twitter.com">Twitter</a></button><br><button style="margin-top: 2px; padding: 4px; border-style: none; background-color: #3B5998; color: #fff;" type="button"><a style="color: #fff; text-decoration: none;" href="https://www.facebook.com">Facebook</a></button></p></div>',
  //     emailFooter = '<hr><div style="text-align: center; margin: 0 auto;"><em><p style="font-size:12px;">Sent by <a style="color: #1abc9c;" href="http://eventfeed.me">EventFeed</a> <br> </p></em></div>',
  //     htmlEnd = '</body></html>'; https://s3-us-west-2.amazonaws.com/eventfeed/email/1416334620536-UQSEIAVZ.jpg
  //
  // var body = htmlStart + logoHeader + emailHeader + emailStart + emailBody + emailEnd + emailBye + emailSocial + emailFooter + htmlEnd;
  var body = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <title>My email message created with BeeFree</title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="format-detection" content="telephone=no"> <style type="text/css"> /* RESET */ #outlook a{padding:0;}body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; mso-line-height-rule:exactly;}table td{border-collapse: collapse;}.ExternalClass{width:100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}table td{border-collapse: collapse;}/* IMG */ img{outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}a img{border:none;}/* Becoming responsive */ @media only screen and (max-device-width: 480px){table[id="container_div"]{max-width: 480px !important;}table[id="container_table"], table[class="image_container"], table[class="image-group-contenitor"]{width: 100% !important; min-width: 320px !important;}table[class="image-group-contenitor"] td, table[class="mixed"] td, td[class="mix_image"], td[class="mix_text"], td[class="table-separator"], td[class="section_block"]{display: block !important;width:100% !important;}table[class="image_container"] img, td[class="mix_image"] img, table[class="image-group-contenitor"] img{width: 100% !important;}table[class="image_container"] img[class="natural-width"], td[class="mix_image"] img[class="natural-width"], table[class="image-group-contenitor"] img[class="natural-width"]{width: auto !important;}a[class="button-link justify"]{display: block !important;width:auto !important;}td[class="table-separator"] br{display: none;}td[class="cloned_td"] table[class="image_container"]{width: 100% !important; min-width: 0 !important;}}table[class="social_wrapp"]{width: auto;}</style> </head> <body bgcolor="#d5e4ed"> <table id="container_div" style="text-align:center; background-color:#d5e4ed; border-collapse: collapse" align="center" bgcolor="#d5e4ed" width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td align="center"> <br><table id="container_wrapper" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table id="container_table" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-collapse: collapse; min-width: 600px;" width="600"> <tbody> <tr> <td valign="top" bgcolor="#ffffff"> <table cellpadding="10" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; background-color: rgb(255, 255, 255);" bgcolor="#ffffff"> <tbody> <tr valign="top"> <td valign="top" style="line-height: 130%; color: rgb(0, 0, 0);"><span style="font-size: 14px; font-family: Arial, Helvetica, sans-serif; color: rgb(102, 102, 102); line-height: 130%;">Congratulations!!! You have just registered for an event! <strong>'+event.name+'</strong></span></td></tr></tbody> </table> <table class="image_container" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; background-color: rgb(255, 255, 255);" bgcolor="#ffffff"> <tbody> <tr valign="top"> <td valign="top" align="center"><a href="" target="_blank"><img data-embeded="auto" src="https://s3-us-west-2.amazonaws.com/eventfeed/email/1416334620536-UQSEIAVZ.jpg" alt="Text shown when image is not displayed" style="height: auto; vertical-align: top; width: 600px;" width="600"></a></td></tr></tbody> </table> <table cellpadding="20" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; background-color: rgb(47, 170, 222);" bgcolor="#2faade"> <tbody> <tr valign="top"> <td valign="top" style="line-height: 200%; color: rgb(0, 0, 0);"> <div style="color: rgb(255, 255, 255); text-align: justify;"><u><strong>Event name:&nbsp;</strong> '+event.name+'</u><br><strong><u>Host:&nbsp;</strong>' +event.createdByUsername+ '</u><br><u><strong>Description:&nbsp;</strong>'+event.description+'</u><br><u><strong>Location:&nbsp;</strong>'+event.location.address+'</u><br><u><strong>Date:&nbsp;</strong>'+event.date+'</u><br><u><strong>Time:&nbsp;</strong>19:30</u></div><div style="color: rgb(255, 255, 255); text-align: center;">Go to <a target="_blank" href="http://eventfeed.com:8080" style="text-decoration:none;">EventFeed</a> and check some other events!</div></td></tr></tbody> </table> </td></tr><tr> <td valign="top" bgcolor="#ffffff"> <table cellpadding="20" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; background-color: rgb(229, 229, 229);" bgcolor="#e5e5e5"> <tbody> <tr valign="top"> <td valign="top" style="line-height: 130%; color: rgb(0, 0, 0);"> <div style="color: rgb(102, 102, 102); text-align: center;"><font face="arial, helvetica, sans-serif"><span style="font-size: 14px; line-height: 130%;"><a target="_blank" href="http://twitter.com" style="text-decoration:none;">Twitter</a> | <a target="_blank" href="http://facebook.com" style="text-decoration:none;">Facebook</a> | <a target="_blank" href="http://linkedin.com" style="text-decoration:none;">LinkedIn</a></span></font></div></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <br></td></tr></table> </body></html>';
  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: "EventFeed team<eventfeedme@gmail.com>", // sender address
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
          return "error";
      }else{
          console.log("Message sent");
          return "sent";
      }

      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });
}

exports.sendEmail = sendEmail;
