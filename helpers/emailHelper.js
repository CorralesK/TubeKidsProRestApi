const nodemailer = require('nodemailer');

const sendEmail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Confirma la dirección de correo electrónico de ${user.name}`,
            text: `Hola, ${user.name} ${user.lastName}:\n\n` +
                `Para confirmar tu dirección de correo electrónico, haz clic en el siguiente enlace:\n\n` +
                `http://127.0.0.1:5500/html/auth/login.html?key=${user._id}\n\n` +
                `Haz clic en este enlace para volver a la página de TubeKids.\n\n` +
                `El equipo de TubeKids`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

    } catch (error) {
        console.error('Error while sending email:', error);
        throw new Error('Error sending email');
    }
};

module.exports = sendEmail;
