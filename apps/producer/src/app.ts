import cors from "cors";
import express from "express";
import { Kafka, logLevel, Partitioners } from "kafkajs";
import { routes } from "./routes";

const app = express();
const kafka = new Kafka({
  clientId: "producer-client",
  brokers: [process.env.KAFKA_HOST || "kafka:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});
const consumer = kafka.consumer({ groupId: "producer-group" });
(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: String(process.env.KAFKA_RESPONSE_TOPIC) });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const { key, value } = message;
      console.log({
        key: key?.toString(),
        value: JSON.parse(value?.toString() || ""),
      });
    },
  });
})();

app.use(express.json());
app.use(cors());
app.use(async (req, _, next) => {
  req.producer = producer;
  await producer.connect();
  return next();
});
app.use(routes);

export { app };
