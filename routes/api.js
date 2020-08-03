/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var fetch = require("node-fetch");
var stockData = require("../models").stockData;

async function fetchingStockData(stockName) {
  const parsingUrl = await fetch(
    `https://repeated-alpaca.glitch.me/v1/stock/${stockName}/quote`
  );
  const fetchingData = await parsingUrl.json();
  return fetchingData;
}

async function updateStock(symbol, ip, like) {
  await stockData.findOne({ symbol: symbol }).then((data) => {
    if (data && data.ip.indexOf(ip) != -1) {
      data.like = like;
      return data.save();
    } else {
      var addStock = new stockData({
        symbol: symbol,
        like: like,
        ip: ip,
      });
      return addStock.save();
    }
  });
}

function countLikes(symbol) {
  stockData.find({ symbol: symbol, like: true }).then((data) => {
    console.log(data.length);
    var count = data.length;
    return count;
  });
}

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    const ip = "127.0.0.20";

    if (stock.length == 2) {
      var result = [];
      for (let i = 0; i < stock.length; i++) {
        var { symbol, latestPrice } = await fetchingStockData(
          stock[i].toUpperCase()
        );
        var updating = await updateStock(symbol.toUpperCase(), ip, like);
        var likes = await countLikes(symbol.toUpperCase());
        result.push({
          stock: symbol,
          price: latestPrice,
          rel_likes: likes || 0,
        });
      }
      var likesFirst = result[0].rel_likes;
      var likesSecond = result[1].rel_likes;
      console.log(likesFirst, likesSecond);
      result[0].rel_likes = likesFirst - likesSecond;
      result[1].rel_likes = likesSecond - likesFirst;
      res.json({ stockData: result });
    } else {
      var { symbol, latestPrice } = await fetchingStockData(
        stock.toUpperCase()
      );
      var updated = await updateStock(stock.toUpperCase(), ip, like);
      var likes = countLikes(stock.toUpperCase());
      return res.json({
        stockData: { stock: symbol, price: latestPrice, likes: likes },
      });
    }
  });
};

// var updated = await updateStock(stock.toUpperCase(), ip, like);
//       var likes = countLikes(stock.toUpperCase());
//       return res.json({
//         stockData: { stock: symbol, price: latestPrice, likes: likes || 0 },
//       });
