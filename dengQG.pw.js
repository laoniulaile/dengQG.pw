//登录学习强国二维码，扫码后存取cookie，否则4分钟后退出。
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 导航到指定页面
        await page.goto('https://pc.xuexi.cn/points/login.html');

        // 等待页面加载完成（根据需要可以选择是否使用）
        // await page.waitForTimeout(5000);
        // 或者使用更精确的等待条件
        // await page.waitForLoadState('networkidle');

        // 在页面中移除特定元素
        await page.evaluate(() => {
            const element1 = document.querySelector('.redflag-2');
            if (element1) {
                element1.remove();
            }
            const element2 = document.querySelector('img');
            if (element2) {
                element2.remove();
            }
        });

        // 获取当前日期和时间，并设置为页面元素的文本内容
        const currentDate = new Date();
        const currentDateTime = currentDate.toLocaleString();
        await page.evaluate((dateTime) => {
            const refreshSpan = document.querySelector('.refresh');
            if (refreshSpan) {
                refreshSpan.innerText = dateTime;
            }
        }, currentDateTime);

        await page.waitForTimeout(10000);

        // 捕获屏幕截图
        await page.screenshot({ path: './screenshot.png' });

        // 等待URL变化到指定页面，或超时处理
        await page.waitForURL('https://pc.xuexi.cn/points/my-study.html', { timeout: 240000 });

        // 保存Cookies
        const cookies = await context.cookies();
        fs.writeFileSync('./qianguocookies1.json', JSON.stringify(cookies));

        console.log('Screenshot taken and cookies saved successfully!');
    } catch (error) {
        console.error('4分钟中内未扫描登录：An error occurred:', error);
    } finally {
        // 清理资源
        await page.close();
        await context.close();
        await browser.close();
    }
})();