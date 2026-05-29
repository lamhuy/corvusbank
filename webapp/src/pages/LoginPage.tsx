import React, { useState } from 'react';
import { 
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, 
  IonItem, IonLabel, IonInput, IonButton, IonText, IonLoading,
  IonCard, IonCardContent
} from '@ionic/react';
import { loginWithUsername } from '../services/auth';
import { useHistory, Link } from 'react-router-dom';
import ChaseLogo from '../components/ChaseLogo';

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
            <ChaseLogo size={24} color="#ffffff" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Chase Youth Bank
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        <div className="ion-text-center" style={{ marginTop: '20px', marginBottom: '10px' }}>
          <ChaseLogo size={80} color="var(--ion-color-primary)" />
          <h2 style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', margin: '10px 0 20px 0' }}>Welcome Back</h2>
        </div>
        <IonCard>
          <IonCardContent>
            <form onSubmit={handleLogin}>
              <IonItem>
                <IonLabel position="floating">Username</IonLabel>
                <IonInput 
                  value={username} 
                  onIonChange={e => setUsername(e.detail.value!)} 
                  required 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">4-Digit PIN</IonLabel>
                <IonInput 
                  type="password" 
                  inputMode="numeric"
                  maxlength={4}
                  value={pin} 
                  onIonChange={e => setPin(e.detail.value!)} 
                  required 
                />
              </IonItem>
              
              {error && <IonText color="danger"><p>{error}</p></IonText>}
              
              <IonButton expand="block" type="submit" className="ion-margin-top">
                Login
              </IonButton>
            </form>
            
            <div className="ion-text-center ion-margin-top">
              <IonText color="medium">Don't have an account? </IonText>
              <Link to="/signup">Create one here</Link>
            </div>
          </IonCardContent>
        </IonCard>
        <IonLoading isOpen={loading} message="Logging in..." />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
