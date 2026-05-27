import React, { useEffect, useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonBackButton, IonButton, IonIcon, IonLoading,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle
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
    
    // Subscribe to account
    const unsubAccount = subscribeToUserAccount(user.uid, (data) => {
      if (data && data.id === accountId) {
        setAccount(data);
      }
      setLoading(false);
    });

    // Subscribe to transactions
    const unsubTx = subscribeToTransactions(accountId, (data) => {
      setTransactions(data);
    });

    return () => {
      unsubAccount();
      unsubTx();
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
      <IonContent className="ion-padding">
        {loading ? (
          <IonLoading isOpen={true} message="Loading details..." />
        ) : account ? (
          <>
            <IonCard color="primary">
              <IonCardContent className="ion-text-center">
                <p style={{ color: 'white' }}>Current Balance</p>
                <h1 style={{ fontSize: '3rem', margin: '10px 0', color: 'white' }}>
                  {formatCurrency(account.balance)}
                </h1>
                <IonButton color="light" fill="outline" onClick={() => setShowModal(true)} className="ion-margin-top">
                  Make a Deposit
                </IonButton>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Recent Activity</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <TransactionList transactions={transactions} />
              </IonCardContent>
            </IonCard>

            <DepositModal 
              isOpen={showModal} 
              onClose={() => setShowModal(false)} 
              onDeposit={handleDeposit} 
            />
          </>
        ) : (
          <p className="ion-text-center">Account not found.</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AccountDetailsPage;
