import { Kafka } from "kafkajs";

export interface IKafkaInstance {
  getKafka(): Kafka;
}
