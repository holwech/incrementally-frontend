import { UserAgentApplication, Configuration, AuthenticationParameters } from 'msal';

export default class Auth {
  private auth: UserAgentApplication;
  private requestObject?: AuthenticationParameters;

  constructor(config: Configuration, requestObject?: AuthenticationParameters) {
    this.auth = new UserAgentApplication(config);
    this.requestObject = requestObject;
  }

  public async login(): Promise<void> {
    try {
      const authResponse = await this.auth.loginPopup();
      if (this.requestObject === undefined) {
        throw new Error('Request object is undefined.');
      }
      try {
        const tokenResponse = await this.auth.acquireTokenSilent(this.requestObject);
      } catch (e) {
        if (this.requiresInteraction(e.errorCode)) {
          const tokenResponse = await this.auth.acquireTokenPopup(this.requestObject);
        }
      }
    } catch (e) {
      throw new Error(e);
    }
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
