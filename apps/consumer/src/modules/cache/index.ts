import * as redis from "redis";
import { ICache } from "../../interfaces";

export class RedisCache implements ICache {
  private readonly cache: redis.RedisClientType;
  private ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
    this.cache = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    this.cache.connect();
    this.cache.on("connect", () => {
      console.log(`Redis connection established`);
    });

    this.cache.on("error", (error) => {
      console.error(`Redis error, service degraded: ${error}`);
    });
  }

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const cacheResult = await this.cache.get(key);
      if (cacheResult) {
        return resolve({ ...JSON.parse(cacheResult), fromCache: true });
      } else {
        const result = await fetcher();
        this.cache.set(key, JSON.stringify(result), { EX: this.ttl });
        return resolve({ ...result, fromCache: false });
      }
    }).then();
  }

  del(key: string) {
    this.cache.del(key);
  }

  flush() {
    this.cache.flushAll();
  }

  disconnect() {
    this.cache.disconnect();
  }
}
