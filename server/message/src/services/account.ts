import { renderHtmlFromTemplate, sendMail } from "../utils";
import { NODE_MAILER_SENDER, consoleLogger } from "../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { toActiveMannualAccountUrl } from "../data";

export const mailTemplates = {
    ACTIVE_ACCOUNT_MANNUAL: "active-account-mannual.ejs"
} as const;


export interface MannualAccountInfo {
    token: string;
    email: string;
}

export const sendActiveMannualAccount = async (info: MannualAccountInfo): Promise<SMTPTransport.SentMessageInfo | null> => {
    let result: SMTPTransport.SentMessageInfo | null = null;
    try {
        const { email, token } = info;
        const html = await renderHtmlFromTemplate(mailTemplates.ACTIVE_ACCOUNT_MANNUAL, {
            email: email,
            activeUrl: toActiveMannualAccountUrl(token)
        });
        result = await sendMail({
            from: NODE_MAILER_SENDER,
            to: info.email,
            subject: `Verify your account`,
            html: html
        });
    } catch (error) {
        consoleLogger.err("Send mannual account failed", error);
    } finally {
        return result;
    }
}