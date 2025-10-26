import nodemailer from "nodemailer";
import {WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/template";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
});

export const sendWelcomeEmail = async({email, name, intro}: WelcomeEmailData ) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace("{{name}}", name)
        .replace("{{intro}}", intro)

    const emailOptions = {
        from: `"Signalist <alhakimabusolihin@gmail.com>"`,
        to: email,
        subject: "Selamat datang di signalist - perangkat pasar saham Anda sudah siap!",
        text: "Terima kasih telah bergabung dengan Signalist",
        html: htmlTemplate
    }

    await transporter.sendMail(emailOptions);
}