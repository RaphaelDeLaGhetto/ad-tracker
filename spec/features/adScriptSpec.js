'use strict';                  
                               
const app = require('../../app');  
const request = require('request');  
const db = require('redis').createClient();
      
const Browser = require('zombie');
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 
Browser.localhost('example.com', PORT);

describe('ad script', () => {

  let browser, document, ad1, ad2;
  beforeEach((done) => {
    browser = new Browser({ waitDuration: '30s', loadCss: false });
    //browser.debug();

    // document
//    browser.on('loaded', (doc) => {
//      document = doc;
//
////      document.addEventListener('done-react', function listener(e) {
////        e.target.removeEventListener(e.type, listener);
//        done();
////      });
//    });
 
    ad1 = JSON.stringify({ destination: 'https://isthisdank.com',
                           imageLg: 'http://localhost:3001/ads/dank_lg.jpg',
                           imageSm: 'http://localhost:3001/ads/dank_sm.jpg' });
    ad2 = JSON.stringify({ destination: 'https://recyclefreedom.com',
                           imageLg: 'http://localhost:3001/ads/recycle_lg.jpg',
                           imageSm: 'http://localhost:3001/ads/recycle_sm.jpg' });
    db.lpush('ads', [ad1, ad2], (err, results) => {
      if (err) {
        done.fail();
      }
      done();
    });
  });

  afterEach((done) => {
    db.flushdb(() => {
      done();
    });
  });

  it('retrieves ad details from the queue and renders it on the page', (done) => {
    browser.on('loaded', (doc) => {
      document = doc;

      document.addEventListener('ad-tracker-done', function listener(e) {
        e.target.removeEventListener(e.type, listener);
        browser.assert.element(`.ad-tracker a[href="/count?dest=${encodeURIComponent('https://isthisdank.com')}"] img[src="http://localhost:3001/ads/dank_lg.jpg"]`);
        done();
      });
    });

    browser.visit('/test.html', (err) => {
      if (err) done.fail(err);
      browser.assert.success();
    });   
  });

});

