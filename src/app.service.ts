import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getHello(res: Response, host: string): string {
    const nonce = res.locals.nonce;
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;">
        <h3>
          Welcome to Leovegas API! Please visit <a href="${host}/api-doc"> API Doc </a> to see the documentation.
        </h3>

        <div class="postman-run-button"
        data-postman-action="collection/fork"
        data-postman-visibility="public"
        data-postman-var-1="8025750-5f7cceb7-79cf-40e5-987e-2b8d3b429d70"
        data-postman-collection-url="entityId=8025750-5f7cceb7-79cf-40e5-987e-2b8d3b429d70&entityType=collection&workspaceId=0e2a8a06-6749-4c5e-baf7-c3bda1a1bd20"></div>

        <script nonce="${nonce}" src="/postmanButtonInjector.js"></script>
        <script nonce="${nonce}">
          injectPostmanRunButton('${nonce}', '_pm', 'https://run.pstmn.io/button.js');
        </script>
      </div>
    `;
  }
}
