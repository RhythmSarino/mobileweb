import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonItem,
  IonLabel,
  IonToast,
  IonList,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonActionSheet,
} from '@ionic/react';
import { trash, create } from 'ionicons/icons';
import { db } from '../firebase';
import { collection, doc, getDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './Tab2.css';

interface ExpenseForm {
  title: string;
  amount: string;
  type: string;
  category: string;
  note: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  createdAt: any;
}

const Tab2: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [formData, setFormData] = useState<ExpenseForm>({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    note: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  // Load expenses
  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseList: Expense[] = [];
      snapshot.forEach((doc) => {
        expenseList.push({ id: doc.id, ...doc.data() } as Expense);
      });
      setExpenses(expenseList);
      setLoadingExpenses(false);
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

  const handleInputChange = (field: keyof ExpenseForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: keyof ExpenseForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setToastMessage('กรุณากรอกชื่อรายการ');
      setShowToast(true);
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setToastMessage('กรุณากรอกจำนวนเงินที่ถูกต้อง');
      setShowToast(true);
      return false;
    }
    if (!formData.type) {
      setToastMessage('กรุณาเลือกประเภท');
      setShowToast(true);
      return false;
    }
    if (!formData.category) {
      setToastMessage('กรุณาเลือกหมวดหมู่');
      setShowToast(true);
      return false;
    }
    return true;
  };

  const getCategory = (): string[] => {
    if (formData.type === 'income') {
      return ['เงินเดือน', 'บอนัส', 'ลงทุน', 'อื่น ๆ'];
    } else {
      return ['อาหาร', 'ขนส่ง', 'ยูทิลิตี้', 'บันเทิง', 'การศึกษา', 'สุขภาพ', 'อื่น ๆ'];
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      note: '',
    });
    setEditingId(null);
  };

  const handleLoadExpense = async (expenseId: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'expenses', expenseId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          title: data.title || '',
          amount: data.amount?.toString() || '',
          type: data.type || 'expense',
          category: data.category || '',
          note: data.note || '',
        });
        setEditingId(expenseId);
        setShowActionSheet(false);
        setToastMessage('โหลดข้อมูลสำเร็จ');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error loading expense:', error);
      setToastMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setShowToast(true);
    }
  };

  const handleUpdateExpense = async () => {
    if (!validateForm() || !editingId) {
      return;
    }

    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'expenses', editingId), {
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        note: formData.note,
      });
      setToastMessage('อัปเดตข้อมูลสำเร็จ');
      setShowToast(true);
      resetForm();
    } catch (error) {
      console.error('Error updating expense:', error);
      setToastMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
      setToastMessage('ลบข้อมูลสำเร็จ');
      setShowToast(true);
      setShowActionSheet(false);
      if (editingId === expenseId) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      setToastMessage('เกิดข้อผิดพลาดในการลบข้อมูล');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>แก้ไข/ลบข้อมูล</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">แก้ไข/ลบรายรับ/รายจ่าย</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="tab2-container">
          {/* Edit Form Section */}
          {editingId && (
            <IonCard className="edit-form-card">
              <IonCardHeader>
                <IonCardTitle>แก้ไขรายการ</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="form-section">
                  <IonItem>
                    <IonLabel position="floating">ชื่อรายการ</IonLabel>
                    <IonInput
                      type="text"
                      placeholder="กรอกชื่อรายการ"
                      value={formData.title}
                      onIonChange={(e) =>
                        handleInputChange('title', e.detail.value || '')
                      }
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">จำนวนเงิน</IonLabel>
                    <IonInput
                      type="number"
                      placeholder="กรอกจำนวนเงิน"
                      value={formData.amount}
                      onIonChange={(e) =>
                        handleInputChange('amount', e.detail.value || '')
                      }
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>ประเภท</IonLabel>
                    <IonSelect
                      value={formData.type}
                      onIonChange={(e) => {
                        handleSelectChange('type', e.detail.value);
                        handleSelectChange('category', '');
                      }}
                    >
                      <IonSelectOption value="income">รายรับ</IonSelectOption>
                      <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel>หมวดหมู่</IonLabel>
                    <IonSelect
                      value={formData.category}
                      onIonChange={(e) =>
                        handleSelectChange('category', e.detail.value)
                      }
                    >
                      {getCategory().map((cat) => (
                        <IonSelectOption key={cat} value={cat}>
                          {cat}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">หมายเหตุ</IonLabel>
                    <IonTextarea
                      placeholder="กรอกหมายเหตุ (ไม่บังคับ)"
                      value={formData.note}
                      onIonChange={(e) =>
                        handleInputChange('note', e.detail.value || '')
                      }
                    />
                  </IonItem>
                </div>

                <div className="form-buttons">
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={handleUpdateExpense}
                    disabled={isLoading}
                  >
                    {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                  </IonButton>
                  <IonButton
                    expand="block"
                    color="medium"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    ยกเลิก
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {/* Transaction List Section */}
          <div className="list-section">
            <h3>ประวัติการบันทึก</h3>
            {loadingExpenses ? (
              <div className="loading-container">
                <IonSpinner />
              </div>
            ) : expenses.length === 0 ? (
              <div className="empty-state">
                <p>ไม่มีรายการ</p>
              </div>
            ) : (
              <IonList>
                {expenses.map((expense) => (
                  <IonItem
                    key={expense.id}
                    lines="none"
                    className="expense-list-item"
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
                    <div slot="end" className="action-buttons">
                      <IonButton
                        fill="clear"
                        color="primary"
                        size="small"
                        onClick={() => handleLoadExpense(expense.id)}
                        title="แก้ไข"
                      >
                        <IonIcon icon={create} />
                      </IonButton>
                      <IonButton
                        fill="clear"
                        color="danger"
                        size="small"
                        onClick={() => {
                          setSelectedExpenseId(expense.id);
                          setShowActionSheet(true);
                        }}
                        title="ลบ"
                      >
                        <IonIcon icon={trash} />
                      </IonButton>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            )}
          </div>
        </div>

        {/* Action Sheet for Delete Confirmation */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'ลบ',
              role: 'destructive',
              handler: () => {
                if (selectedExpenseId) {
                  handleDeleteExpense(selectedExpenseId);
                }
              },
            },
            {
              text: 'ยกเลิก',
              role: 'cancel',
            },
          ]}
        />

        {/* Toast Notification */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
