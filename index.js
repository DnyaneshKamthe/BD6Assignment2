const express = require('express');
const { resolve } = require('path');

const app = express();

app.use(express.static('static'));
app.use(express.json());

//data
let stocks = [
  { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
  { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
  { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
];

let trades = [
  { tradeId: 1, stockId: 1, quantity: 10, tradeType: 'buy', tradeDate: '2024-08-07' },
  { tradeId: 2, stockId: 2, quantity: 5, tradeType: 'sell', tradeDate: '2024-08-06' },
  { tradeId: 3, stockId: 3, quantity: 7, tradeType: 'buy', tradeDate: '2024-08-05' },
];

//functions
function getAllStocks(){
  return stocks;
}

function getStockByTicker(ticker){
  let result = stocks.find(stock => stock.ticker === ticker.toUpperCase());
  return result;
}

function addTrade(trade){
  let newTrade = { tradeId : trades.length + 1, ...trade};
  trades.push(newTrade);
  return newTrade;
}

function validateTrade(trade){
  if(!trade.stockId || typeof trade.stockId !== 'number'){
    return 'Stock id is required and should be a number'
  }

  if(!trade.quantity || typeof trade.quantity !== 'number'){
    return 'Quantity is required and should be a number'
  }

  if(!trade.tradeType || typeof trade.tradeType !== 'string'){
    return 'Trade type is required and should be a string'
  }

  if(!trade.tradeDate || typeof trade.tradeDate !== 'string'){
    return 'Trade date is required and should be a string'
  }

  return null;

}

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get("/stocks", (req, res) => {
  try {
    let result = getAllStocks();
    if(result.length === 0){
      return res.status(404).json({error :"No stocks found"});
    }
    return res.status(200).json({stocks : result});
  } catch (error) {
    return res.status(500).json({error : "Internal server error"})
  }
})

app.get("/stocks/:ticker",(req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const result = getStockByTicker(ticker);
    if (!result) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    return res.status(200).json({stock : result});
  } catch (error) {
    return res.status(500).json({error : "Internal server error"})
  }
})

app.post("/trades/new",(req, res) => {
  try {
    let err = validateTrade(req.body);
    if(err) res.status(400).send(err);

    let result = addTrade(req.body);
    if(!result){
      return res.status(404).json({error : 'Could not add trade'})
    }
    return res.status(201).json({trade : result});
  } catch (error) {
    return res.status(500).json({error : "Internal server error"})
  }
})




module.exports = { app, getAllStocks, getStockByTicker, addTrade, validateTrade}
