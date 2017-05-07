const {ipcMain} = require('electron')
const cheerio = require('cheerio')
const fetch = require('electron-fetch')
const fs = require('fs')
const url = require('url')

const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:53.0) Gecko/20100101 Firefox/53.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie': 'yunsuo_session_verify=4bd01c82ea4fe4326cd59579cf1d5df4; WMwh_2132_saltkey=uFGY7f5y; WMwh_2132_lastvisit=1493910682; WMwh_2132_lastact=1493917776%09misc.php%09secqaa; Hm_lvt_acfaccaaa388521ba7e29a5e15cf85ad=1493914437,1493916732; UM_distinctid=15bd43d4691187-043170bfbf77b9-49536b-384000-15bd43d46923bb; CNZZDATA1254190848=1451928094-1493909802-%7C1493915202; WMwh_2132_forum_lastvisit=D_220_1493917775; HstCfa2810755=1493914445710; HstCla2810755=1493917929973; HstCmu2810755=1493914445710; HstPn2810755=4; HstPt2810755=4; HstCnv2810755=1; HstCns2810755=3; Hm_lpvt_acfaccaaa388521ba7e29a5e15cf85ad=1493917930; WMwh_2132_st_t=0%7C1493917775%7C700e1ca011de00c63b841ff2fcef1f1b; WMwh_2132_secqaa=609924.4b435aa0d9fe581334'
}

function regIPCMessage() {
    ipcMain.on('search', (event, args) => {
        console.log(args);
        let u = args.url.replace('{0}', args.pageIndex);
        let urlObj = url.parse(u)
        fetch(u, {
            method: 'GET',
            headers: headers
        })
            .then(resp => resp.text())
            .then(body => {
                    let $ = cheerio.load(body);
                    let data = [];
                    $(args.inSelector).find('a' + args.aSelector).each((idx, element) => {
                        let $element = $(element);
                        if ($element.attr('href').indexOf('thread') === -1)
                            return;
                        let title = $element.text();
                        if (title.indexOf(args.keyword) > 0) {
                            let href = $element.attr('href');
                            if (url[0] === '/') {
                                href = u.protocol + '//' + u.host + '/' + href;
                            } else {
                                href = u.substring(0, u.lastIndexOf('/') + 1) + href;
                            }
                            let obj = {
                                title,
                                url: href
                            }
                            data.push(obj);
                        }
                    });
                    event.sender.send('search', {
                        pageIndex: args.pageIndex,
                        data: data
                    });
                }
            ).catch(err => {
            event.sender.send('search', {
                pageIndex: args.pageIndex,
                err: err
            })
        })
    });

    ipcMain.on('saveSettings', (event, args) => {
        let json = JSON.stringify(args);
        fs.writeFile('settings.json', json, 'utf8', (err) => {
            if (err) throw err;
            console.log('save settings.json successed')
        })
    });

    ipcMain.on('readSettings', (event, args) => {
        fs.readFile('settings.json', 'utf8', (err, data) => {
            if (err) {
                return;
            }
            event.sender.send('readSettings', JSON.parse(data));
        })
    })
}

module.exports = regIPCMessage