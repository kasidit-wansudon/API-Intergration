self.addEventListener("push", (event) => {
  const notif = event.data.json().notification;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        // ถ้ามี client (หน้าเว็บ) ที่เปิดอยู่ ไม่ต้องแสดง Notification
        return;
      } else {
        // ถ้าไม่มี client ที่เปิดอยู่ ให้แสดง Notification
        return self.registration.showNotification(notif.title, {
          body: notif.body,
          icon: notif.image,
          data: {
            url: notif.click_action
          }
        });
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
