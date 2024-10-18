"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express_1 = require("@clerk/express");
function printRoutes(app) {
    const server = app.getHttpServer();
    const router = server._events.request._router;
    const availableRoutes = router.stack
        .map((layer) => {
        var _a, _b;
        if (layer.route) {
            return {
                route: {
                    path: (_a = layer.route) === null || _a === void 0 ? void 0 : _a.path,
                    method: (_b = layer.route) === null || _b === void 0 ? void 0 : _b.stack[0].method,
                },
            };
        }
    })
        .filter((item) => item !== undefined);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    app.enableCors({ origin: '*' });
    app.use((0, express_1.clerkMiddleware)());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    await app.listen(process.env.PORT || 4000);
    printRoutes(app);
}
bootstrap();
//# sourceMappingURL=main.js.map