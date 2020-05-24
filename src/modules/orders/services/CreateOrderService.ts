import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
    id: string;
    quantity: number;
}

interface IRequest {
    customer_id: string;
    products: IProduct[];
}

@injectable()
class CreateOrderService {
    constructor(
        @inject('OrdersRepository')
        private ordersRepository: IOrdersRepository,
        @inject('ProductsRepository')
        private productsRepository: IProductsRepository,
        @inject('CustomersRepository')
        private customersRepository: ICustomersRepository,
    ) {}

    public async execute({ customer_id, products }: IRequest): Promise<Order> {
        const customer = await this.customersRepository.findById(customer_id);
        if (!customer) {
            throw new AppError('Customer no found', 400);
        }

        const findProducts = await this.productsRepository.findAllById(
            products,
        );

        if (findProducts.length !== products.length) {
            throw new AppError('Invalid products');
        }

        findProducts.forEach((product, index) => {
            if (product.quantity < products[index].quantity) {
                throw new AppError('Insufficient quantity');
            }
        });

        const productsToUpdate = findProducts.map((product, index) => {
            const update = {
                id: product.id,
                quantity: product.quantity - products[index].quantity,
            };
            return update;
        });

        await this.productsRepository.updateQuantity(productsToUpdate);

        const productsToBuy = findProducts.map((product, index) => ({
            product_id: product.id,
            price: product.price,
            quantity: products[index].quantity,
        }));

        const order = await this.ordersRepository.create({
            customer,
            products: productsToBuy,
        });

        return order;
    }
}

export default CreateOrderService;
