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
docker run --name redis-dev -p 6380:6379 -d redis
```

There is no persistence for tests. The open port is set to `6380` so that data isn't accidently smoked if the tests are run in production.

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

Currently an ad consists of JSON with `destination`, `image` URL, and `width`/`height` key/value pairs.

From the `redis-cli`:

```
redis:6379> lpush ads '{"destination":"https://isthisdank.com","image":"/images/isthisdank-leaderboard.jpg","width":780,"height":90}' 
```

## View click logs

```
redis:6379> lrange log:https://isthisdank.com 0 -1
```

