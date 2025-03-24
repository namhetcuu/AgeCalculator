import React, { useState, useEffect, useCallback } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Geolocation } from "@capacitor/geolocation";
import "./App.css";

const App: React.FC = () => {
  const [celsiusTemp, setCelsiusTemp] = useState<string>("");
  const [fahrenheitTemp, setFahrenheitTemp] = useState<string>("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Hàm chuyển đổi nhiệt độ
  const convertTemperature = () => {
    const celsius = parseFloat(celsiusTemp);
    if (isNaN(celsius)) {
      setErrorMessage("Vui lòng nhập một giá trị nhiệt độ hợp lệ");
      return;
    }

    setErrorMessage("");
    const fahrenheit = (celsius * 9) / 5 + 32;
    setFahrenheitTemp(fahrenheit.toFixed(2));
    showNotification(celsius, fahrenheit);
  };

  // Hiển thị thông báo cục bộ
  const showNotification = useCallback(async (celsius: number, fahrenheit: number) => {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== "granted") {
        const request = await LocalNotifications.requestPermissions();
        if (request.display !== "granted") {
          console.warn("Quyền thông báo chưa được cấp.");
          return;
        }
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Chuyển đổi nhiệt độ",
            body: `${celsius}°C = ${fahrenheit.toFixed(2)}°F`,
            id: Date.now() % 2147483647, // Giảm giá trị ID để tránh lỗi Java int
            schedule: { at: new Date(Date.now() + 1000) },
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi gửi thông báo:", error);
    }
  }, []);

  // Chia sẻ kết quả
  const shareResult = async () => {
    if (!fahrenheitTemp) {
      setErrorMessage("Không có kết quả để chia sẻ");
      return;
    }
    await Share.share({
      title: "Kết quả chuyển đổi nhiệt độ",
      text: `${celsiusTemp}°C = ${fahrenheitTemp}°F`,
      url: "https://ionicframework.com/",
      dialogTitle: "Chia sẻ kết quả",
    });
  };

  // Lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      const permStatus = await Geolocation.checkPermissions();
  
      if (permStatus.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          setErrorMessage("Ứng dụng không có quyền truy cập vị trí.");
          return;
        }
      }
  
      const position = await Geolocation.getCurrentPosition();
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
  
    } catch (error) {
      setErrorMessage("Không thể lấy vị trí hiện tại.");
      console.error(error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Chuyển đổi nhiệt độ</h1>

        <div className="input-group">
          <label htmlFor="celsius">Nhiệt độ (°C):</label>
          <input
            id="celsius"
            type="number"
            value={celsiusTemp}
            onChange={(e) => setCelsiusTemp(e.target.value)}
            placeholder="Nhập độ C"
          />
        </div>

        <div className="button-group">
          <button className="primary-button" onClick={convertTemperature}>Chuyển đổi</button>
          <button className="secondary-button" onClick={shareResult} disabled={!fahrenheitTemp}>Chia sẻ kết quả</button>
          <button className="tertiary-button" onClick={getCurrentLocation}>Lấy vị trí hiện tại</button>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        {fahrenheitTemp && (
          <div className="result">
            <h2>Kết quả:</h2>
            <p>{celsiusTemp}°C = {fahrenheitTemp}°F</p>
          </div>
        )}

        {location && (
          <div className="location">
            <h3>Vị trí hiện tại:</h3>
            <p>Vĩ độ: {location.latitude}</p>
            <p>Kinh độ: {location.longitude}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
