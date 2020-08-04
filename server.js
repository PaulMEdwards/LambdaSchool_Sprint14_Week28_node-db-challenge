const express = require('express');

const server = express();
server.use(express.json());

const projectRouter = require('./API/projects-router.js');
server.use('/api/projects', projectRouter);

const resourceRouter = require('./API/resources-router.js');
server.use('/api/resources', resourceRouter);

module.exports = server;
