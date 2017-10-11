'use strict';                  
                               
const app = require('../../app');  
const request = require('request');  
const db = require('../../db/config');
const moment = require('moment');
      
const Browser = require('zombie');
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 
Browser.localhost('example.com', PORT);

describe('app', () => {

  let browser, document, click1, click2;
  beforeEach((done) => {
    browser = new Browser({ waitDuration: '30s', loadCss: false });
    //browser.debug();

    // document
    browser.on('loaded', (doc) => {
      document = doc;
      done();
    });
 
    click1 = JSON.stringify({ referer: 'http://example.com',
                              ip: '127.0.0.1', time: moment().format('MMMM Do YYYY, h:mm:ss a') });
    click2 = JSON.stringify({ referer: 'http://anotherexample.com',
                              ip: '69.69.69.69', time: moment().format('MMMM Do YYYY, h:mm:ss a') });

    db.lpush('log:https://isthisdank.com', click1, (err, result) => {
      if (err) {
        done.fail();
      }
      db.lpush('log:https://recyclefreedom.com', click2, (err, result) => {
        if (err) {
          done.fail();
        }
        browser.visit('/', (err) => {
          if (err) done.fail(err);
          browser.assert.success();
        });
      });
    });
  });

  afterEach((done) => {
    db.flushdb(() => {
      done();
    });
  });

  it('displays a list of recent clicks', (done) => {
    browser.assert.text('article.property:nth-child(1) header h1', 'https://isthisdank.com');
    browser.assert.text('article.property:nth-child(1) section .referer', 'http://example.com');
    browser.assert.text('article.property:nth-child(1) section .ip', '127.0.0.1');
    browser.assert.element('article.property:nth-child(1) section .time');

    browser.assert.text('article.property:nth-child(2) header h1', 'https://recyclefreedom.com');
    browser.assert.text('article.property:nth-child(2) section .referer', 'http://anotherexample.com');
    browser.assert.text('article.property:nth-child(2) section .ip', '69.69.69.69');
    browser.assert.element('article.property:nth-child(2) section .time');
 
    done();
  });
});

