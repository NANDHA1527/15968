# Stage 1: Priority Notification Inbox CLI

This is a TypeScript-based CLI application that retrieves campus notifications from a REST API, filters unread announcements, calculates priority scores based on placement weight and recency, and outputs the top 10 notifications using a custom Min-Heap implementation.

## 📁 File Structure
- `src/interfaces/Notification.ts`: TypeScript interfaces.
- `src/services/notificationService.ts`: Axios API client fetching and unread filtering.
- `src/utils/priorityCalculator.ts`: Priority scoring weight and timestamp parser.
- `src/utils/minHeap.ts`: Fixed-size Min Heap implementation ($O(N \log K)$).
- `src/utils/logger.ts`: Logger printing requests, responses, heap actions, and errors.
- `src/config.ts`: dotenv configuration.
- `src/index.ts`: Application entry point.
- `Notification_System_Design.md`: High level architectural documentation.

---

## ⚙️ Configuration

Create a `.env` file in the `stage-1` folder to customize behavior:
```env
NOTIFICATION_API_URL=http://4.224.186.213/evaluation-service/notifications
NOTIFICATION_API_TOKEN=your_authorization_token_here
HEAP_LIMIT=10
```

---

## 🚀 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
You can run the application directly using `ts-node`:
```bash
npm start
```

### 3. Build for Production
To compile the TypeScript code to Javascript in the `dist` directory:
```bash
npm run build
```
And run the built JavaScript file:
```bash
node dist/index.js
```

---

## 📝 Logging System
The application prints detailed logs to the stdout stream:
1. **API Requests**: Logs the URL and request attempts.
2. **API Responses**: Logs when responses are received, total items retrieved, and count of unread items.
3. **Heap Operations**: Logs when elements are inserted, heap roots are replaced (when a higher priority item is found), or when items are rejected.
4. **Errors**: Logs network timeouts, validation errors, and runtime failures with trace messages.
