import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { serviceConfig } from '../../config/gateway.config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) {}

  async proxyRequest(
    serviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    data?: any,
    headers?: any,
    userInfo?: any,
  ) {
    const service = serviceConfig[serviceName];
    const url = `${service.url}${path}`;

    this.logger.log(`Proxying request to ${serviceName} - ${method} ${url}`);
    try {
      const enhancedHeaders = {
        ...headers,
        'X-User-Id': userInfo?.id,
        'X-User-email': userInfo?.email,
        'X-User-Role': userInfo?.role,
      };

      const response = await firstValueFrom(
        this.httpService.request({
          method: method.toLowerCase(),
          url,
          data,
          headers: enhancedHeaders,
          timeout: service.timeout,
        }),
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Error proxying ${method} request to ${serviceName}: ${url}`,
      );
      throw error;
    }
  }

  async getServiceHealth(serviceName: keyof typeof serviceConfig) {
    try {
      const service = serviceConfig[serviceName];
      const response = await firstValueFrom(
        this.httpService.get(`${service.url}/health`, {
          timeout: 3000,
        }),
      );

      return { status: 'healthy', data: response.data };
    } catch (e: any) {
      return { status: 'unhealthy', error: e.message };
    }
  }
}
