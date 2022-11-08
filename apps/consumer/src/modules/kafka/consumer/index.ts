import {
  Consumer,
  Kafka,
  ConsumerSubscribeTopics,
  Producer,
  EachMessagePayload,
  Partitioners,
} from "kafkajs";
import {
  ICache,
  IIPStackController,
  IKafkaConsumer,
} from "../../../interfaces";
import { RedisCache } from "../../cache";
import { IPStackController } from "../../ip-stack";

export class KafkaConsumer implements IKafkaConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;
  private ipStackController: IIPStackController;
  private topic: ConsumerSubscribeTopics;
  private responseTopic: string;

  constructor(
    kafka: Kafka,
    groupId: string = "consumer-group",
    producer?: Producer
  ) {
    this.kafka = kafka;
    this.ipStackController = new IPStackController();
    this.topic = {
      topics: [String(process.env.KAFKA_TOPIC)],
      fromBeginning: false,
    };
    this.responseTopic = String(process.env.KAFKA_RESPONSE_TOPIC) || "ip-response";
    this.consumer = this.kafka.consumer({ groupId });
    this.producer =
      producer ||
      this.kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner,
      });
  }

  public async eachMessage(
    payload: EachMessagePayload,
    cache: RedisCache
  ): Promise<void> {
    const { message } = payload;
    const { key, value } = message;
    const location = await cache.get(`${key}-${value}`, async () =>
      this.ipStackController.getLocation(`${value}`)
    );
    this.producer.send({
      topic: this.responseTopic,
      messages: [
        {
          key: key,
          value: JSON.stringify({
            client_id: key?.toString(),
            timestamp: Date.now(),
            ip: value?.toString(),
            latitude: location.latitude,
            longitude: location.longitude,
            country: location.country_name,
            region: location.region_name,
            city: location.city,
          }),
        },
      ],
    });
    console.log({ message: `IP location for key ${key} was retrieved` });
  }

  public async startConsumer(): Promise<void> {
    const cache = new RedisCache(Number(process.env.REDIS_TTL));
    await this.consumer.connect();
    await this.producer.connect();
    try {
      await this.consumer.subscribe(this.topic);
      await this.consumer.run({
        eachMessage: (payload) => this.eachMessage(payload, cache),
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async shutdown(): Promise<void> {
    await this.consumer.disconnect();
  }

  getConsumer(): Consumer {
    return this.consumer;
  }
}
