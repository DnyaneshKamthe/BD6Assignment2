const  { app, getAllStocks, getStockByTicker, addTrade, validateTrade} = require("../index")
const http = require("http");
const request = require('supertest');


jest.mock("../index.js", ()=>({
    ...jest.requireActual("../index.js"),
    getAllStocks : jest.fn(),
    getStockByTicker: jest.fn(),
    addTrade : jest.fn(),
    validateTrade : jest.fn()
}))


let server;
beforeAll((done)=>{
    server = http.createServer(app);
    server.listen(3001, done)
})

afterAll((done) => {
    server.close(done)
})

describe("API testing", () => {
    beforeEach(()=>{
        jest.clearAllMocks();
    })

    it("should return list of stocks", async()=>{
        let mockStocks = [
            { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
            { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
            { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
          ];
        getAllStocks.mockResolvedValue(mockStocks);

        let result = await request(server).get("/stocks");
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({stocks :mockStocks})
       
    })

    it("should return stock by ticker", async()=>{
        let mockStock =   { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 };
        getStockByTicker.mockResolvedValue(mockStock);

        let result = await request(server).get("/stocks/AAPL");
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({stock :mockStock})
    })

    it("should add new trade", async() => {
        let mockTrade = {
            tradeId : 4,
            stockId: 1,
            quantity: 15,
            tradeType: 'buy',
            tradeDate: '2024-08-08'
        }

        addTrade.mockResolvedValue(mockTrade);
        let result = await request(server).post("/trades/new").send({  
            stockId: 1,
            quantity: 15,
            tradeType: 'buy',
            tradeDate: '2024-08-08'
        })
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual({trade:mockTrade})
    })

    it("should not return stock for invalid ticker", async()=>{
        getStockByTicker.mockResolvedValue(null);
        let result = await request(server).get("/stocks/random");
        expect(result.statusCode).toBe(404)
        expect(result.body.error).toEqual('Stock not found')
    })

    it("Validate function validateTrade correctly", async()=>{
        let result = await request(server).post("/trades/new").send({ stockId: 1, quantity: 15, tradeType: 'buy',})
        expect(result.statusCode).toBe(400)
        expect(result.text).toEqual('Trade date is required and should be a string')
    })
})

describe("Testing functions", () => {
    beforeEach(()=>{
        jest.clearAllMocks();
    })

    it("should call getAllStocks directly and return the list of all stocks", () => {
        let mockStocks =  [
            { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
            { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.10 },
            { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.50 },
          ];
        
        getAllStocks.mockReturnValue(mockStocks);
    
        let result = getAllStocks();
        expect(result).toEqual(mockStocks);
        expect(getAllStocks).toHaveBeenCalledTimes(1);
    });

    it("should add a new trade and return the expected output", async () => {
        const newTrade = {
            tradeId : 4,
            stockId: 1,
            quantity: 15,
            tradeType: 'buy',
            tradeDate: '2024-08-08'
        };
        
        addTrade.mockResolvedValue(newShow);
        const result = await request(server).post("/trades/new").send({  
            stockId: 1,
            quantity: 15,
            tradeType: 'buy',
            tradeDate: '2024-08-08'
        })
        expect(result.statusCode).toBe(201);
        expect(result.body.trade.stockId).toEqual(1);
    });
})