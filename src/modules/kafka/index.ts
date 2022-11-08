import { Kafka, logLevel } from "kafkajs";
import { IKafkaInstance } from "../../interfaces/IKafkaInstance";

export class KafkaInstance implements IKafkaInstance {
  private kafka: Kafka;

  constructor(clientId: string) {
    this.kafka = new Kafka({
      clientId: clientId,
      logLevel: logLevel.NOTHING,
      brokers: [process.env.KAFKA_HOST || "localhost:9092"],
      retry: {
        initialRetryTime: 300,
        maxRetryTime: 1800000,
        retries: 2,
      },
    });
  }

  getKafka(): Kafka {
    return this.kafka;
  }
}
