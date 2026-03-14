// Export tất cả models từ một điểm duy nhất
// Sử dụng: import { User, Category, Product, Supplier, Transaction, Order, Expense, Cart } from './models';

export { User } from './User';
export type { IUser } from './User';

export { Category } from './Category';
export type { ICategory } from './Category';

export { Product } from './Product';
export type { IProduct } from './Product';

export { Supplier } from './Supplier';
export type { ISupplier, IBankAccount } from './Supplier';

export { Transaction } from './Transaction';
export type { ITransaction, ITransactionItem } from './Transaction';

export { Order } from './Order';
export type { IOrder, IOrderCustomer, IOrderItem, IStatusHistory } from './Order';

export { Expense } from './Expense';
export type { IExpense } from './Expense';

export { Cart } from './Cart';
export type { ICart, ICartItem } from './Cart';
