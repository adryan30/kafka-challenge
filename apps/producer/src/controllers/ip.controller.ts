import { Request, Response } from "express";
import { CompressionTypes } from "kafkajs";
import { IIPController } from "src/interfaces/IIPController";

export class IPController implements IIPController {
  async handle(req: Request, res: Response): Promise<void> {
    const { client_id: id, ip } = req.body;

    await req.producer?.send({
      topic: String(process.env.KAFKA_TOPIC),
      compression: CompressionTypes.GZIP,
      messages: [{ key: id, value: ip }],
    });
    res.json({ ok: true });
  }
}
