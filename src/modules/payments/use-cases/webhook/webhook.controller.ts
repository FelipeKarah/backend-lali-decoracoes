import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from './webhook.service';

@Controller('payments')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('webhook')
  async handleWebhook(@Body() webhookBody: any, @Res() res: Response) {
    try {
      await this.webhookService.execute(webhookBody);
      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
}
