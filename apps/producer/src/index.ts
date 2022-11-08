import "dotenv/config";
import { Kafka, logLevel, Partitioners } from "kafkajs";
import express from "express";
import cors from "cors";
import { routes } from "./routes";

const PORT = process.env.PORT || 3333;
const app = express();
const kafka = new Kafka({
  clientId: "producer-client",
  brokers: ["kafka:9092"],
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

app.use(express.json());
app.use(cors());
app.use((req, _, next) => {
  req.producer = producer;
  return next();
});
app.use(routes);

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "ip-response" });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const { key, value } = message;
      console.log({
        key: key?.toString(),
        value: JSON.parse(value?.toString() || ""),
      });
    },
  });

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

run().catch(console.error);
