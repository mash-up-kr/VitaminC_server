import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UtilService {
  constructor(private readonly configService: ConfigService) {}

  isDev() {
    return this.configService.get('NODE_ENV') === 'development';
  }

  isStage() {
    return this.configService.get('NODE_ENV') === 'stage';
  }

  isProd() {
    return this.configService.get('NODE_ENV') === 'production';
  }

  uniqueBy<T>(arr: T[], toKey: (item: T) => string): T[] {
    return Object.values(
      arr.reduce(
        (acc, item) => {
          acc[toKey(item)] = item;
          return acc;
        },
        {} as Record<string, T>,
      ),
    );
  }
}
