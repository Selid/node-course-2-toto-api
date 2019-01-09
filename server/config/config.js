var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoApp";
    process.env.PORT = 3000;
} else if (env === 'test') {
    process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoAppTest";
    process.env.PORT = 3000;
}