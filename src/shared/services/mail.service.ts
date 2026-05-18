// services/MailService.ts
import { Resend } from 'resend'

interface IData {
  to: string
  subject: string
  message: string
}

export class MailService {
  private static resend: Resend

  static initialize() {
    this.resend = new Resend(process.env.RESEND_API_KEY!)
  }

  static async sendSingle(data?: IData) {
    // Inicializa se necessário
    if (!this.resend) {
      this.initialize()
    }

    const mailOptions = {
      from: 'Lali Bebidas <contato@lali.com.br>', // SEU DOMÍNIO!
      to: data?.to || 'lali@gmail.com',
      subject: data?.subject || 'Assunto do e-mail',
      html: data?.message || 'Conteúdo do e-mail', // Mudei para html
    }

    try {
      const { data: result, error } = await this.resend.emails.send(mailOptions)

      if (error) {
        console.log('Error while sending mail:', error.message)
        return false
      }

      console.log('✅ Email sent successfully. ID:', result?.id)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  // MÉTODO NOVO - Para enviar códigos de acesso
  static async sendWelcomeEmail(userEmail: string, accessCode: string) {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Validação de Email - Lalibidas</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Cabeçalho -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c5aa0; margin: 0;">Lalibidas</h1>
          <p style="color: #666; margin: 5px 0;">Seu Depósito de Confiança</p>
          <p style="color: #666; margin: 5px 0;">Atacado e Varejo • Preços de Fábrica</p>
        </div>
        
        <!-- Conteúdo -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px;">
          <h2 style="color: #2c5aa0; margin-top: 0;">Valide seu cadastro</h2>
          <p>Olá, obrigado por se cadastrar! Para ativar sua conta, use o código abaixo no primeiro acesso:</p>
          
          <div style="background: white; padding: 20px; text-align: center; border: 2px dashed #2c5aa0; margin: 25px 0; border-radius: 8px;">
            <div style="font-size: 28px; font-weight: bold; color: #2c5aa0; letter-spacing: 4px; font-family: monospace;">
              ${accessCode}
            </div>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Código de validação</p>
          </div>
          
          <p><strong>Como validar sua conta:</strong></p>
          <ol>
            <li>Acesse <a href="https://www.lali.com.br/login" style="color: #2c5aa0; text-decoration: none; font-weight: bold;">www.lali.com.br/login</a></li>
            <li>Insira seu <strong>email e senha</strong> (que você já criou)</li>
            <li>Quando solicitado, digite o <strong>código de validação</strong> acima</li>
            <li>Pronto! Sua conta estará ativa</li>
          </ol>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #2c5aa0; font-size: 14px;">
              💡 <strong>Importante:</strong> Após esta validação, você fará login normalmente apenas com email e senha.
            </p>
          </div>
        </div>
        
        <!-- Suporte WhatsApp -->
        <div style="background:  #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
          <h3 style="margin: 0 0 15px 0;">📱 Precisa de ajuda?</h3>
          <p style="margin: 0 0 15px 0; font-size: 16px;">Fale conosco pelo WhatsApp</p>
          <a href="https://wa.me/5519971058942" 
             style="display: inline-block; background: white; color: #25D366; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
            🗨️ Chamar no WhatsApp
          </a>
          <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;"><strong>(19) 97105-8942</strong></p>
        </div>
        
        <!-- Rodapé -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
          <p><strong>Lalibidas</strong></p>
          <p style="font-size: 10px; color: #999;">
            Este é um email de validação de conta. Você está recebendo porque se cadastrou em nosso site.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

    return this.sendSingle({
      to: userEmail,
      subject: 'Valide sua conta - Lalibidas',
      message: htmlTemplate,
    })
  }
}
