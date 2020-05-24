import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
    ManyToOne,
    JoinTable,
    ManyToMany,
    Column,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity({ name: 'orders' })
class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Customer, {
        eager: true,
    })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column()
    customer_id: string;

    // @ManyToMany(() => OrdersProducts, {
    //     cascade: true,
    // })
    // @JoinTable({
    //     name: 'orders_products',
    //     inverseJoinColumn: { name: 'order_id' },
    //     joinColumn: { name: 'id' },
    // })
    @OneToMany(() => OrdersProducts, order_products => order_products.order, {
        cascade: true,
        eager: true,
    })
    order_products: OrdersProducts[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Order;
