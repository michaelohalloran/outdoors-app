exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://outdoorsman:deere45678@ds247619.mlab.com:47619/outdoors-app';
// 'mongodb://outdoorsman:deere45678@ds247619.mlab.com:47619/outdoors-app';
// exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/outdoors-app';
//pre mLab connection: 'mongodb://localhost/outdoors-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-outdoors-app';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';