import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class PixelApiApi implements ICredentialType {
  name = 'pixelApiApi';
  displayName = 'PixelAPI API';
  documentationUrl = 'https://pixelapi.dev/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your PixelAPI API key. Get one free at https://pixelapi.dev/app',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.pixelapi.dev',
      url: '/v1/account/credits',
      method: 'GET',
    },
  };
}
