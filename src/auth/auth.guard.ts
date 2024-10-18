import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import { clerkMiddleware } from '@clerk/express'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly requireAuth = ClerkExpressRequireAuth({})

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    return new Promise((resolve, reject) => {
      this.requireAuth(request, response, (err) => {
        if (err) {
          reject(new UnauthorizedException(err.stack))
        } else {
          resolve(true)
        }
      })
    })
  }
}
