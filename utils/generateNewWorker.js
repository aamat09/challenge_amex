const { Worker } = require('worker_threads');
const path = require('path');
const requestTracker = require('./requestTracker');

const generateNewWorker = (workerName) => {
  const worker = new Worker(path.join(__dirname, '../workers', workerName));
  worker.on('message', (data) => {
    const { response, requestId } = data;
    requestTracker[requestId](response);
    delete requestTracker[requestId];
  });
  worker.on('error', (error) => {
    console.log('error in worker:', workerName, error);
    worker.terminate();
  });
  return worker;
}

module.exports = generateNewWorker;