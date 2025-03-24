# AgeCalculator App

## Hướng dẫn chạy ứng dụng

### Yêu cầu hệ thống
- Node.js và npm (cài đặt từ [nodejs.org](https://nodejs.org/))
- Capacitor CLI: `npm install -g @capacitor/cli`
- Android Studio (nếu chạy trên Android)
- Xcode (nếu chạy trên iOS)

### Cài đặt và khởi chạy ứng dụng
1. **Cài đặt các dependencies:**
   ```sh
   npm install
   ```
2. **Build ứng dụng:**
   ```sh
   npm run build
   ```
3. **Đồng bộ với Capacitor:**
   ```sh
   npx cap sync
   ```
4. **Chạy ứng dụng trên trình duyệt:**
   ```sh
   npm run dev
   ```
5. **Chạy trên thiết bị hoặc giả lập Android:**
   ```sh
   npx cap run android
   ```
6. **Chạy trên thiết bị hoặc giả lập iOS:**
   ```sh
   npx cap run ios
   ```

### Ghi chú
- Đảm bảo đã cấp quyền `ACCESS_FINE_LOCATION` và `ACCESS_COARSE_LOCATION` trong `AndroidManifest.xml` nếu cần sử dụng tính năng định vị.
- Kiểm tra quyền truy cập vị trí trước khi gọi `Geolocation.getCurrentPosition()`.
- Nếu gặp lỗi, thử chạy `npx cap doctor` để kiểm tra cấu hình.

Chúc bạn thành công!

