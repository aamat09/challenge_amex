Task #1:
Error is found in the refreshToken method where the token generation error out when because of a sintax error,
File changed, getCatsWorker.js
( line 9 data doesn't contain a value attribute, but just a key attribute)

Additional suggestions:
setTimeout on line 28 is only refreshing once and not every 5 seconds as intended.
so the fix is to change the line 28 to 'setInterval' function to refresh such token

Also token generation is refers to a single token for all request,
which is not a good practice, so the token should be generated for each request.

Task #2
Files changed:
Index.js

Added a hook (onRequest) to validate the incoming request and validate the correlationId header
Added a hook (onSend) to add the correlationId header to the response headers

Task #3
Files changed:
Index.js

Added a function eliminateWorker to terminate the worker thread if it is idle for 15 minutes
and modified the request to generate a new worker if it doesn't exist in the handler for each API 
and it starts the counter to remove the worker if it goes idle