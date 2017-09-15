const cheerio = require('cheerio')
const request = require('superagent');
const https = require('https');

function converter(options) {
    
return new Promise(function (resolve, reject) {
    https.get("https://cex.io/api/last_price/BTC/USD", (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var amounto = JSON.parse(data).lprice;//3500USD - 1 BTC

            
                const source = 'https://finance.google.com/finance/converter'
                const queryString = {
                    a: amounto,
                    from: "USD",
                    to: options.to
                }
                request
                    .get(source)
                    .query(queryString)
                    .end(function (error, response) {
                        const $ = cheerio.load(response.text, {
                            normalizeWhitespace: true
                        })
                        const fromResult = $("select[name='from']").val()
                        const toResult = $("select[name='to']").val()
                        const amountResult = $("input[name='a']").val()
                        const converted = $('#currency_converter_result .bld').text()

                        if (!error && response.statusCode == 200) {
                            resolve({
                                from: fromResult,
                                to: toResult,
                                amount: parseFloat(amountResult),
                                converted: parseFloat(converted) || parseFloat(amountResult),
                                url: response.req.url
                            })
                        } else {
                            reject(error);
                        }
                    })
        
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });


    });///

}

module.exports = converter
