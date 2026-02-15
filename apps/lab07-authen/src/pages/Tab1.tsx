import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonItem,
  IonLabel,
  IonSpinner,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

const Tab1: React.FC = () => {
  const history = useHistory();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      // GuardedRouter จะตรวจสอบ auth และ redirect ไป /login
      history.push('/login');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="primary">
            <IonTitle size="large">Welcome</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        ) : user ? (
          <>
            {/* Profile Header Card */}
            <div style={{ padding: '16px' }}>
              <IonCard style={{ margin: '0 0 16px 0' }}>
                <IonCardContent style={{ paddingTop: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    {/* Profile Photo */}
                    {user.photoUrl ? (
                      <IonAvatar
                        style={{
                          margin: '0 auto 16px',
                          height: '100px',
                          width: '100px',
                        }}
                      >
                        <img src={user.photoUrl} alt={user.displayName || 'Profile'} />
                      </IonAvatar>
                    ) : (
                      <div
                        style={{
                          margin: '0 auto 16px',
                          height: '100px',
                          width: '100px',
                          borderRadius: '50%',
                          backgroundColor: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px',
                        }}
                      >
                        👤
                      </div>
                    )}

                    {/* User Name */}
                    <IonText>
                      <h2 style={{ margin: '8px 0' }}>
                        {user.displayName || 'User'}
                      </h2>
                    </IonText>

                    {/* Email */}
                    {user.email && (
                      <IonText color="medium">
                        <p style={{ margin: '4px 0' }}>{user.email}</p>
                      </IonText>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>

              {/* User Details Info */}
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Profile Information</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem lines="inset">
                    <IonLabel position="stacked">
                      <strong>User ID (UID)</strong>
                    </IonLabel>
                    <IonText slot="end" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                      {user.uid}
                    </IonText>
                  </IonItem>

                  {user.email && (
                    <IonItem lines="inset">
                      <IonLabel position="stacked">
                        <strong>📧 Email</strong>
                      </IonLabel>
                      <IonText slot="end">{user.email}</IonText>
                    </IonItem>
                  )}

                  {user.displayName && (
                    <IonItem lines="inset">
                      <IonLabel position="stacked">
                        <strong>👤 Display Name</strong>
                      </IonLabel>
                      <IonText slot="end">{user.displayName}</IonText>
                    </IonItem>
                  )}

                  {user.phoneNumber && (
                    <IonItem lines="none">
                      <IonLabel position="stacked">
                        <strong>📱 Phone Number</strong>
                      </IonLabel>
                      <IonText slot="end">{user.phoneNumber}</IonText>
                    </IonItem>
                  )}
                </IonCardContent>
              </IonCard>

              {/* Logout Button */}
              <IonButton
                expand="block"
                color="danger"
                onClick={handleLogout}
                style={{ marginTop: '16px' }}
              >
                🚪 Logout
              </IonButton>
            </div>
          </>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <IonText>
              <p>No user information available</p>
            </IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
