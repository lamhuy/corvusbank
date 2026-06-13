import React from 'react';
import { IonList, IonItem, IonLabel, IonNote, IonIcon, IonText } from '@ionic/react';
import { formatCurrency } from '../utils/finance';
import { arrowDownCircleOutline, trendingUpOutline } from 'ionicons/icons';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'INTEREST';
  date: any; // Firestore Timestamp
  description: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <IonText color="medium">
        <p className="ion-text-center">No transactions yet.</p>
      </IonText>
    );
  }

  return (
    <IonList>
      {transactions.map(tx => (
        <IonItem key={tx.id}>
          <IonIcon 
            slot="start" 
            icon={tx.type === 'DEPOSIT' ? arrowDownCircleOutline : trendingUpOutline} 
            color={tx.type === 'DEPOSIT' ? 'success' : 'primary'}
          />
          <IonLabel>
            <h2>{tx.description}</h2>
            <p>{tx.date?.toDate ? tx.date.toDate().toLocaleDateString() : 'Just now'}</p>
          </IonLabel>
          <IonNote slot="end" color="success" style={{ fontWeight: 'bold' }}>
            +{formatCurrency(tx.amount)}
          </IonNote>
        </IonItem>
      ))}
    </IonList>
  );
};

export default TransactionList;
