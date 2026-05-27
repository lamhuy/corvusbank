import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText } from '@ionic/react';
import { formatCurrency } from '../utils/finance';

interface AccountSummaryCardProps {
  balance: number;
  interestRate: number;
  ytdInterest: number;
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ balance, interestRate, ytdInterest }) => {
  return (
    <IonCard color="primary">
      <IonCardHeader>
        <IonCardTitle color="light">Savings Balance</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <h1 style={{ fontSize: '3rem', margin: '10px 0', color: 'white' }}>
          {formatCurrency(balance)}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <IonText color="light">
            <strong>APY:</strong> {interestRate.toFixed(2)}%
          </IonText>
          <IonText color="light">
            <strong>YTD Interest:</strong> {formatCurrency(ytdInterest)}
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default AccountSummaryCard;
