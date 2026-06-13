import React, { useEffect, useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonIcon, IonText, IonSpinner
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import AccountSummaryCard from '../components/AccountSummaryCard';
import { useAuth } from '../services/authContext';
import { subscribeToUserAccounts, ensureCheckingAccount, ensureSavingsType } from '../services/db';
import { logout } from '../services/auth';
import { useHistory } from 'react-router-dom';
import chaseLogo from '../assets/logo_chase_headerfooter.svg';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let unsubscribe: (() => void) | null = null;

    const setup = async () => {
      setLoading(true);
      setError(null);

      try {
        // Migrations for existing users:
        // 1. Tag old accounts that have no type field as SAVINGS
        await ensureSavingsType(user.uid);
        // 2. Create a CHECKING account if one doesn't exist yet
        await ensureCheckingAccount(user.uid);
      } catch (err) {
        console.error("Migration error:", err);
      }

      // Subscribe to ALL accounts
      unsubscribe = subscribeToUserAccounts(user.uid, (data, err) => {
        if (err) {
          setError(err.message || "Permission Denied. Please clear browser cache and reload.");
          setLoading(false);
          return;
        }
        setAccounts(data);
        setLoading(false);
      });
    };

    setup();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const username = user?.email?.split('@')[0] || '';

  // Sort: Savings first, Checking second
  const sortedAccounts = [...accounts].sort((a, b) => {
    const typeA = a.type || 'SAVINGS';
    const typeB = b.type || 'SAVINGS';
    if (typeA === 'SAVINGS' && typeB === 'CHECKING') return -1;
    if (typeA === 'CHECKING' && typeB === 'SAVINGS') return 1;
    return 0;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={chaseLogo} alt="Chase Logo" style={{ height: '24px', verticalAlign: 'middle', marginRight: '8px' }} />
            Youth
          </IonTitle>
          <IonButtons slot="end">
            {username && (
              <IonText style={{ alignSelf: 'center', marginRight: '10px', fontWeight: '500' }}>
                Hi, {username.toUpperCase()}
              </IonText>
            )}
            <IonButton onClick={handleLogout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : error ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--ion-color-danger)' }}>
            <h2>Connection Error</h2>
            <p>{error}</p>
            <IonButton shape="round" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
              Retry
            </IonButton>
          </div>
        ) : sortedAccounts.length > 0 ? (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ion-color-secondary)', marginTop: '8px', marginBottom: '4px' }}>
              My Accounts
            </h2>
            {sortedAccounts.map(acc => (
              <div 
                key={acc.id} 
                onClick={() => history.push(`/account/${acc.id}`)} 
                style={{ cursor: 'pointer', padding: '4px 0' }}
              >
                <AccountSummaryCard 
                  balance={acc.balance}
                  interestRate={acc.interestRate}
                  ytdInterest={acc.ytdInterest}
                  type={acc.type || 'SAVINGS'}
                />
              </div>
            ))}
          </div>
        ) : (
          <IonText color="danger">
            <p className="ion-text-center">No accounts found.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
