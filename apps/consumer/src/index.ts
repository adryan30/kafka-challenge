import "dotenv/config";
import { KafkaInstance } from "./modules/kafka";
import { KafkaConsumer } from "./modules/kafka/consumer";

const kafkaInstance = new KafkaInstance("consumer-client");
const consumer = new KafkaConsumer(kafkaInstance.getKafka());
consumer.startConsumer();
