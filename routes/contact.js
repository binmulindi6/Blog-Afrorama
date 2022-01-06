const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path')
const nodemailer = require('nodemailer')
const alert = require('alert')

//some variables
const message = []
let fname,lname,email,theMessage;

// body parser middleware
router.use(express.json());
router.use(express.urlencoded( { extended: false } ));

// custom middleware to log data access
const log = function (request, response, next) {
	console.log(`${new Date()}: ${request.protocol}://${request.get('host')}${request.originalUrl}`);
	//console.log(request.body); // make sure JSON middleware is loaded before this line
	next();
}
router.use(log);

//get contact-us page

router.get('/contact-us', (req, res, next) => {
    res.render('contact',{title: "Contact-Us"})
})

router.get('/contact', (req, res, next) => {
    res.redirect('/contact-us')
})

router.post('/contact/message', (req, res, next) => {
    //get req body
    fname = req.body.fname
    lname = req.body.lname
    email = req.body.email
    theMessage = req.body.message

    let messageBody = {
        firstname: fname,
        lastname: lname,
        email: email,
        message: theMessage
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'laurel.lueilwitz51@ethereal.email',
            pass: 'VRSx3bgfvDruegzRsQ'
        }
    });

    var textBody = `FROM: ${messageBody.firstname} EMAIL: ${messageBody.email} MESSAGE: ${messageBody.message}`;
	var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${messageBody.firstname + " " + messageBody.lastname} <a href="mailto:${messageBody.email}">${messageBody.email}</a></p><p>${messageBody.message}</p>`;
	var mail = {
		from: messageBody.email, // sender address
		to: "ulbuclubinfo@gmail.com", // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
		subject: "Mail From Afrorama-Blog Contact-Us Form", // Subject line
		text: textBody,
		html: htmlBody
	};

    //console.log(mail)

    // send mail with defined transport object
	transporter.sendMail(mail, (err, info) => {
		if(err) {
			console.log(err);
			res.redirect('/contact');
		}
		else {
			console.log({ message: `message sent: ${info.messageId}` });
            alert("Your Message Has Been sent to us, Thank You!!")
            res.redirect('/');
		}
        });

        
});

module.exports = router;