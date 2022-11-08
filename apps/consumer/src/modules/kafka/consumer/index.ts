import {
  Consumer,
  Kafka,
  ConsumerSubscribeTopics,
  EachMessagePayload,
} from "kafkajs";
import {
  ICache,
  IIPStackController,
  IKafkaConsumer,
  IKafkaInstance,
} from "../../../interfaces";
import { RedisCache } from "../../cache";
import { IPStackController } from "../../ip-stack";

export class KafkaConsumer implements IKafkaConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private cache: ICache;
  private ipStackController: IIPStackController;

  constructor(kafka: IKafkaInstance) {
    this.kafka = kafka.getKafka();
    this.consumer = this.kafka.consumer({ groupId: "consumer-group" });
    this.cache = new RedisCache(Number(process.env.REDIS_TTL));
    this.ipStackController = new IPStackController();
  }

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: ["ip-stack"],
      fromBeginning: false,
    };
    try {
      await this.consumer.connect();
      await this.consumer.subscribe(topic);
      await this.consumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const {
            message: { key, value },
          } = messagePayload;
          const location = await this.cache.get(`${key}`, async () =>
            this.ipStackController.getLocation(`${value}`)
          );
          console.log({ key: `${key}`, location });
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async shutdown(): Promise<void> {
    await this.consumer.disconnect();
  }
}
