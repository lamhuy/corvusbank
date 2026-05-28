import React, { useEffect, useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonIcon, IonText, IonSpinner
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import AccountSummaryCard from '../components/AccountSummaryCard';
import { useAuth } from '../services/authContext';
import { subscribeToUserAccount } from '../services/db';
import { logout } from '../services/auth';
import { useHistory } from 'react-router-dom';
import ChaseLogo from '../components/ChaseLogo';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let unsubscribe: any = () => {};

    const setupSubscription = async () => {
      setLoading(true);
      setError(null);
      const unsub = await subscribeToUserAccount(user.uid, (data, err) => {
        if (err) {
          setError(err.message || "Permission Denied. Please clear browser IndexedDB cache and reload.");
          setLoading(false);
          return;
        }
        setAccount(data);
        setLoading(false);
      });
      if (typeof unsub === 'function') {
        unsubscribe = unsub;
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const username = user?.email?.split('@')[0] || '';

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChaseLogo size={24} color="#ffffff" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Chase First Banking
          </IonTitle>
          <IonButtons slot="end">
            {username && (
              <IonText style={{ alignSelf: 'center', marginRight: '10px', fontWeight: '500' }}>
                Hi, {username}
              </IonText>
            )}
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ion-color-danger)' }}>
            <h2>Connection Error</h2>
            <p>{error}</p>
            <IonButton onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
              Retry
            </IonButton>
          </div>
        ) : account ? (
          <div onClick={() => history.push(`/account/${account.id}`)} style={{ cursor: 'pointer' }}>
            <AccountSummaryCard 
              balance={account.balance}
              interestRate={account.interestRate}
              ytdInterest={account.ytdInterest}
            />
            <div className="ion-text-center ion-margin-top">
              <IonText color="medium">Tap card for details and transactions</IonText>
            </div>
          </div>
        ) : (
          <IonText color="danger">
            <p className="ion-text-center">No account found.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
