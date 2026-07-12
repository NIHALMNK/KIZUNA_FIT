import nodemailer from 'nodemailer';
import { IEmailProvider, SendTemplatePayload } from '../../application/ports/IEmailProvider';
import { env } from '../../../config/env.config';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

export class NodemailerSmtpEmailProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter | null = null;
  private isInitialized = false;

  private compileTemplate(templateName: string, context: Record<string, unknown>): { html: string; text: string } {
    const templateDir = path.resolve(__dirname, 'templates/v1');
    const templatePath = path.join(templateDir, `${templateName}.hbs`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} not found at ${templatePath}`);
    }

    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    
    const html = template(context);
    
    // Fallback simple text conversion (strip tags roughly for text version)
    const text = html.replace(/<[^>]*>?/gm, '');

    return { html, text };
  }

  public async sendTemplate(payload: SendTemplatePayload): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }

    if (!this.transporter) {
      throw new Error('Email transporter is not initialized');
    }

    const { html, text } = this.compileTemplate(payload.template, payload.context);

    const info = await this.transporter.sendMail({
      from: env.SMTP_FROM || '"KIZUNAFIT" <noreply@kizunafit.com>',
      to: payload.to,
      subject: payload.subject,
      text: text,
      html: html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log(`\n=======================================================`);
    console.log(`EMAIL SENT`);
    console.log(`=======================================================`);
    console.log(`From: ${env.SMTP_FROM || 'noreply@kizunafit.com'}`);
    console.log(`To: ${payload.to}`);
    console.log(`\nSubject:\n${payload.subject}`);
    
    if (payload.context.verificationUrl || payload.context.resetUrl) {
      console.log(`\nAction URL:\n${payload.context.verificationUrl || payload.context.resetUrl}`);
    }
    
    if (payload.context.token) {
      console.log(`\nVerification Token:\n${payload.context.token}`);
    }

    if (previewUrl) {
      console.log(`\nPreview URL:\n${previewUrl}`);
    }
    console.log(`=======================================================\n`);
  }

  private async init(): Promise<void> {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
      // Use real SMTP if provided
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT) || 587,
        secure: Number(env.SMTP_PORT) === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      });
      this.isInitialized = true;
    } else {
      if (env.NODE_ENV === 'production') {
        throw new Error('FATAL: SMTP credentials are required in production environment.');
      }

      // Fallback to Ethereal Email for development if credentials are missing
      console.log('[NodemailerSmtpEmailProvider] SMTP credentials not found in environment.');
      console.log('[NodemailerSmtpEmailProvider] Generating a test Ethereal Email account automatically...');
      
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('[NodemailerSmtpEmailProvider] Test account generated successfully! Emails will be caught by Ethereal and a preview link will be printed.');
      this.isInitialized = true;
    }
  }
}
