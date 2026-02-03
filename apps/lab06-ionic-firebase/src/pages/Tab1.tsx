import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './Tab1.css';

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  createdAt: any;
}

const Tab1: React.FC = () => {
  const history = useHistory();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseList: Expense[] = [];
      snapshot.forEach((doc) => {
        expenseList.push({ id: doc.id, ...doc.data() } as Expense);
      });
      setExpenses(expenseList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalIncome = (): number => {
    return expenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalExpense = (): number => {
    return expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายรับ/รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">รายรับ/รายจ่าย</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Summary Cards */}
        <div className="summary-section">
          <IonCard className="income-card">
            <IonCardHeader>
              <IonCardTitle>รายรับ</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="amount-display">
                ฿{getTotalIncome().toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="expense-card">
            <IonCardHeader>
              <IonCardTitle>รายจ่าย</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="amount-display">
                ฿{getTotalExpense().toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="balance-card">
            <IonCardHeader>
              <IonCardTitle>ยอดคงเหลือ</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="amount-display">
                ฿{(getTotalIncome() - getTotalExpense()).toLocaleString('th-TH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Expense List */}
        <div className="expense-list-section">
          <h2>ประวัติการบันทึก</h2>
          {loading ? (
            <div className="loading-container">
              <IonSpinner />
            </div>
          ) : expenses.length === 0 ? (
            <div className="empty-state">
              <p>ไม่มีรายการ กรุณาเพิ่มรายการใหม่</p>
            </div>
          ) : (
            <IonList>
              {expenses.map((expense) => (
                <IonItem
                  key={expense.id}
                  button
                  onClick={() => history.push(`/edit-expense/${expense.id}`)}
                >
                  <IonLabel>
                    <div className="expense-item">
                      <div className="expense-info">
                        <p className="expense-title">{expense.title}</p>
                        <p className="expense-category">{expense.category}</p>
                        <p className="expense-date">{formatDate(expense.createdAt)}</p>
                      </div>
                      <div className={`expense-amount ${expense.type}`}>
                        {expense.type === 'income' ? '+' : '-'}
                        {expense.amount.toLocaleString('th-TH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>

        {/* Floating Action Button */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push('/add-expense')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
