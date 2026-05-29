import React, { useEffect, useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonButton, IonIcon, IonSpinner
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { subscribeToUserAccount, subscribeToTransactions, processDeposit } from '../services/db';
import { useAuth } from '../services/authContext';
import { formatCurrency } from '../utils/finance';
import TransactionList from '../components/TransactionList';
import DepositModal from '../components/DepositModal';

const AccountDetailsPage: React.FC = () => {
  const { id: accountId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user || !accountId) return;
    
    let unsubAccount: any = () => {};
    
    // Subscribe to account
    const setupAccountSub = async () => {
      const unsub = await subscribeToUserAccount(user.uid, (data) => {
        if (data && data.id === accountId) {
          setAccount(data);
        }
        setLoading(false);
      });
      if (typeof unsub === 'function') {
        unsubAccount = unsub;
      }
    };
    setupAccountSub();

    // Subscribe to transactions
    const unsubTx = subscribeToTransactions(accountId, (data) => {
      setTransactions(data);
    });

    return () => {
      if (unsubAccount) unsubAccount();
      if (unsubTx) unsubTx();
    };
  }, [user, accountId]);

  const handleDeposit = async (amountInCents: number) => {
    await processDeposit(accountId, amountInCents);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>Account Details</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(true)}>
              <IonIcon slot="icon-only" icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <IonSpinner name="crescent" color="primary" />
            </div>
          ) : account ? (
            <>
              <div style={{ 
                background: '#ffffff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                padding: '32px 24px',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <p style={{ color: '#666', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>Current Balance</p>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', margin: '0 0 24px 0', color: 'var(--ion-color-secondary)' }}>
                  {formatCurrency(account.balance)}
                </h1>
                <IonButton shape="round" color="primary" onClick={() => setShowModal(true)} style={{ height: '44px', padding: '0 24px', fontWeight: 'bold' }}>
                  Make a Deposit
                </IonButton>
              </div>

              <div style={{ 
                background: '#ffffff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--ion-color-secondary)' }}>Recent Activity</h2>
                </div>
                <div style={{ padding: '0 16px' }}>
                  <TransactionList transactions={transactions} />
                </div>
              </div>

              <DepositModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                onDeposit={handleDeposit} 
              />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>Account not found.</p>
              <IonButton shape="round" fill="outline" onClick={() => window.location.reload()} style={{ marginTop: '16px' }}>Refresh</IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AccountDetailsPage;
