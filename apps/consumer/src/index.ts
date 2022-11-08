import "dotenv/config";
import { KafkaInstance, KafkaConsumer } from "./modules/kafka/";

const kafkaInstance = new KafkaInstance("consumer-client");
const consumer = new KafkaConsumer(kafkaInstance.getKafka());
consumer.startConsumer();
