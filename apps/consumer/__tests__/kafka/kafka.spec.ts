import {
  Consumer,
  EachMessageHandler,
  EachMessagePayload,
  Kafka,
  KafkaMessage,
  Message,
  Producer,
} from "kafkajs";
import config from "../config-test";
import { waitFor } from "../utils/wait-for";
import { KafkaConsumer } from "../../src/modules/kafka/consumer";
const { initConfig, groupId, topic } = config;

const sendMessages = async (
  producer: Producer,
  topic: string,
  messages: Message[]
) => {
  await producer.connect();
  await producer.send({
    topic,
    messages,
  });
};

const runConsumer = async (
  existingConsumer: Consumer,
  kafkaConnection: Kafka,
  groupId: string,
  topic: string,
  eachMessage: EachMessageHandler
) => {
  const consumer = existingConsumer || kafkaConnection.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({ eachMessage });
  return consumer;
};

describe("Kafka Module Tests", () => {
  it("should consume messages from kafka", async () => {
    const kafkaConnection = new Kafka(initConfig);
    const producer = kafkaConnection.producer();
    const kafkaConsumer = new KafkaConsumer(
      kafkaConnection,
      topic,
      producer,
      groupId
    );
    const consumedMessages: KafkaMessage[] = [];
    const consumerHook = (payload: EachMessagePayload) => {
      consumedMessages.push(payload.message);
      return kafkaConsumer.eachMessage(payload);
    };
    runConsumer(
      kafkaConsumer.getConsumer(),
      kafkaConnection,
      groupId,
      topic,
      consumerHook
    );
    //consumer.startConsumer(consumerHook);
    const messages = [
      {
        key: "0d265788-4c1c-44b7-99ac-fb816fbb0bdd",
        value: "187.19.236.255",
      },
    ];
    await sendMessages(producer, topic, messages);
    await waitFor(() => consumedMessages.length === messages.length);
  });
});
