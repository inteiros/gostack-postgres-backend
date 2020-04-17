import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionRepository.getBalance();
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('excedendo o total disponivel!');
    }

    const categoryRepo = getRepository(Category);
    // checar se já existe
    let categ = await categoryRepo.findOne({
      where: { title: category },
    });
    if (!categ) {
      categ = categoryRepo.create({
        title: category,
      });
      await categoryRepo.save(categ);
    }
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categ.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
