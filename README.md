# ALEXA and engagement management for people with cognitive impairment
[cover](/doc/images/cover-alexa-people.png)
The project consists of creating an interface designed to offer a support service to people with cognitive impairment through the use of the Amazon Alexa voice assistant, thus allowing such people to maintain their independence.

The interface has been structured reflecting the organizational structure of different services, with an Admin user able to create new Standard users by entering all the necessary data (name, surname, email, and password), while Standard users represent the main users of the service, as they can register several patients to offer support by entering their name, surname and the id of the Alexa device (in the context, therefore, a Standard user can be a private customer or an organization that manages multiple patients).

Once a patient has been selected, it will then be possible to set a reminder, saved with a message, the type of reminder, and the frequency with which it must be delivered to the patient using the Alexa 'NotifyMe' function, which signals the patient via a sound and light on the device. that a reminder has arrived.

With a simple sentence like "Alexa do you have a notification?" then the device will continue to read all the reminders received, placing them in a way that makes them more user friendly depending on the type of reminder (for example, a reminder marked as 'Activity' will be placed as "What about ...?", or a 'Reminder' will be placed as "Don't forget to ...") and thus ensuring that the reminders are actually delivered to the patient.

## Technologies Used

### Backend
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com)
- [Express.Js](https://expressjs.com)
- [Cron](https://www.npmjs.com/package/cron)
- [Helmet.js](https://helmetjs.github.io)
- [Express Validator](https://express-validator.github.io)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Json Web Token](https://www.npmjs.com/package/jsonwebtoken)

### FrontEnd
[Handlebars.js](https://handlebarsjs.com)
[jQuery](https://jquery.com)
[Bootstrap](https://getbootstrap.com)
[Font Awesome](https://fontawesome.com)

### Amazon Alexa
[Proactive Events API](https://developer.amazon.com/en-US/docs/alexa/smapi/proactive-events-api.html)
[NotifyMe API](https://www.amazon.com/Thomptronics-Notify-Me/dp/B07BB2FYFS)

### Tools
[MySQL Workbench](https://www.mysql.com/it/products/workbench/)
[IntelliJ IDEA](https://www.jetbrains.com/idea/)
[PostMan](https://www.postman.com/company/about-postman/)

