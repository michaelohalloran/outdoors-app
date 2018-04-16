exports.DATABASE_URL = 'mongodb://localhost/outdoors-app';
exports.TEST_DATABASE_URL = 'mongodb://localhost/test-outdoors-app';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';