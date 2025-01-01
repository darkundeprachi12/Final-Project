const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data.map(transaction => ({
      ...transaction,
      dateOfSale: new Date(transaction.dateOfSale)
    }));
    await Transaction.insertMany(transactions);
    res.send('Database initialized with seed data');
  } catch (error) {
    console.error('Error initializing database', error);
    res.status(500).send('Error initializing database');
  }
};

exports.listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const query = {
    ...(month && { dateOfSale: { $gte: new Date(`${month} 01 2022`), $lt: new Date(`${month} 01 2022`).setMonth(new Date(`${month} 01 2022`).getMonth() + 1) } }),
    ...(search && {
      $or: [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { price: parseFloat(search) }
      ]
    })
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions', error);
    res.status(500).send('Error fetching transactions');
  }
};

exports.getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lt: endDate }
    });

    const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalNotSoldItems = transactions.length - totalSoldItems;

    res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    console.error('Error fetching statistics', error);
    res.status(500).send('Error fetching statistics');
  }
};

exports.getPriceRange = async (req, res) => {
  const { month } = req.query;

  try {
    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lt: endDate }
    });

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0
    };

    transactions.forEach(transaction => {
      if (transaction.price <= 100) priceRanges['0-100']++;
      else if (transaction.price <= 200) priceRanges['101-200']++;
      else if (transaction.price <= 300) priceRanges['201-300']++;
      else if (transaction.price <= 400) priceRanges['301-400']++;
      else if (transaction.price <= 500) priceRanges['401-500']++;
      else if (transaction.price <= 600) priceRanges['501-600']++;
      else if (transaction.price <= 700) priceRanges['601-700']++;
      else if (transaction.price <= 800) priceRanges['701-800']++;
      else if (transaction.price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    res.json(priceRanges);
  } catch (error) {
    console.error('Error fetching price ranges', error);
    res.status(500).send('Error fetching price ranges');
  }
};

exports.getCategories = async (req, res) => {
  const { month } = req.query;

  try {
    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lt: endDate }
    });

    const categoryCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});

    res.json(categoryCounts);
  } catch (error) {
    console.error('Error fetching categories', error);
    res.status(500).send('Error fetching categories');
  }
};

exports.getCombined = async (req, res) => {
  const { month } = req.query;

  try {
    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lt: endDate }
    });

    const statistics = {
      totalSaleAmount: transactions.reduce((sum, transaction) => sum + transaction.price, 0),
      totalSoldItems: transactions.filter(transaction => transaction.sold).length,
      totalNotSoldItems: transactions.length - transactions.filter(transaction => transaction.sold).length
    };

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0
    };

    transactions.forEach(transaction => {
      if (transaction.price <= 100) priceRanges['0-100']++;
      else if (transaction.price <= 200) priceRanges['101-200']++;
      else if (transaction.price <= 300) priceRanges['201-300']++;
      else if (transaction.price <= 400) priceRanges['301-400']++;
      else if (transaction.price <= 500) priceRanges['401-500']++;
      else if (transaction.price <= 600) priceRanges['501-600']++;
      else if (transaction.price <= 700) priceRanges['601-700']++;
      else if (transaction.price <= 800) priceRanges['701-800']++;
      else if (transaction.price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    const categoryCounts = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + 1;
      return acc;
    }, {});

    res.json({ transactions, statistics, priceRanges, categories: categoryCounts });
  } catch (error) {
    console.error('Error fetching combined data', error);
    res.status(500).send('Error fetching combined data');
  }
};
