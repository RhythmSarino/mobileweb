import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonSpinner,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '@/auth/auth-service';
import '@/theme/LoginPage.css';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'methods' | 'email' | 'phone' | 'otp'>('methods');

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.loginWithEmailPassword({
        email,
        password,
      });
      history.push('/tab1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await authService.loginWithGoogle();
      history.push('/tab1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // Phone Login - Step 1: Send OTP
  const handlePhoneStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.startPhoneLogin({
        phoneNumberE164: phone,
      });
      localStorage.setItem('verificationId', result.verificationId);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Phone Login - Step 2: Confirm OTP
  const handlePhoneConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const verificationId = localStorage.getItem('verificationId');
      if (!verificationId) {
        throw new Error('Verification ID not found');
      }

      await authService.confirmPhoneCode({
        verificationId,
        verificationCode: otp,
      });
      localStorage.removeItem('verificationId');
      history.push('/tab1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle>Login</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {error && (
                <IonText color="danger">
                  <p className="error-message">{error}</p>
                </IonText>
              )}

              {/* Login Methods Selection */}
              {step === 'methods' && (
                <div className="login-methods">
                  <IonButton
                    expand="block"
                    onClick={() => setStep('email')}
                    disabled={loading}
                  >
                    📧 Email/Password Login
                  </IonButton>

                  <div className="divider">OR</div>

                  <IonButton
                    expand="block"
                    color="light"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : '🔷 Google Login'}
                  </IonButton>

                  <div className="divider">OR</div>

                  <IonButton
                    expand="block"
                    color="secondary"
                    onClick={() => setStep('phone')}
                    disabled={loading}
                  >
                    📱 Phone Login
                  </IonButton>
                </div>
              )}

              {/* Email/Password Form */}
              {step === 'email' && (
                <form onSubmit={handleEmailLogin}>
                  <IonInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value || '')}
                    disabled={loading}
                  />
                  <IonInput
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value || '')}
                    disabled={loading}
                  />
                  <div className="login-buttons">
                    <IonButton
                      expand="block"
                      color="medium"
                      type="button"
                      onClick={() => {
                        setStep('methods');
                        setEmail('');
                        setPassword('');
                      }}
                    >
                      Back
                    </IonButton>
                    <IonButton
                      expand="block"
                      type="submit"
                      disabled={loading || !email || !password}
                    >
                      {loading ? <IonSpinner name="crescent" /> : 'Login'}
                    </IonButton>
                  </div>
                </form>
              )}

              {/* Phone Number Form */}
              {step === 'phone' && (
                <form onSubmit={handlePhoneStart}>
                  <IonInput
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g., +66812345678"
                    value={phone}
                    onIonChange={(e) => setPhone(e.detail.value || '')}
                    disabled={loading}
                  />
                  <div className="login-buttons">
                    <IonButton
                      expand="block"
                      color="medium"
                      type="button"
                      onClick={() => {
                        setStep('methods');
                        setPhone('');
                      }}
                    >
                      Back
                    </IonButton>
                    <IonButton
                      expand="block"
                      type="submit"
                      disabled={loading || !phone}
                    >
                      {loading ? <IonSpinner name="crescent" /> : 'Send OTP'}
                    </IonButton>
                  </div>
                </form>
              )}

              {/* OTP Verification Form */}
              {step === 'otp' && (
                <form onSubmit={handlePhoneConfirm}>
                  <IonText>
                    <p>OTP code sent to {phone}</p>
                  </IonText>
                  <IonInput
                    label="Enter OTP"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onIonChange={(e) => setOtp(e.detail.value || '')}
                    disabled={loading}
                  />
                  <div className="login-buttons">
                    <IonButton
                      expand="block"
                      color="medium"
                      type="button"
                      onClick={() => {
                        setStep('phone');
                        setOtp('');
                      }}
                    >
                      Back
                    </IonButton>
                    <IonButton
                      expand="block"
                      type="submit"
                      disabled={loading || !otp}
                    >
                      {loading ? <IonSpinner name="crescent" /> : 'Verify'}
                    </IonButton>
                  </div>
                </form>
              )}
            </IonCardContent>
          </IonCard>
        </div>
        {/* reCAPTCHA container required for Firebase phone auth */}
        <div id="recaptcha-container" />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
