import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const transaction = transactionRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
