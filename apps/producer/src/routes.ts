import { Router } from "express";
import { CompressionTypes } from "kafkajs";

const routes = Router();

routes.get("/health", async (req, res) => {
  return res.json({ ok: true });
});

routes.post("/ip", async (req, res) => {
  const { client_id: id, ip } = req.body;

  await req.producer?.send({
    topic: "ip-stack",
    compression: CompressionTypes.GZIP,
    messages: [
      {
        key: id,
        value: ip,
      },
    ],
  });

  return res.json({ ok: true });
});

export { routes };
