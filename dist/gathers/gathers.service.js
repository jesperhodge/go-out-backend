"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GathersService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../prisma.service");
const CURRENT_USER_PLACEHOLDER_ID = 1;
let GathersService = class GathersService {
    constructor(prisma, request) {
        this.prisma = prisma;
        this.request = request;
    }
    currentUserWhere() {
        return {
            clerk_uuid: this.request.auth.userId,
        };
    }
    async create(gatherDto) {
        const location = gatherDto.gather.googlePlace.location;
        const lat = location ? parseFloat(location.split(',')[0].slice(1)) : undefined;
        const lng = location ? parseFloat(location.split(',')[1].slice(0, -1)) : undefined;
        const data = {
            name: gatherDto.gather.name || 'Placeholder',
            date: gatherDto.gather.date && new Date(gatherDto.gather.date),
            description: gatherDto.gather.description,
            pictures: gatherDto.gather.pictures || [],
            participants: {
                connect: [this.currentUserWhere()],
            },
            creator: {
                connect: this.currentUserWhere(),
            },
            googlePlace: {
                connectOrCreate: {
                    where: {
                        place_id: gatherDto.gather.googlePlace.googleId,
                        location: gatherDto.gather.googlePlace.location,
                    },
                    create: {
                        place_id: gatherDto.gather.googlePlace.googleId,
                        name: gatherDto.gather.googlePlace.name || 'Placeholder',
                        formatted_address: gatherDto.gather.googlePlace.formatted_address,
                        location: gatherDto.gather.googlePlace.location,
                        lat,
                        lng,
                    },
                },
            },
        };
        return this.prisma.gather.create({
            data,
            include: {
                participants: true,
                creator: true,
                googlePlace: true,
            },
        });
    }
    async findAll(query) {
        const bounds = query.bounds ? JSON.parse(query.bounds) : undefined;
        const googleLocationBoundsQuery = bounds
            ? {
                lat: {
                    gte: bounds.south,
                    lte: bounds.north,
                },
                lng: {
                    gte: bounds.west,
                    lte: bounds.east,
                },
            }
            : undefined;
        const googleLocationFindOneQuery = query.location || query.googlePlaceName || query.address
            ? {
                OR: [{ location: query.location }, { name: query.googlePlaceName }, { formatted_address: query.address }],
            }
            : undefined;
        const googleLocationFilter = googleLocationBoundsQuery || googleLocationFindOneQuery || {};
        const searchFilter = {
            id: query.id,
            name: query.name,
            date: query.date ? new Date(query.date) : undefined,
            googlePlaceId: query.googleId,
            googlePlace: googleLocationFilter,
        };
        const limit = query.limit ? parseInt(query.limit) : 100;
        const res = await this.prisma.gather.findMany({
            where: searchFilter,
            take: limit,
            include: {
                participants: true,
                creator: true,
                googlePlace: true,
            },
        });
        return res;
    }
    async findOne(id) {
        return this.prisma.gather.findUnique({
            where: {
                id: id,
            },
            include: {
                participants: true,
                creator: true,
                googlePlace: true,
            },
        });
    }
    async join(gatherId) {
        console.log('gatherId: ', gatherId);
        const result = await this.prisma.gather.update({
            where: { id: gatherId },
            data: {
                participants: {
                    connect: this.currentUserWhere(),
                },
            },
            include: {
                participants: true,
                creator: true,
                googlePlace: true,
            },
        });
        return result;
    }
};
exports.GathersService = GathersService;
exports.GathersService = GathersService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], GathersService);
//# sourceMappingURL=gathers.service.js.map