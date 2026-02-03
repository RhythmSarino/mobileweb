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
  IonBackButton,
  IonButtons,
  IonSpinner,
  IonLoading,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './EditExpense.css';

interface EditExpenseParams {
  id: string;
}

interface ExpenseForm {
  title: string;
  amount: string;
  type: string;
  category: string;
  note: string;
}

const EditExpense: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<EditExpenseParams>();
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
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load expense data from Firestore
  useEffect(() => {
    const loadExpense = async () => {
      try {
        const docRef = doc(db, 'expenses', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            amount: data.amount?.toString() || '',
            type: data.type || 'expense',
            category: data.category || '',
            note: data.note || '',
          });
        } else {
          setToastMessage('ไม่พบรายการที่ระบุ');
          setShowToast(true);
          setTimeout(() => history.push('/tab1'), 2000);
        }
      } catch (error) {
        console.error('Error loading expense:', error);
        setToastMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        setShowToast(true);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadExpense();
  }, [id, history]);

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

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const docRef = doc(db, 'expenses', id);
      await updateDoc(docRef, {
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        note: formData.note,
      });

      setToastMessage('อัปเดตข้อมูลสำเร็จ');
      setShowToast(true);

      // Navigate back after 1.5 seconds
      setTimeout(() => {
        history.push('/tab1');
      }, 1500);
    } catch (error) {
      console.error('Error updating expense:', error);
      setToastMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tab1" />
            </IonButtons>
            <IonTitle>แก้ไขรายรับ/รายจ่าย</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="loading-container">
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>แก้ไขรายรับ/รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading
          isOpen={isLoading}
          message="กำลังอัปเดตข้อมูล..."
        />
        <div className="edit-expense-container">
          <div className="form-section">
            {/* Title */}
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

            {/* Amount */}
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

            {/* Type */}
            <IonItem>
              <IonLabel>ประเภท</IonLabel>
              <IonSelect
                value={formData.type}
                onIonChange={(e) => {
                  handleSelectChange('type', e.detail.value);
                  // Reset category when type changes
                  handleSelectChange('category', '');
                }}
              >
                <IonSelectOption value="income">รายรับ</IonSelectOption>
                <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
              </IonSelect>
            </IonItem>

            {/* Category */}
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

            {/* Note */}
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

          {/* Buttons */}
          <div className="button-section">
            <IonButton
              expand="block"
              color="success"
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}
            </IonButton>
            <IonButton
              expand="block"
              color="medium"
              onClick={() => history.push('/tab1')}
              disabled={isLoading}
            >
              ยกเลิก
            </IonButton>
          </div>
        </div>

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

export default EditExpense;
