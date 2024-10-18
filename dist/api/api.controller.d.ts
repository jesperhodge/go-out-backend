import { RawBodyRequest } from '@nestjs/common';
import { UsersService } from '~/users/users.service';
import { Request as ExpressRequest } from 'express';
export declare class ApiController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(req: RawBodyRequest<ExpressRequest>): Promise<Response | {
        success: boolean;
        message: string;
    }>;
}
