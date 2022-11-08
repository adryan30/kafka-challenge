import { Consumer, Kafka, ConsumerSubscribeTopics, Producer } from "kafkajs";
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
  private producer: Producer;
  private cache: ICache;
  private ipStackController: IIPStackController;

  constructor(kafka: IKafkaInstance) {
    this.kafka = kafka.getKafka();
    this.consumer = this.kafka.consumer({ groupId: "consumer-group" });
    this.producer = this.kafka.producer();
    this.cache = new RedisCache(Number(process.env.REDIS_TTL));
    this.ipStackController = new IPStackController();
  }

  public async startConsumer(): Promise<void> {
    await this.consumer.connect();
    await this.producer.connect();
    const topic: ConsumerSubscribeTopics = {
      topics: ["ip-stack"],
      fromBeginning: false,
    };
    try {
      await this.consumer.subscribe(topic);
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const { key, value } = message;
          const location = await this.cache.get(`${key}-${value}`, async () =>
            this.ipStackController.getLocation(`${value}`)
          );
          this.producer.send({
            topic: "ip-response",
            messages: [
              {
                key: key,
                value: JSON.stringify({
                  client_id: key?.toString(),
                  timestamp: Date.now(),
                  ip: value?.toString(),
                  latitude: location.latitude,
                  longitude: location.longitude,
                  country: location.country,
                  region: location.region,
                  city: location.city,
                }),
              },
            ],
          });
          console.log({ message: `IP location for key ${key} was retrieved` });
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
