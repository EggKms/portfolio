/* eslint-disable no-useless-escape */
import { Logger } from '@nestjs/common';

function getCallerInfo(): string {
  const stack = new Error().stack;
  if (!stack) return '';

  const stackLines = stack.split('\n');
  const callerLine = stackLines[3]; // 호출 스택에서 현재 함수 다음의 호출 정보
  // const match = callerLine.match(/(\/[^\/]+\.ts):(\d+):\d+/);
  // 라인만
  // const match = callerLine.match(/([a-zA-Z0-9_\-\.]+\.ts):(\d+:\d+)/);
  // if (match) {
  //   const [, file, line] = match;
  //   return `${file}:${line}`;
  // }
  // 함수명, 파일위치, 라인 정보
  // const match = callerLine.match(/at (.+?) \((.+\.ts):(\d+:\d+)\)/);
  // if (match) {
  //   const [, functionName, file, line] = match;
  //   return `${functionName} (${file}:${line})`; // 함수명과 파일 경로, 라인 정보 반환
  // }
  // 함수명과 라인 정보
  const match = callerLine.match(/at (.+?) \(.+\.ts:(\d+:\d+)\)/);
  if (match) {
    const [, functionName, line] = match;
    return `${functionName} (${line})`; // 함수명과 라인 정보만 반환
  }
  return '';
}

export class CustomLogger extends Logger {
  log(message: string) {
    const callerInfo = getCallerInfo();
    super.log(`${message} (${callerInfo})`);
  }

  error(message: string, trace?: string) {
    const callerInfo = getCallerInfo();
    super.error(`${message} (${callerInfo})`, trace);
  }

  warn(message: string) {
    const callerInfo = getCallerInfo();
    super.warn(`${message} (${callerInfo})`);
  }

  debug(message: string) {
    const callerInfo = getCallerInfo();
    super.debug(`${message} (${callerInfo})`);
  }

  verbose(message: string) {
    const callerInfo = getCallerInfo();
    super.verbose(`${message} (${callerInfo})`);
  }
}
