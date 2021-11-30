import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// 내부 서버의 Logggin
// https://docs.nestjs.com/interceptors#binding-interceptors
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before...');
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        // console.log(`After... ${Date.now() - now}ms`)
      }),
    );
  }
}
