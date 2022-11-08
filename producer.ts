import {
  CompressionTypes,
  Kafka,
  PartitionAssigners,
  Partitioners,
} from "kafkajs";
import { faker } from "@faker-js/faker";
import "dotenv/config";

(async () => {
  const id = faker.datatype.uuid();
  const ip = faker.internet.ip();
  const kafka = new Kafka({
    brokers: ["localhost:9092"],
  });
  const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });
  await producer.connect();
  await producer.send({
    topic: "ip-stack",
    compression: CompressionTypes.GZIP,
    messages: Array(2)
      .fill(0)
      .map(() => {
        return {
          key: `${id}-${ip}`,
          value: ip,
        };
      }),
  });
  await producer.disconnect();
})();
