import { CreateGatherDto, ListAllEntitiesDto, JoinGatherDto } from './dto/gathers.dto';
import { GathersService } from './gathers.service';
import { Gather } from '@prisma/client';
import { Request } from 'express';
export declare class GathersController {
    private gathersService;
    constructor(gathersService: GathersService);
    findAll(query: ListAllEntitiesDto): Promise<Gather[]>;
    findOne(params: {
        id: number;
    }): Promise<Gather | null>;
    create(req: Request, createGatherDto: CreateGatherDto): Promise<Gather>;
    join(req: Request, joinGatherDto: JoinGatherDto): Promise<any>;
}
