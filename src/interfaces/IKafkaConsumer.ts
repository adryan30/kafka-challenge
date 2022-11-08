export interface IKafkaConsumer {
  startConsumer(): Promise<void>;
  shutdown(): Promise<void>;
}
