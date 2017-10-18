'use strict';                  
                               
const app = require('../../app');  
const request = require('request');  
const db = require('../../db/config');
      
const Browser = require('zombie');
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 
Browser.localhost('example.com', PORT);

describe('ad script', () => {

  let browser, document, ad1, ad2;
  beforeEach((done) => {
    browser = new Browser({ waitDuration: '30s' });
    //browser.debug();

    ad1 = JSON.stringify({ destination: 'https://isthisdank.com',
                           image: 'http://localhost:3001/images/isthisdank-leaderboard.jpg',
                           width: 728,
                           height: 90 });
    ad2 = JSON.stringify({ destination: 'https://recyclefreedom.com',
                           image: 'http://localhost:3001/ads/recycle_lg.jpg',
                           width: 150,
                           height: 150 });
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

  it('retrieves ad details from the queue and renders the link and image on the page', (done) => {
    browser.on('loaded', (doc) => {
      document = doc;

      document.addEventListener('ad-tracker-done', function listener(e) {
        e.target.removeEventListener(e.type, listener);
        browser.assert.element(`.ad-tracker a[href="/count?dest=${encodeURIComponent('https://isthisdank.com')}"]`);
        browser.assert.style('.ad-tracker a button', 'background-image', 'url(http://localhost:3001/images/isthisdank-leaderboard.jpg)');
        done();
      });
    });

    browser.visit('/test.html', (err) => {
      if (err) done.fail(err);
      browser.assert.success();
    });   
  });

  it('renders button with appropriate height with the ad as the background image', (done) => {
    browser.on('loaded', (doc) => {
      document = doc;

      document.addEventListener('ad-tracker-done', function listener(e) {
        e.target.removeEventListener(e.type, listener);

        let adDiv = document.querySelector('.ad-tracker');
        // The offset tests affirm something about zombie... the elements don't
        // appear to be actually rendered. The ad size is dynamic depending on
        // screen size, so this covers what should be an impossible scenarios.
        // There are currently no tests to affirm that the image is resized to
        // something appropriate for the screen
        expect(adDiv.offsetWidth).toEqual(0); 
        expect(adDiv.offsetHeight).toEqual(0); 
        expect(adDiv.style.width).toEqual('728px'); 
        expect(adDiv.style.height).toEqual('90px'); 

        let adButton = document.querySelector('.ad-tracker a button');
        expect(adButton.style.backgroundImage).toEqual(`url(${JSON.parse(ad1).image})`); 
        expect(adButton.style.backgroundColor).toEqual('rgb(0, 0, 0)'); 
        expect(adButton.style.backgroundRepeat).toEqual('no-repeat'); 
        expect(adButton.style.backgroundSize).toEqual('contain'); 
        expect(adButton.style.backgroundPosition).toEqual('center'); 
        expect(adButton.style.width).toEqual('100%'); 
        expect(adButton.style.height).toEqual('100%'); 
        done();
      });
    });

    browser.visit('/test.html', (err) => {
      if (err) done.fail(err);
      browser.assert.success();
    });
  });
});

