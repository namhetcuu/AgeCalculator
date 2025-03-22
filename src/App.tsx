import React, { useState, useCallback } from "react";
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonToast,
} from "@ionic/react";
import { shareSocial, camera, calculator, refresh } from "ionicons/icons";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Camera, CameraResultType } from "@capacitor/camera";
import "./App.css";

const App: React.FC = () => {
  const [birthYear, setBirthYear] = useState<number | "">("");
  const [age, setAge] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const calculateAge = useCallback(() => {
    if (!birthYear || typeof birthYear !== "number" || birthYear < 1900 || birthYear > new Date().getFullYear()) {
      setToastMessage("❌ Vui lòng nhập năm sinh hợp lệ!");
      return;
    }
    const currentYear = new Date().getFullYear();
    const userAge = currentYear - birthYear;
    setAge(userAge);
    sendNotification(userAge);
  }, [birthYear]);

  const sendNotification = useCallback(async (userAge: number) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "🎉 Kết quả tính tuổi 🎉",
            body: `Bạn ${userAge} tuổi rồi đó! 🥳`,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi gửi thông báo:", error);
    }
  }, []);

  const shareAge = useCallback(async () => {
    if (age !== null) {
      try {
        await Share.share({
          title: "Kết quả tính tuổi",
          text: `🎂 Tôi đã tính tuổi và tôi ${age} tuổi! 🎉`,
          dialogTitle: "Chia sẻ kết quả",
        });
      } catch (error) {
        console.error("Lỗi chia sẻ:", error);
      }
    }
  }, [age]);

  const takePhoto = useCallback(async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      setPhoto(image.webPath || null);
    } catch (error) {
      console.error("Lỗi chụp ảnh:", error);
    }
  }, []);

  const resetAll = useCallback(() => {
    setBirthYear("");
    setAge(null);
    setPhoto(null);
    setToastMessage("✅ Đã reset dữ liệu!");
  }, []);

  return (
    <IonApp>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonTitle>🎂 Ứng dụng Tính Tuổi 📅</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="app-container">
        <IonItem>
          <IonLabel position="floating">Nhập năm sinh</IonLabel>
          <IonInput
            type="number"
            className="app-input-field"
            value={birthYear}
            onIonChange={(e) => setBirthYear(parseInt(e.detail.value!, 10) || "")}
          />
        </IonItem>

        <div className="button-container">
          <IonButton className="transparent-button" onClick={calculateAge}>
            <IonIcon icon={calculator} slot="start" /> Tính tuổi
          </IonButton>

          {age !== null && <div className="age-result">🎈🤣🎈 Bạn {age} tuổi rồi! 🎈🤣</div>}
          {age !== null && <IonButton className="app-button-1" onClick={shareAge}>Chia sẻ</IonButton>}
          <IonButton className="app-button-1 tertiary" onClick={takePhoto}>Chụp ảnh</IonButton>
          <IonButton className="reset-button" onClick={resetAll}>Reset</IonButton>
        </div>

        {photo && <img src={photo} alt="Ảnh chụp" className="app-image" />}
        <IonToast isOpen={!!toastMessage} message={toastMessage || ""} duration={2000} />
      </IonContent>
    </IonApp>
  );
};

export default App;
