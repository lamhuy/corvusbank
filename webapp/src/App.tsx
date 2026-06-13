import React from 'react';
import { IonApp, IonRouterOutlet, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './services/authContext';

// Placeholder Pages (to be implemented in subsequent user stories)
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AccountDetailsPage from './pages/AccountDetailsPage';
import OfflineOverlay from './components/OfflineOverlay';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <IonApp style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <IonSpinner name="crescent" />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <OfflineOverlay />
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/signup">
            {user ? <Redirect to="/dashboard" /> : <SignUpPage />}
          </Route>
          <Route exact path="/login">
            {user ? <Redirect to="/dashboard" /> : <LoginPage />}
          </Route>
          <Route exact path="/dashboard">
            {user ? <DashboardPage /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/account/:id">
            {user ? <AccountDetailsPage /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/">
            <Redirect to={user ? "/dashboard" : "/login"} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
