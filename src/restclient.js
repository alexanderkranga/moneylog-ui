import fetch from 'cross-fetch';
import base64url from 'base64url';

const encode = encodeURIComponent;

const host = 'https://api.moneylog.rayhard.pro/api/moneylog';

const getGetAssertionChallenge = async body => {
  const getAssestionResponse = await fetch(host + '/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => response.json());

  if (getAssestionResponse.status !== 'ok') {
    throw new Error(getAssestionResponse.message);
  }

  return getAssestionResponse;
};

const getMakeCredentialsChallenge = async body => {
  const registrationResponse = await fetch(host + '/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => response.json());

  if (registrationResponse.status !== 'ok') {
    throw new Error(registrationResponse.message);
  }

  return registrationResponse;
};

const sendWebAuthnResponse = async body => {
  const responseJson = await fetch(host + '/auth/response', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(response => response.json());

  if (responseJson.status !== 'ok') {
    throw new Error(responseJson.message);
  }

  return responseJson;
};

const preformatGetAssertReq = getAssert => {
  getAssert.challenge = base64url.toBuffer(getAssert.challenge);

  for (let allowCredential of getAssert.allowCredentials) {
    allowCredential.id = base64url.toBuffer(allowCredential.id);
  }

  return getAssert;
};

const preformatMakeCredentialsRequest = makeCredentialsRequest => {
  makeCredentialsRequest.challenge = base64url.toBuffer(
    makeCredentialsRequest.challenge
  );
  makeCredentialsRequest.user.id = base64url.toBuffer(
    makeCredentialsRequest.user.id
  );

  return makeCredentialsRequest;
};

const publicKeyCredentialToJSON = pubKeyCredential => {
  if (pubKeyCredential instanceof Array) {
    let array = [];
    for (let key of pubKeyCredential) {
      array.push(publicKeyCredentialToJSON(key));
    }
    return array;
  }

  if (pubKeyCredential instanceof ArrayBuffer) {
    return base64url.encode(pubKeyCredential);
  }

  if (pubKeyCredential instanceof Object) {
    let obj = {};

    for (let key in pubKeyCredential) {
      obj[key] = publicKeyCredentialToJSON(pubKeyCredential[key]);
    }

    return obj;
  }

  return pubKeyCredential;
};

const moneylog = {
  getAllByUsername: userName => fetch(host + '/' + encode(userName)),

  submitNewLog: (logEvent, username) =>
    fetch(host + '/' + encode(username), {
      method: 'POST',
      body: JSON.stringify(logEvent),
      headers: {
        'Content-Type': 'application/json'
      }
    }),
  updateLog: (logEvent, username) =>
    fetch(host + '/' + username + '/' + encode(logEvent.id), {
      method: 'PUT',
      body: JSON.stringify(logEvent),
      headers: {
        'Content-Type': 'application/json'
      }
    }),

  delete: (logId, username) =>
    fetch(host + '/' + username + '/' + encode(logId), {
      method: 'DELETE'
    })
};

const webauthn = {
  login: async username => {
    const getAssertionChallengeResponse = await getGetAssertionChallenge({
      username
    });

    const publicKey = preformatGetAssertReq(getAssertionChallengeResponse);

    const getCredentialsResponse = await navigator.credentials.get({
      publicKey
    });

    const getCredentialsResponseJson = publicKeyCredentialToJSON(
      getCredentialsResponse
    );

    const finalResponse = await sendWebAuthnResponse(
      getCredentialsResponseJson
    );

    if (finalResponse.status === 'ok') {
      sessionStorage.setItem('username', username);
      localStorage.setItem('username', username);
      return true;
    } else {
      throw new Error(finalResponse.message);
    }
  },

  register: async username => {
    if (!username || username.trim() === '') {
      throw new Error('Username should not be empty');
    }

    const regitrationChallengeResponse = await getMakeCredentialsChallenge({
      username
    });

    const publicKey = preformatMakeCredentialsRequest(
      regitrationChallengeResponse
    );

    const createCredentialsResponse = await navigator.credentials.create({
      publicKey
    });

    const createCredentialsResponseJson = publicKeyCredentialToJSON(
      createCredentialsResponse
    );

    const registrationResponse = await sendWebAuthnResponse(
      createCredentialsResponseJson
    );

    if (registrationResponse.status === 'ok') {
      sessionStorage.setItem('username', username);
      localStorage.setItem('username', username);
      return true;
    } else {
      throw new Error(registrationResponse.message);
    }
  }
};

export default {
  moneylog,
  webauthn
};
