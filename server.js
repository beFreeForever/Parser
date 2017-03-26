class ModelContext {
    constructor(nameList, priceList) {

    }
}

function parseModel() {
    var modelContext = new ModelContext(undefined, undefined);

    var request = require("request"),
        cheerio = require("cheerio");
    url = "http://www.mercedes-benz.ru/content/russia/mpc/mpc_russia_website/ru/home_mpc/passengercars/home/new_cars/model_overview.html"

    request(url, function (error, response, body) {
        var nameList = [];
        var priceList = [];
        if (!error) {
            var $ = cheerio.load(body);
            $('[class= "clearfix ms-showroom-size"]').find('li').each(function (i, el) {
                $(el).find('li').each(function (j, element) {
                    var currentElementName = $(element).find('a > p').text();
                    var currentElementPrice = $(element).find('li > p').text();
                    if ((i + j) != 32 && (i + j) != 31 || currentElementName === null && currentElementPrice == undefined || currentElementName == "V-Класс" && currentElementPrice == "V-Класс") {
                        nameList[i + j] = currentElementName;
                        priceList[i + j] = currentElementPrice;
                    }
                })
            });
            for (i = 0; i < nameList.length; i++) {
                console.log(nameList[i] + " : " + priceList[i]);
            }
            modelContext.nameList = nameList;
            modelContext.priceList = priceList;
        } else {
            console.log("Error: " + error);
        }
    });
    return new ModelContext(nameList, priceList);
}

//nameList почему то не определен
function createTable(nameList, priceList) {
    var htmlString = "<table><tr><td>ClassName</td><td>Price</td></tr>";
    for (i = 0; i < namelist.length; i++) {
        htmlString += '<tr><td>' + nameList[i] + '</td><td>' + priceList[i] + '</td></tr>';
    }
    htmlString += " </table>";
    return htmlString;
}

var express = require('express');
var app = express();

// http://localhost:8080/
app.get('/', function (req, res) {
    var modelContext = parseModel();
    res.write('<html><head></head><body>');
    res.write(createTable(modelContext.nameList, modelContext.priceList));
    res.end('</body></html>');
});
app.listen(8080);
console.log('Start server');