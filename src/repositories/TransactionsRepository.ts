import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
const sumIn = (acc: number, cv: Transaction): number => {
  if (cv.type === 'income') {
    return acc + cv.value;
  }
  return acc + 0;
};

const sumOut = (acc: number, cv: Transaction): number => {
  if (cv.type === 'outcome') {
    return acc + cv.value;
  }
  return acc + 0;
};

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const trans = await transactionsRepository.find();

    const income = trans.reduce(sumIn, 0);
    const outcome = trans.reduce(sumOut, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
