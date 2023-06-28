const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");

axios
    .get("https://cdn.adimo.co/clients/Adimo/test/index.html")
    .then(response => {
        const dom = new JSDOM(response.data);

        const products = [];

        const items = dom.window.document.querySelectorAll(".item");
        items.forEach(item => {
            const title = item.querySelector("h1").textContent.trim();
            const imageURL = item.querySelector("img").src;
            const price = parseFloat(item.querySelector(".price").textContent.trim().replace('£', ''));

            products.push({
                title,
                imageURL,
                price
            });
        });

        const totalItems = products.length;
        const totalPrice = products.reduce(
            (sum, product) => sum + product.price,
            0
        );
        const averagePrice = totalPrice / totalItems;

        const data = {
            products,
            totalItems,
            averagePrice
        };

        const jsonData = JSON.stringify(data, null, 2);

        fs.writeFile("products.json", jsonData, err => {
            if (err) {
              console.error(err);
            }
        });
    })
    .catch(error => {
        console.log("Error:", error);
    });
