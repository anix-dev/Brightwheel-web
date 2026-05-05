import React from 'react'
const getStatusColor = (status: 'reject' | 'complete' | 'pending') => {
    switch (status) {
      case 'reject':
        return 'red';
      case 'complete':
        return 'green';
      case 'pending':
        return 'orange';
      default:
        return 'black';
    }
  };

  interface Notification {
    id: number;
    message: string;
    status: 'reject' | 'complete' | 'pending';
  }
  
  const notifications: Notification[] = [
    { id: 1, message: 'Task 1 has been completed', status: 'complete' },
    { id: 2, message: 'Task 2 is pending', status: 'pending' },
    { id: 3, message: 'Task 3 has been rejected', status: 'reject' },
  ];
  
const NotificationScreen = () => {
  return (
    <div style={{ padding: '20px' }}>
    <h2>Notifications</h2>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {notifications.map((notification) => (
        <li
          key={notification.id}
          style={{
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#f5f5f5',
          }}
        >
          <span>{notification.message}</span>
          <span
            style={{
              float: 'right',
              color: getStatusColor(notification.status),
              fontWeight: 'bold',
            }}
          >
            {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
          </span>
        </li>
      ))}
    </ul>
  </div>
  )
}

export default NotificationScreen
