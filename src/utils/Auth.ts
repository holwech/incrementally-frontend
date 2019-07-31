import { UserAgentApplication, Configuration, AuthenticationParameters, AuthResponse, Account } from 'msal';

export interface IUserFlows {
  signin: string;
  signup: string;
}

export default class Auth {
  public idToken?: AuthResponse;
  private auth: UserAgentApplication;
  get account(): Account {
    return this.auth.getAccount();
  }

  constructor(config: Configuration, private userFlows: IUserFlows) {
    this.auth = new UserAgentApplication(config);
  }

  public async login(): Promise<void> {
    try {
      this.auth.authority = this.userFlows.signin;
      this.idToken = await this.auth.loginPopup();
    } catch (e) {
      throw new Error(e);
    }
  }

  public async signup(): Promise<void> {
    try {
      this.auth.authority = this.userFlows.signup;
      this.idToken = await this.auth.loginPopup();
    } catch (e) {
      throw new Error(e);
    }
  }

  public async getAccessTokenAsync(requestObject: AuthenticationParameters): Promise<AuthResponse> {
    if (this.auth.getAccount()) {
      try {
        return await this.auth.acquireTokenSilent(requestObject);
      } catch (e) {
        if (this.requiresInteraction(e.errorCode)) {
          return await this.auth.acquireTokenPopup(requestObject);
        } else {
          throw new Error(e);
        }
      }
    } else {
      throw new Error('Manual login required');
    }
  }

  public async query(
      endpoint: string,
      requestObject: AuthenticationParameters,
      method = 'GET',
      body?: any,
    ): Promise<Response> {
    const headers = new Headers();
    const bearer = 'Bearer ' + (await this.getAccessTokenAsync(requestObject)).accessToken;
    headers.append('Authorization', bearer);
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = {
      method,
      headers,
      body: JSON.stringify(body),
    };
    return fetch(endpoint, options);
  }

  public async logout(): Promise<void> {
    this.auth.logout();
  }

  private requiresInteraction(errorCode: string): boolean {
    if (!errorCode || !errorCode.length) {
      return false;
    }
    return errorCode === 'consent_required' ||
           errorCode === 'interaction_required' ||
           errorCode === 'login_required';
  }
}
