import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(host: string): string {
    return `
      <h3 style="display: flex; align-items: center; justify-content: center;">
        Welcome to Leovegas API! Please visit <a href="${host}/api-doc"> API Doc </a> to see the documentation.
      </h3>
    `;
  }
}
