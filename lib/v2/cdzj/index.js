const { parseDate } = require('@/utils/parse-date');
const cheerio = require('cheerio');

const url = 'https://zw.cdzjryb.com/hsiprentc_portal/#/main/func/accouncement';

module.exports = async (ctx) => {
    const browser = await require('@/utils/puppeteer')({ stealth: true });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle0',
    });
    const content = await page.content();
    await browser.close();

    const $ = cheerio.load(content);
    const list = $('tr.ant-table-row');

    const out = $(list)
        .map((_, item) => {
            item = $(item);
            const newsTitle = item.find('td').eq(0).text().trimEnd();
            const newsLink = url;
            const newsPubDate = parseDate(item.find('td').eq(3).text());
            const newsDescript = '区域：' + item.find('td').eq(1).text().trimEnd() + '&#xA;类型：' + item.find('td').eq(2).text().trimEnd() + '&#xA;发布时间：' + item.find('td').eq(3).text().trimEnd();
            return {
                title: newsTitle,
                link: newsLink,
                pubDate: newsPubDate,
                description: newsDescript,
            };
        })
        .get();
    ctx.state.data = {
        title: `cdzj`,
        link: url,
        description: 'cdzj_des',
        item: out,
    };
};
