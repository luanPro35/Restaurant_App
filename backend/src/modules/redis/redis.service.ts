import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client!: RedisClientType;
    private readonly logger = new Logger(RedisService.name);

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
        const port = this.configService.get<number>('REDIS_PORT') || 6379;
        const password = this.configService.get<string>('REDIS_PASSWORD');

        this.client = createClient({
            socket: {
                host,
                port: Number(port),
            },
            password,
        });

        this.client.on("error", (err) => this.logger.error("Redis error: ", err));

        try {
            await this.client.connect();
            this.logger.log(`Redis connected to ${host}:${port}`);
        } catch (error) {
            this.logger.error("Could not connect to Redis", error);
        }
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
        }
    }

    getClient(): RedisClientType {
        return this.client;
    }

    async set(key: string, value: string, ttl?: number) {
        if (ttl) {
            return await this.client.set(key, value, { EX: ttl });
        }
        return await this.client.set(key, value);
    }

    async get(key: string) {
        return await this.client.get(key);
    }

    async del(key: string) {
        return await this.client.del(key);
    }

    async exists(key: string) {
        const result = await this.client.exists(key);
        return result === 1;
    }
}
