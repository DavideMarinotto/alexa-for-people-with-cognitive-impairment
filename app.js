var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin.routes');
var standardRouter = require('./routes/standard.routes');
var authRouter = require('./routes/auth.routes');
var scheduleRouter = require('./routes/schedule.routes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/standard', standardRouter);
app.use('/auth', authRouter);
app.use('/schedule', scheduleRouter);

module.exports = app;
