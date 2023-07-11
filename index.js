const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// URL of the website to scrape
const url = 'https://www.wellsfargo.com/locator/search/?searchTxt=Leawood';

// Make a GET request to the website
axios
    .get(url)
    .then((response) => {
        if (response.status === 200) {
            // Load the HTML content using cheerio
            const $ = cheerio.load(response.data);

            // Use CSS selectors to scrape the desired data
            const branchNames = [],
                branchStreetAddresses = [],
                branchLocality = [],
                branchRegion = [],
                branchPostalCode = [],
                branchCompleteAddress = [],
                branchTelephone = [];
            $('.adr .fn').each((index, element) => {
                branchNames.push($(element).text());
            });
            $('.adr .street-address').each((index, element) => {
                branchStreetAddresses.push($(element).text());
            });
            $('.adr .locality').each((index, element) => {
                branchLocality.push($(element).text());
            });
            $('.adr .region').each((index, element) => {
                branchRegion.push($(element).text());
            });
            $('.adr .postal-code').each((index, element) => {
                branchPostalCode.push($(element).text());
            });
            $('.aResult').each((index, element) => {
                console.log($(element));
            });

            for (let i = 0; i < branchStreetAddresses.length; i++) {
                branchCompleteAddress.push(
                    branchStreetAddresses[i] +
                        ' ' +
                        branchLocality[i] +
                        ', ' +
                        branchRegion[i] +
                        ', ' +
                        branchPostalCode[i]
                );
            }

            $('.tel').each((index, element) => {
                let str = $(element).text().trim();
                let newStr = str.replace(str.substring(0, 7), '');
                branchTelephone.push(newStr);
            });

            // Output the scraped data
            console.log('Branch Names: ', branchNames);
            console.log('Branch Complete Address: ', branchCompleteAddress);
            console.log('Branch Telephone: ', branchTelephone);
        } else {
            console.log('Failed to retrieve the website content');
        }
    })
    .catch((error) => {
        console.log('An error occurred:', error);
    });

// Data to be saved in the CSV file
const data = [
    ['Name', 'Age', 'Email'],
    ['John Doe', 30, 'johndoe@example.com'],
    ['Jane Smith', 25, 'janesmith@example.com'],
];

// Convert the data to CSV format
const csvContent = data.map((row) => row.join(',')).join('\n');

// Specify the file path
const filePath = 'data.csv';

// Write the CSV content to the file
fs.writeFile(filePath, csvContent, 'utf8', (err) => {
    if (err) {
        console.error('An error occurred while writing the file:', err);
    } else {
        console.log('Data saved to', filePath);
    }
});
