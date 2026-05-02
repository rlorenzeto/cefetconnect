import { Injectable, Logger } from '@nestjs/common';
import nodemailer = require('nodemailer');
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

// SMTP MOCKADO — tem que substituir pelas variáveis de ambiente em produção

const SMTP_HOST =  process.env.SMTP_HOST ??  'smtp.ethereal.email';
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER =  process.env.SMTP_USER ??  'brett.mckenzie@ethereal.email';
const SMTP_PASS =   process.env.SMTP_PASS ??  'MP4uATpksFufkgFxv1';
const EMAIL_FROM =
  process.env.EMAIL_FROM ?? '"Cefet Connect" <noreply@cefetconnect.com>';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

  async enviarCodigoVerificacao(
    destinatario: string,
    nomeUsuario: string,
    codigo: string,
  ): Promise<void> {
    const mailOptions = {
      from: EMAIL_FROM,
      to: destinatario,
      subject: 'Cefet Connect — Confirme seu e-mail',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Olá, ${nomeUsuario}!</h2>
          <p>Obrigado por se cadastrar no <strong>Cefet Connect</strong>.</p>
          <p>Use o código abaixo para confirmar seu e-mail. Ele é válido por <strong>15 minutos</strong>.</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a73e8;">
              ${codigo}
            </span>
          </div>
          <p style="color: #888; font-size: 12px;">
            Se você não se cadastrou no Cefet Connect, ignore este e-mail.
          </p>
        </div>
      `,
    };

    try {
      const info: SMTPTransport.SentMessageInfo =
        await this.transporter.sendMail(mailOptions);
      // Em desenvolvimento com Ethereal, este link permite visualizar o e-mail no browser
      this.logger.log(
        `E-mail enviado para ${destinatario} — ${nodemailer.getTestMessageUrl(info) ?? info.messageId}`,
      );
    } catch (erro) {
      // Loga mas não propaga: o cadastro não deve falhar por erro de e-mail
      this.logger.error(
        `Falha ao enviar e-mail para ${destinatario}: ${(erro as Error).message}`,
      );
    }

    // Fallback de desenvolvimento: imprime o código no console
    this.logger.debug(
      `[DEV] Código de verificação para ${destinatario}: ${codigo}`,
    );
  }
}
