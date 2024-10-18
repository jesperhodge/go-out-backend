import { Module } from '@nestjs/common'
import { ApiController } from './api.controller'
import { UsersModule } from '~/users/users.module'

@Module({
  controllers: [ApiController],
  imports: [UsersModule],
})
export class ApiModule {}
