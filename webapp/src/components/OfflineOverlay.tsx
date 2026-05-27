import React from 'react';
import { IonModal, IonContent, IonIcon, IonText } from '@ionic/react';
import { wifiOutline } from 'ionicons/icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const OfflineOverlay: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <IonModal isOpen={!isOnline} backdropDismiss={false} keyboardClose={false}>
      <IonContent className="ion-padding ion-text-center" style={{ '--background': 'var(--ion-color-danger)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <IonIcon icon={wifiOutline} style={{ fontSize: '100px', color: 'white' }} />
          <IonText color="light">
            <h1 style={{ marginTop: '20px' }}>No Internet Connection</h1>
            <p style={{ fontSize: '1.2rem' }}>Please reconnect to continue using CorvusBank.</p>
          </IonText>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default OfflineOverlay;
