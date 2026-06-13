import React from 'react';
import { IonCard, IonCardContent, IonText, IonIcon } from '@ionic/react';
import { walletOutline, trendingUpOutline, cardOutline } from 'ionicons/icons';
import { formatCurrency } from '../utils/finance';
import chaseLogo from '../assets/logo_chase_headerfooter.svg';

interface AccountSummaryCardProps {
  balance: number;
  interestRate: number;
  ytdInterest: number;
  type?: 'SAVINGS' | 'CHECKING';
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ balance, interestRate, ytdInterest, type = 'SAVINGS' }) => {
  const isChecking = type === 'CHECKING';
  const title = isChecking ? 'Chase Checkings℠' : 'Chase Savings℠';
  const apyIcon = isChecking ? cardOutline : walletOutline;

  return (
    <IonCard style={{ borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', margin: '16px 0', background: '#ffffff' }}>
      <IonCardContent style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <IonText color="dark" style={{ fontWeight: '600', fontSize: '18px' }}>{title}</IonText>
          <img src={chaseLogo} alt="Logo" style={{ height: '20px' }} />
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '8px 0 24px 0', color: 'var(--ion-color-secondary)' }}>
          {formatCurrency(balance)}
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: 'rgba(17, 122, 202, 0.1)', padding: '8px', borderRadius: '50%' }}>
              <IonIcon icon={apyIcon} color="primary" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>APY</div>
              <div style={{ fontWeight: '600', color: 'var(--ion-color-secondary)' }}>{interestRate.toFixed(2)}%</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ backgroundColor: 'rgba(46, 133, 64, 0.1)', padding: '8px', borderRadius: '50%' }}>
              <IonIcon icon={trendingUpOutline} color="success" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666' }}>YTD Interest</div>
              <div style={{ fontWeight: '600', color: 'var(--ion-color-secondary)' }}>{formatCurrency(ytdInterest)}</div>
            </div>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default AccountSummaryCard;
