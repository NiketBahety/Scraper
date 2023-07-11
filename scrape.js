const puppeteer = require('puppeteer');

const scrape = async (city) => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto(
        `https://www.wellsfargo.com/locator/search/?searchTxt=${city}`
    );
    const len = await page.evaluate(() => {
        return (
            Array.from(
                document.querySelectorAll('#searchResultsList')[0].children
            ).length - 1
        );
    });
    for (let j = 1; j <= len; j++) {
        await page.goto(
            `https://www.wellsfargo.com/locator/bank/?slindex=${j}`
        );
        // await page.screenshot({ path: '1.png' });
        const data = await page.evaluate(() => {
            let branchInfo = {};
            branchInfo.name = document
                .querySelectorAll('.adr .fn')[0]
                .innerHTML.trim();
            branchInfo.address =
                document
                    .querySelectorAll('.adr .street-address')[0]
                    .previousElementSibling.innerHTML.trim() +
                ' ' +
                document
                    .querySelectorAll('.adr .locality')[0]
                    .innerHTML.trim() +
                ', ' +
                document.querySelectorAll('.adr .region')[0].innerHTML.trim() +
                ', ' +
                document
                    .querySelectorAll('.adr .postal-code')[0]
                    .innerHTML.trim();

            branchInfo.phone = document
                .querySelectorAll('.tel')[0]
                .innerHTML.trim();

            branchInfo.facilities = [];
            Array.from(
                document.querySelectorAll('.innerLeft ul')[1].children
            ).map((el) => {
                if (el.innerHTML.trim().substring(0, 6) == 'Notary')
                    branchInfo.facilities.push('Notary');
                else branchInfo.facilities.push(el.innerHTML.trim());
            });

            return branchInfo;
        });
        console.log(data);
    }

    await browser.close();
};

scrape('Leawood');
