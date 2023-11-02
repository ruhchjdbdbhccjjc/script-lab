import { SERVER_HELLO_ENDPOINT } from 'common/lib/constants';

import express from 'express';
import cors from 'cors';
import { getAccessTokenOrErrorResponse } from './auth';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const app = express();
const port = process.env.PORT || 5000;

// config
// https://www.npmjs.com/package/cors/v/2.8.5
app.use(cors());
app.use(express.json() as any);

// routes

// An endpoint to check that the server is alive (and used by
//    environment.redirector.ts for localhost redirect)
app.get('/' + SERVER_HELLO_ENDPOINT.path, (_req, res) => {
  res
    .contentType('application/json')
    .status(200)
    .send(SERVER_HELLO_ENDPOINT.payload);
});

app.options('/auth', cors());

// An auth endpoint for GitHub that returns a JSON payload of type IServerAuthResponse
app.post('/auth', async (req, res) => {
  const { code, state } = req.body;

  let responsePayload: IServerAuthResponse;

  try {
    responsePayload = await getAccessTokenOrErrorResponse({
      code,
      state,
    });
  } catch (e) {
    responsePayload = { error: JSON.stringify(e) };
  }

  res
    .contentType('application/json')
    .status(200)
    .header('Access-Control-Allow-Origin', '*')
    .send(responsePayload);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/test', (_req, res) => {
  res
    .contentType('text/plain')
    .status(200)
    .send('test response 1');
});
