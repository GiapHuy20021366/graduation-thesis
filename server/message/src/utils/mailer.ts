import nodemailer, { SentMessageInfo } from "nodemailer";
import {
    NODE_MAILER_ALIAS,
    NODE_MAILER_PASSWORD,
    NODE_MAILER_CONFIG_HOST,
    NODE_MAILER_CONFIG_PORT,
    consoleLogger,
    NODE_MAILER_SERVICE
} from "../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import ejs from "ejs";
import path from "path";

const VIEWSFOLDER = "../views";

export const mailTransporter = nodemailer.createTransport({
    service: NODE_MAILER_SERVICE,
    host: NODE_MAILER_CONFIG_HOST,
    port: NODE_MAILER_CONFIG_PORT,
    secure: false,
    auth: {
        user: NODE_MAILER_ALIAS,
        pass: NODE_MAILER_PASSWORD
    }
})

export const sendMail = async (options: Mail.Options): Promise<SMTPTransport.SentMessageInfo | null> => {
    let result: SentMessageInfo | null = null;
    try {
        result = await mailTransporter.sendMail(options);
    } catch (err) {
        consoleLogger.err("Mail transport failed", err);
    } finally {
        return result;
    }
}

export const renderHtmlFromTemplate = async (name: string, data: { [key: string]: any }): Promise<string | undefined> => {
    let result: string | undefined = undefined;
    try {
        result = await ejs.renderFile(path.resolve(__dirname, VIEWSFOLDER, name), { data });
    } catch (error) {
        consoleLogger.err("Template render failed", error);
    } finally {
        return result;
    }
}