import { Injectable, Logger } from '@nestjs/common';
import nodemailer = require('nodemailer');
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

 const EMAIL_FROM =
  process.env.EMAIL_FROM ?? '"Cefet Connect" <noreply@cefetconnect.com>';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  //lógica de envio de e-mails, utilizando o Nodemailer para enviar os códigos de verificação para os usuários. 
  //utilizado pelo UsuarioService para enviar o código de verificação quando um novo usuário é criado.
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER ?? 'brett.mckenzie@ethereal.email',
        pass: process.env.SMTP_PASS ?? 'MP4uATpksFufkgFxv1',
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
          <p>Use o código abaixo para confirmar seu e-mail.</p>
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

  async enviarCodigoRecuperacao(
    destinatario: string,
    nomeUsuario: string,
    codigo: string,
  ): Promise<void> {
    const mailOptions = {
      from: EMAIL_FROM,
      to: destinatario,
      subject: 'Cefet Connect — Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #d93025;">Recuperação de Senha</h2>
          <p>Olá, <strong>${nomeUsuario}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Cefet Connect</strong>.</p>
          <p>Use o código de segurança abaixo para prosseguir:</p>
          <div style="text-align: center; margin: 30px 0; background-color: #f8f9fa; padding: 20px; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
              ${codigo}
            </span>
          </div>
          <p>Se você não solicitou essa alteração, recomendamos que altere sua senha atual por segurança.</p>
          <p style="color: #888; font-size: 12px; border-top: 1px solid #eee; pt-10px; margin-top: 20px;">
            Este é um e-mail automático, por favor não responda.
          </p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`E-mail de recuperação enviado para ${destinatario} — ${nodemailer.getTestMessageUrl(info) ?? info.messageId}`);
    } catch (erro) {
      this.logger.error(`Falha ao enviar e-mail de recuperação: ${(erro as Error).message}`);
    }
  }
}
