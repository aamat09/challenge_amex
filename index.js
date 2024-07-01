const fastify = require('fastify')({logger: true, connectionTimeout: 5000});
const generateNewWorker = require('./utils/generateNewWorker');
const requestTracker = require('./utils/requestTracker');

var getCatsWorker = null;
var getDogsWorker = null;
var catsTimeout = null;
var dogsTimeout = null;

fastify.addHook('onRequest', async (request, reply) => {
    if (request.headers.correlationid == null) {
        request.headers.correlationid = Math.random().toString(36).substring(7);
    }
});

fastify.addHook('onSend', async (request, reply) => {
    reply.header('correlationid', request.headers.correlationid);
    console.log('response sent')
});
fastify.get('/getCatsInfo', function handler(request, reply) {
    requestTracker[request.id] = (result) => reply.send(result)
    if (!getCatsWorker) {
        getCatsWorker = generateNewWorker('getCatsWorker');
    }

    if (catsTimeout) {
        clearTimeout(catsTimeout);
    }

    getCatsWorker.postMessage({requestId: request.id});
    catsTimeout = eliminateWorker('getCatsWorker');

})

fastify.get('/getDogsInfo', function handler(request, reply) {
    requestTracker[request.id] = (result) => reply.send(result)
    if (!getDogsWorker) {
        getDogsWorker = generateNewWorker('getDogsWorker');
    }

    if (dogsTimeout) {
        clearTimeout(dogsTimeout);
    }

    getDogsWorker.postMessage({requestId: request.id});
    dogsTimeout = eliminateWorker( 'getDogsWorker');
})

fastify.listen({port: 3000}, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});

function eliminateWorker(workerName) {
    return setTimeout(() => {
        console.log('terminating worker:', workerName);
        if (workerName === 'getDogsWorker' && dogsTimeout) {
            getDogsWorker.terminate();
            getDogsWorker = null;
            clearTimeout(dogsTimeout);
            dogsTimeout = null;
        }
        if (workerName === 'getCatsWorker' && catsTimeout) {
            getCatsWorker.terminate()
            getCatsWorker = null;
            clearTimeout(catsTimeout);
            catsTimeout = null;
        }
    }, 900000);
}