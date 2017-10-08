# ad-tracker

API to serve up ads and track clicks

# Setup

```
npm install
```

# Tests

## Database

I'm a Docker fan. Set up a Redis container for development:

```
docker run --name redis-dev -p 6379:6379 -d redis
```

There is no persistence for tests.

## Jasmine

I use `jasmine` for testing. These are included in the package's development dependencies.
      
Run all the tests:

```
npm test
```
 
# Development

There's currently no abstracted method by which to add advertisements to the database. To do this with `redis-cli` on the Docker container:

```
docker run -it --link redis-dev:redis --rm redis redis-cli -h redis -p 6379
```

## Add an advertisement

Currently an ad consists of JSON with `destination`, `imageLg`, and `imageSm` key/value pairs.

From the `redis-cli`:

```
redis:6379> lpush ads '{"destination":"https://isthisdank.com","imageLg":"http://localhost:3001/ads/dank_lg.jpg","imageSm":"http://localhost:3001/ads/dank_sm.jpg"}' 
```


