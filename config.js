exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://dev:dinosaur@ds153689.mlab.com:53689/my-rex';
exports.PORT = process.env.PORT || 8080;