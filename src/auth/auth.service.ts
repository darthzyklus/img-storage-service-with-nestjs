import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

type CreateUser = {
  username: string;
  password: string;
};

@Injectable()
export class AuthService {
  private clientId: string;
  private secretHash: string;
  private client: CognitoIdentityProviderClient;

  constructor(private configService: ConfigService) {
    const credentials = {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    };

    const region = this.configService.get('AWS_REGION');

    const client = new CognitoIdentityProviderClient({ credentials, region });

    this.client = client;
    this.clientId = this.configService.get('AWS_USER_POOL_CLIENT_ID');
    this.secretHash = this.configService.get('AUTH_SECRET_HASH');
  }

  private generateHash(username: string): string {
    return createHmac('sha256', this.secretHash)
      .update(username + this.clientId)
      .digest('base64');
  }

  signUp({ username, password }: CreateUser) {
    const userAttributes = [{ Name: 'email', Value: username }];

    const input = {
      Username: username,
      Password: password,
      ClientId: this.clientId,
      UserAttributes: userAttributes,
      SecretHash: this.generateHash(username),
    }

    const command = new SignUpCommand(input);
    return this.client.send(command);
  }
}
