import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import { getRepository } from 'typeorm';
import Product from '../../typeorm/entities/Product';

export default class ProductsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, price, quantity } = request.body;

        const createProductService = container.resolve(CreateProductService);

        const product = await createProductService.execute({
            name,
            price,
            quantity,
        });

        return response.json(product);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.body;

        const productsRepository = getRepository(Product);

        const product = await productsRepository.findOne(id);
        console.log(product);

        return response.json(product);
    }
}
