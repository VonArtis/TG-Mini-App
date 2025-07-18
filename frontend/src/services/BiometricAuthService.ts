// Biometric Authentication Service using WebAuthn API
interface BiometricCredential {
  id: string;
  publicKey: string;
  counter: number;
  createdAt: string;
}

class BiometricAuthService {
  private static instance: BiometricAuthService;
  private isEnabled: boolean = false;
  private isSupported: boolean = false;
  private credentials: BiometricCredential[] = [];

  public static getInstance(): BiometricAuthService {
    if (!BiometricAuthService.instance) {
      BiometricAuthService.instance = new BiometricAuthService();
    }
    return BiometricAuthService.instance;
  }

  // Initialize biometric service
  async init(): Promise<boolean> {
    try {
      // Check WebAuthn support
      this.isSupported = this.checkWebAuthnSupport();
      
      if (!this.isSupported) {
        console.warn('WebAuthn not supported in this browser');
        return false;
      }

      // Load user preferences and credentials
      const userPreference = localStorage.getItem('biometric_enabled');
      this.isEnabled = userPreference === 'true';
      
      const storedCredentials = localStorage.getItem('biometric_credentials');
      this.credentials = storedCredentials ? JSON.parse(storedCredentials) : [];

      console.log('Biometric auth service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize biometric service:', error);
      return false;
    }
  }

  // Check if WebAuthn is supported
  private checkWebAuthnSupport(): boolean {
    return !!(
      window.PublicKeyCredential &&
      window.navigator.credentials &&
      typeof window.navigator.credentials.create === 'function' &&
      typeof window.navigator.credentials.get === 'function'
    );
  }

  // Check if biometric is available (platform authenticator)
  async isBiometricAvailable(): Promise<boolean> {
    if (!this.isSupported) return false;

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  // Setup biometric authentication
  async setupBiometric(userId: string, userEmail: string): Promise<boolean> {
    if (!this.isSupported) {
      throw new Error('Biometric authentication is not supported on this device');
    }

    try {
      // Create credential options
      const credentialOptions: CredentialCreationOptions = {
        publicKey: {
          challenge: new Uint8Array(32), // In production, get from server
          rp: {
            name: 'VonVault',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: userEmail,
            displayName: userEmail.split('@')[0],
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: 'direct',
        },
      };

      // Create credential
      const credential = await navigator.credentials.create(credentialOptions) as PublicKeyCredential;
      
      if (!credential) {
        throw new Error('Failed to create biometric credential');
      }

      // Store credential info
      const response = credential.response as AuthenticatorAttestationResponse;
      const credentialInfo: BiometricCredential = {
        id: credential.id,
        publicKey: this.arrayBufferToBase64(response.getPublicKey() || new ArrayBuffer(0)),
        counter: 0,
        createdAt: new Date().toISOString(),
      };

      this.credentials.push(credentialInfo);
      this.isEnabled = true;
      
      // Save to localStorage
      localStorage.setItem('biometric_credentials', JSON.stringify(this.credentials));
      localStorage.setItem('biometric_enabled', 'true');

      console.log('Biometric authentication setup successful');
      return true;
    } catch (error: any) {
      console.error('Biometric setup failed:', error);
      
      // Handle specific errors
      if (error.name === 'NotAllowedError') {
        throw new Error('Biometric authentication was cancelled or not allowed');
      } else if (error.name === 'NotSupportedError') {
        throw new Error('Biometric authentication is not supported on this device');
      } else {
        throw new Error('Failed to setup biometric authentication');
      }
    }
  }

  // Authenticate using biometric
  async authenticateBiometric(): Promise<boolean> {
    if (!this.isEnabled || this.credentials.length === 0) {
      throw new Error('Biometric authentication is not set up');
    }

    try {
      // Create authentication options
      const authOptions: CredentialRequestOptions = {
        publicKey: {
          challenge: new Uint8Array(32), // In production, get from server
          allowCredentials: this.credentials.map(cred => ({
            id: this.base64ToArrayBuffer(cred.id),
            type: 'public-key',
            transports: ['internal'] as AuthenticatorTransport[],
          })),
          userVerification: 'required',
          timeout: 60000,
        },
      };

      // Get credential
      const assertion = await navigator.credentials.get(authOptions) as PublicKeyCredential;
      
      if (!assertion) {
        throw new Error('Biometric authentication failed');
      }

      // In production, verify the assertion on the server
      console.log('Biometric authentication successful');
      return true;
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      
      // Handle specific errors
      if (error.name === 'NotAllowedError') {
        throw new Error('Biometric authentication was cancelled');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('Biometric authentication is not available');
      } else {
        throw new Error('Biometric authentication failed');
      }
    }
  }

  // Enable/disable biometric
  async setEnabled(enabled: boolean): Promise<boolean> {
    if (enabled && this.credentials.length === 0) {
      throw new Error('Biometric authentication must be set up first');
    }

    this.isEnabled = enabled;
    localStorage.setItem('biometric_enabled', enabled.toString());
    return true;
  }

  // Remove all biometric credentials
  async removeBiometric(): Promise<void> {
    this.credentials = [];
    this.isEnabled = false;
    localStorage.removeItem('biometric_credentials');
    localStorage.setItem('biometric_enabled', 'false');
    console.log('Biometric credentials removed');
  }

  // Get current status
  getStatus(): {
    isSupported: boolean;
    isEnabled: boolean;
    isSetup: boolean;
    credentialCount: number;
  } {
    return {
      isSupported: this.isSupported,
      isEnabled: this.isEnabled,
      isSetup: this.credentials.length > 0,
      credentialCount: this.credentials.length,
    };
  }

  // Utility functions
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Helper method for requiring biometric auth for sensitive operations
  async requireBiometricForOperation(operationType: string): Promise<boolean> {
    if (!this.isEnabled) {
      console.log(`Biometric not enabled for ${operationType}`);
      return true; // Allow operation if biometric is disabled
    }

    try {
      const authenticated = await this.authenticateBiometric();
      if (authenticated) {
        console.log(`Biometric authentication successful for ${operationType}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Biometric authentication failed for ${operationType}:`, error);
      throw error;
    }
  }
}

export const biometricAuthService = BiometricAuthService.getInstance();