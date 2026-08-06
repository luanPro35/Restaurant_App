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
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        return false; // Dừng retry nếu không kết nối được Redis
                    }
                    return 1000;
                },
            },
            password: password || undefined,
        });

        this.client.on("error", (err) => this.logger.warn("Redis error: " + err.message));

        try {
            await this.client.connect();
            this.logger.log(`Redis connected to ${host}:${port}`);
        } catch (error: any) {
            this.logger.warn("Could not connect to Redis, running in fallback mode (without Redis).");
        }
    }

    async onModuleDestroy() {
        if (this.client && this.client.isOpen) {
            await this.client.quit();
        }
    }

    getClient(): RedisClientType {
        return this.client;
    }

    async set(key: string, value: string, ttl?: number) {
        try {
            if (!this.client?.isOpen) return null;
            if (ttl) {
                return await this.client.set(key, value, { EX: ttl });
            }
            return await this.client.set(key, value);
        } catch (err) {
            this.logger.warn(`[Redis set failed] ${key}`);
            return null;
        }
    }

    async get(key: string) {
        try {
            if (!this.client?.isOpen) return null;
            return await this.client.get(key);
        } catch (err) {
            this.logger.warn(`[Redis get failed] ${key}`);
            return null;
        }
    }

    async del(key: string) {
        try {
            if (!this.client?.isOpen) return null;
            return await this.client.del(key);
        } catch (err) {
            this.logger.warn(`[Redis del failed] ${key}`);
            return null;
        }
    }

    async exists(key: string) {
        try {
            if (!this.client?.isOpen) return false;
            const result = await this.client.exists(key);
            return result === 1;
        } catch (err) {
            return false;
        }
    }
}
