'use strict';                  
                               
const app = require('../../app');  
const request = require('request');  
const db = require('../../db/config');
      
const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001; 

describe('ad tracker API', () => {

  beforeEach((done) => {
    done();
  });

  afterEach((done) => {
    db.flushdb(() => {
      done();
    });
  });

  describe('GET /count', () => {
    it('returns a 302 status code and redirects to destination', (done) => {
      // Set the headers
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      
      // Configure the request
      let options = {
        url: 'http://localhost:3001/count',
        method: 'GET',
        headers: headers,
        followRedirect: false,
        qs: { 'dest': 'https://isthisdank.com' }
      }
  
      // Start the request
      request(options, (error, response, body) => {
        if (error) {
          done.fail();
        }
        expect(response.statusCode).toEqual(302);
        expect(response.headers.location).toEqual('https://isthisdank.com');
        done();
      });
    });
  
    it('records the referer page, IP, and time of the request', (done) => {
      // Set the headers
      let headers = {
        'Referer': 'http://example.com',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      
      // Configure the request
      let options = {
        url: 'http://localhost:3001/count',
        method: 'GET',
        headers: headers,
        followRedirect: false,
        qs: { 'dest': 'https://isthisdank.com' }
      }
  
      // Start the request
      request(options, (error, response, body) => {
        if (error) {
          done.fail();
        }
  
        db.lrange('log:https://isthisdank.com', 0, -1, (err, results) => {
          if (error) {
            done.fail();
          }
          expect(results.length).toEqual(1);
          results = JSON.parse(results[0]);
          expect(results.referer).toEqual('http://example.com');
          expect(results.time).not.toEqual(null);
          expect(results.ip).toEqual('127.0.0.1');
  
          done();
        });
      });
    }); 
  }); 

  describe('GET /next', () => {
    let ad1, ad2;
    beforeEach((done) => {
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

    it('returns JSON with ad image and destination keys', (done) => {
      // Set the headers
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      
      // Configure the request
      let options = {
        url: 'http://localhost:3001/next',
        method: 'GET',
        headers: headers
      }
  
      // Start the request
      request(options, (error, response, body) => {
        if (error) {
          done.fail();
        }
        let json = JSON.parse(body);
        ad1 = JSON.parse(ad1);
        expect(json.destination).toEqual(ad1.destination);
        expect(json.imageLg).toEqual(ad1.imageLg);
        expect(json.imageSm).toEqual(ad1.imageSm);
        done();
      });
    });

    it('loops through the tracked ads', (done) => {
      // Set the headers
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      
      // Configure the request
      let options = {
        url: 'http://localhost:3001/next',
        method: 'GET',
        headers: headers
      }
  
      // Start the request
      request(options, (error, response, body) => {
        if (error) {
          done.fail();
        }
        expect(body).toEqual(ad1);
        request(options, (error, response, body) => {
          if (error) {
            done.fail();
          }
          expect(body).toEqual(ad2);
  
          request(options, (error, response, body) => {
            if (error) {
              done.fail();
            }
            expect(body).toEqual(ad1);
    
            done();
          });
        });
      });
    });
  });
});

