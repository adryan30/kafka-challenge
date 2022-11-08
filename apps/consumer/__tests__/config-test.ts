export default {
  initKafkaConfig: {
    brokers: ["localhost:9092"],
    clientId: "test-client",
  },
  initRedisConfig: {
    host: "",
    port: "",
  },
  topic: "test-topic",
  groupId: "test-group",
};
