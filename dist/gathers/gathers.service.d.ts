import { PrismaService } from '~/prisma.service';
import { Gather } from '@prisma/client';
import { CreateGatherDto, ListAllEntitiesDto } from './dto/gathers.dto';
import { ClerkClient } from '@clerk/backend';
import { Request } from 'express';
interface RequestWithAuth extends Request {
    auth: Record<string, any>;
}
export declare class GathersService {
    private prisma;
    private request;
    clerkClient: ClerkClient;
    constructor(prisma: PrismaService, request: RequestWithAuth);
    private currentUserWhere;
    create(gatherDto: CreateGatherDto): Promise<Gather>;
    findAll(query: ListAllEntitiesDto): Promise<Gather[]>;
    findOne(id: number): Promise<Gather | null>;
    join(gatherId: number): Promise<Gather>;
}
export {};
