import { renderHtmlFromTemplate, sendMail } from "../utils";
import { NODE_MAILER_SENDER, consoleLogger } from "../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { toActiveManualAccountUrl } from "../data";

export const mailTemplates = {
    ACTIVE_ACCOUNT_MANUAL: "active-account-manual.ejs"
} as const;


export interface ManualAccountInfo {
    token: string;
    email: string;
}

export const sendActiveManualAccount = async (info: ManualAccountInfo): Promise<SMTPTransport.SentMessageInfo | null> => {
    let result: SMTPTransport.SentMessageInfo | null = null;
    try {
        const { email, token } = info;
        const activeUrl = toActiveManualAccountUrl(token);
        console.log(email, activeUrl);        
        const html = await renderHtmlFromTemplate(mailTemplates.ACTIVE_ACCOUNT_MANUAL, {
            email: email,
            activeUrl: activeUrl
        });
    
        result = await sendMail({
            from: NODE_MAILER_SENDER,
            to: info.email,
            subject: `Verify your account`,
            html: html
        });
    } catch (error) {
        consoleLogger.err("Send manual account failed", error);
    } finally {
        return result;
    }
}