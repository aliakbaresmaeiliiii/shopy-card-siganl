"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
        this.product = [];
    }
    async findAll() {
        return this.prisma.product.findMany();
    }
    async create(data) {
        return this.prisma.product.create({
            data,
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map