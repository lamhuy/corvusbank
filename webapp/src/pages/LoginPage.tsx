import React, { useState } from 'react';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonItem, IonLabel, IonInput, IonButton, IonText, IonLoading,
  IonCard, IonCardContent
} from '@ionic/react';
import { loginWithUsername } from '../services/auth';
import { useHistory, Link } from 'react-router-dom';
import chaseLogo from '../assets/logo_chase_headerfooter.svg';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !pin.trim()) {
      setError('Username and PIN are required');
      return;
    }
    
    setLoading(true);
    try {
      await loginWithUsername(username.trim(), pin);
      // On success, auth context redirects automatically since user becomes truthy
      history.push('/dashboard');
    } catch (err: any) {
      setError('Invalid username or PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={chaseLogo} alt="Chase Logo" style={{ height: '24px', verticalAlign: 'middle', marginRight: '8px' }} />
            Youth
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        <div className="ion-text-center" style={{ marginTop: '40px', marginBottom: '20px' }}>
          <img src={chaseLogo} alt="Chase Logo" style={{ height: '80px' }} />
          <h2 style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', margin: '16px 0 30px 0' }}>Welcome Back</h2>
        </div>
        
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <form onSubmit={handleLogin}>
            <IonInput 
              label="Username" 
              labelPlacement="floating" 
              fill="outline"
              value={username} 
              onIonChange={e => setUsername(e.detail.value!)} 
              required 
              style={{ marginBottom: '16px', '--background': '#ffffff' }}
            />
            
            <IonInput 
              label="4-Digit PIN"
              labelPlacement="floating" 
              fill="outline"
              type="password" 
              inputMode="numeric"
              maxlength={4}
              value={pin} 
              onIonChange={e => setPin(e.detail.value!)} 
              required 
              style={{ marginBottom: '16px', '--background': '#ffffff' }}
            />
            
            {error && (
              <IonText color="danger">
                <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>{error}</p>
              </IonText>
            )}
            
            <IonButton expand="block" shape="round" type="submit" style={{ height: '48px', fontWeight: 'bold' }}>
              Sign In
            </IonButton>
          </form>
          
          <div className="ion-text-center" style={{ marginTop: '24px' }}>
            <IonText color="medium" style={{ fontSize: '14px' }}>Don't have an account? </IonText>
            <Link to="/signup" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'var(--ion-color-primary)' }}>Create one</Link>
          </div>
        </div>
        
        <IonLoading isOpen={loading} message="Signing in..." />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
