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
 
