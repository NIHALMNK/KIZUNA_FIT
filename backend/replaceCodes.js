const fs = require('fs');
const glob = require('glob');

const replacements = {
  "'UNAUTHORIZED'": "ApiErrorCode.UNAUTHORIZED",
  "'BAD_REQUEST'": "ApiErrorCode.BAD_REQUEST",
  "'REGISTRATION_FAILED'": "ApiErrorCode.REGISTRATION_FAILED",
  "'INVALID_CREDENTIALS'": "ApiErrorCode.INVALID_CREDENTIALS",
  "'FORBIDDEN'": "ApiErrorCode.FORBIDDEN",
  "'NOT_FOUND'": "ApiErrorCode.NOT_FOUND",
  "'INTERNAL_SERVER_ERROR'": "ApiErrorCode.INTERNAL_SERVER_ERROR",
  "'VALIDATION_ERROR'": "ApiErrorCode.VALIDATION_ERROR",
  "'CONFLICT'": "ApiErrorCode.CONFLICT",
  "'TOO_MANY_REQUESTS'": "ApiErrorCode.TOO_MANY_REQUESTS",
  "'VERIFICATION_FAILED'": "ApiErrorCode.VERIFICATION_FAILED",
  "'PASSWORD_RESET_FAILED'": "ApiErrorCode.PASSWORD_RESET_FAILED",
  "'ACCOUNT_DELETED'": "ApiErrorCode.ACCOUNT_DELETED",
  "'ROUTE_NOT_FOUND'": "ApiErrorCode.ROUTE_NOT_FOUND",
  "'TOKEN_EXPIRED'": "ApiErrorCode.TOKEN_EXPIRED",
  "'MALFORMED_JSON'": "ApiErrorCode.MALFORMED_JSON",
  "'FORGOT_PASSWORD_FAILED'": "ApiErrorCode.FORGOT_PASSWORD_FAILED",
  "'RESET_PASSWORD_FAILED'": "ApiErrorCode.RESET_PASSWORD_FAILED",
  "'CHANGE_PASSWORD_FAILED'": "ApiErrorCode.CHANGE_PASSWORD_FAILED",
  "'DELETE_ACCOUNT_FAILED'": "ApiErrorCode.DELETE_ACCOUNT_FAILED"
};

const importStatement = `import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';\n`;
const importStatementMiddlewares = `import { ApiErrorCode } from '../responses/ApiErrorCode';\n`;

const processFile = (filePath, isMiddleware) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [search, replace] of Object.entries(replacements)) {
    content = content.split(search).join(replace);
  }

  if (content !== originalContent && !content.includes('ApiErrorCode')) {
    const lines = content.split('\n');
    let insertIndex = 0;
    while (lines[insertIndex].startsWith('import')) {
      insertIndex++;
    }
    const imp = isMiddleware ? importStatementMiddlewares : importStatement;
    lines.splice(insertIndex, 0, imp);
    content = lines.join('\n');
  } else if (content !== originalContent && content.includes('ApiErrorCode') && !content.includes('import { ApiErrorCode }')) {
     const lines = content.split('\n');
    let insertIndex = 0;
    while (lines[insertIndex].startsWith('import')) {
      insertIndex++;
    }
    const imp = isMiddleware ? importStatementMiddlewares : importStatement;
    lines.splice(insertIndex, 0, imp);
    content = lines.join('\n');
  }

  fs.writeFileSync(filePath, content);
};

// Assuming running from backend folder
glob.sync('src/modules/identity/presentation/controllers/*.ts').forEach(f => processFile(f, false));
glob.sync('src/shared/infrastructure/http/middleware/*.ts').forEach(f => processFile(f, true));

console.log('Error codes replaced.');
