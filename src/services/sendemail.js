import 'dotenv/config';
import SG from '@sendgrid/mail';
import * as Templates from '../lib/templates/forgotPassword'


export const MailService = (data) => {
    console.log('>>>> ',data)
    SG.setApiKey(process.env.SENDER_API_KEY);
    const msg = {
      to: data.email,
      cc: data.cc || [],
      from: process.env.SENDER, // Use the email address or domain you verified above
      subject: 'Sending with Twilio SendGrid is Fun',
      text: data.resetLink || 'hello',
      html: data.template,
      
    };
    SG
    .send(msg)
    .then(() => {}, error => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
    });
    
  };
  