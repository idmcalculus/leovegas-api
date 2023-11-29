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
        data-postman-var-1="8025750-27360a8f-fe7d-47f4-942b-d9ed70133bbf"
        data-postman-collection-url="entityId=8025750-27360a8f-fe7d-47f4-942b-d9ed70133bbf&entityType=collection&workspaceId=9d119129-11ee-4c3e-88ef-6706fe469018"></div>

        <script nonce="${nonce}" src="/postmanButtonInjector.js"></script>
        <script nonce="${nonce}">
          injectPostmanRunButton('${nonce}', '_pm', 'https://run.pstmn.io/button.js');
        </script>
      </div>
    `;
  }
}
