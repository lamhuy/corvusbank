import React, { useState } from 'react';
import { 
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonInput, IonText, IonLoading
} from '@ionic/react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amountInCents: number) => Promise<void>;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amountStr, setAmountStr] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (amount > 10000) {
      setError('Maximum deposit is $10,000 per transaction');
      return;
    }

    const amountInCents = Math.floor(amount * 100);
    
    setLoading(true);
    try {
      await onDeposit(amountInCents);
      setAmountStr('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} breakpoints={[0, 0.6, 1]} initialBreakpoint={0.6}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Make a Deposit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose} style={{ fontWeight: 'bold' }}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        <div style={{ maxWidth: '400px', margin: '20px auto 0' }}>
          <div className="ion-text-center" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontWeight: 'bold', color: 'var(--ion-color-secondary)', margin: '0 0 8px 0' }}>Add Funds</h2>
            <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Enter the amount you wish to deposit.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <IonInput 
              label="Amount ($)" 
              labelPlacement="floating" 
              fill="outline"
              type="number" 
              inputMode="decimal"
              step="0.01"
              min="0.01"
              max="10000"
              value={amountStr} 
              onIonInput={e => setAmountStr(e.detail.value as string)} 
              required 
              style={{ marginBottom: '16px', '--background': '#ffffff' }}
            />
            
            {error && (
              <IonText color="danger">
                <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>{error}</p>
              </IonText>
            )}
            
            <IonButton expand="block" shape="round" type="submit" style={{ height: '48px', fontWeight: 'bold' }}>
              Confirm Deposit
            </IonButton>
          </form>
        </div>
        <IonLoading isOpen={loading} message="Processing deposit..." />
      </IonContent>
    </IonModal>
  );
};

export default DepositModal;
