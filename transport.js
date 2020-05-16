var nodemailer = require(nodemailer);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'swipebuddies@gmail.com',
    pass: 'swipebuddies6170'
  }
});

module.exports = transporter;
