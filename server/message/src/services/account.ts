import { renderHtmlFromTemplate, sendMail } from "../utils";
import { NODE_MAILER_SENDER, consoleLogger } from "../config";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { toActiveManualAccountUrl } from "../data";

export const mailTemplates = {
  ACTIVE_ACCOUNT_MANUAL: "active-account-manual.ejs",
  NEW_EMAIL_CREATED: "new-account-created.ejs",
} as const;

export interface ManualAccountInfo {
  token: string;
  email: string;
}

export const sendActiveManualAccount = async (
  info: ManualAccountInfo
): Promise<SMTPTransport.SentMessageInfo | null> => {
  let result: SMTPTransport.SentMessageInfo | null = null;
  try {
    const { email, token } = info;
    const activeUrl = toActiveManualAccountUrl(token);
    const html = await renderHtmlFromTemplate(
      mailTemplates.ACTIVE_ACCOUNT_MANUAL,
      {
        email: email,
        activeUrl: activeUrl,
      }
    );

    result = await sendMail({
      from: NODE_MAILER_SENDER,
      to: info.email,
      subject: `Verify your account`,
      html: html,
    });

    consoleLogger.info("[EMAIL]", "[ACTIVE ACCOUNT", info.email);
  } catch (error) {
    consoleLogger.err("Send manual account failed", error);
  } finally {
    return result;
  }
};

export interface NewAccountInfo {
  email: string;
  password: string;
}

export const sendNewAccountCreated = async (
  info: NewAccountInfo
): Promise<SMTPTransport.SentMessageInfo | null> => {
  let result: SMTPTransport.SentMessageInfo | null = null;
  try {
    const html = await renderHtmlFromTemplate(
      mailTemplates.NEW_EMAIL_CREATED,
      info
    );
    result = await sendMail({
      from: NODE_MAILER_SENDER,
      to: info.email,
      subject: `F4U created new account`,
      html: html,
    });
  } catch (error) {
    consoleLogger.err("Send manual account failed", error);
  } finally {
    return result;
  }
};
