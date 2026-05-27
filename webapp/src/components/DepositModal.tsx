import React, { useState } from 'react';
import { 
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonLabel, IonInput, IonText, IonLoading
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
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Make a Deposit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Amount ($)</IonLabel>
            <IonInput 
              type="number" 
              inputMode="decimal"
              step="0.01"
              min="0.01"
              max="10000"
              value={amountStr} 
              onIonChange={e => setAmountStr(e.detail.value!)} 
              required 
            />
          </IonItem>
          {error && <IonText color="danger"><p>{error}</p></IonText>}
          <IonButton expand="block" type="submit" className="ion-margin-top">
            Confirm Deposit
          </IonButton>
        </form>
        <IonLoading isOpen={loading} message="Processing..." />
      </IonContent>
    </IonModal>
  );
};

export default DepositModal;
