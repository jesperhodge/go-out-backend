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
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const svix_1 = require("svix");
const USER_CREATED_EVENT_TYPE = 'user.created';
let ApiController = class ApiController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(req) {
        var _a;
        const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error('You need a WEBHOOK_SECRET in your .env');
        }
        const headers = req.headers;
        const payload = req.rawBody;
        if (payload === undefined) {
            throw new common_1.BadRequestException('Bad request body');
        }
        const svix_id = headers['svix-id'];
        const svix_timestamp = headers['svix-timestamp'];
        const svix_signature = headers['svix-signature'];
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response('Error occured -- no svix headers', {
                status: 400,
            });
        }
        const wh = new svix_1.Webhook(WEBHOOK_SECRET);
        let evt;
        console.log('payload: ', payload);
        console.log('svix_id', svix_id);
        try {
            evt = wh.verify(payload, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        }
        catch (err) {
            console.log('err: ', err);
            throw new common_1.BadRequestException('Error verifying webhook', { cause: err });
        }
        if (evt.type !== USER_CREATED_EVENT_TYPE) {
            throw new common_1.BadRequestException(`expected event type "${USER_CREATED_EVENT_TYPE}"`);
        }
        const { first_name, last_name, id, image_url, email_addresses, primary_email_address_id } = evt.data;
        const email = (_a = email_addresses.find((email) => (email === null || email === void 0 ? void 0 : email.id) === primary_email_address_id)) === null || _a === void 0 ? void 0 : _a.email_address;
        if (!email) {
            throw new common_1.BadRequestException(`missing primary email address`);
        }
        const createUserDto = {
            name: `${first_name} ${last_name}`,
            clerkUuid: id,
            email,
        };
        if (await this.usersService.createUser(createUserDto)) {
            return {
                success: true,
                message: 'Webhook received and user created',
            };
        }
        else {
            throw new common_1.InternalServerErrorException('Webhook received, but encountered error when attempting to create user');
        }
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, common_1.Post)('webhooks/createuser'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "createUser", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], ApiController);
//# sourceMappingURL=api.controller.js.map