import nodemailer, { SentMessageInfo } from "nodemailer";
import {
    NODE_MAILER_ALIAS,
    NODE_MAILER_PASSWORD,
    NODE_MAILER_CONFIG_HOST,
    NODE_MAILER_CONFIG_PORT
} from "../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

export const mailTransporter = nodemailer.createTransport({
    host: NODE_MAILER_CONFIG_HOST,
    port: NODE_MAILER_CONFIG_PORT,
    secure: true,
    auth: {
        user: NODE_MAILER_ALIAS,
        pass: NODE_MAILER_PASSWORD
    }
})

export const sendMail = async (options: Mail.Options): Promise<SMTPTransport.SentMessageInfo | null> => {
    let result: SentMessageInfo | null = null;
    try {
        result = await mailTransporter.sendMail(options);
    } finally {
        return result;
    }
}