export const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User"
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    role: "user",
    name: "Regular User"
  }
];

export const rooms = [
  {
    id: 1,
    name: "Phòng họp A",
    capacity: 10,
    facilities: ["Máy chiếu", "Bảng", "Điều hòa"],
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Phòng họp B",
    capacity: 20,
    facilities: ["Máy chiếu", "Bảng", "Điều hòa", "Hệ thống âm thanh"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Phòng họp C",
    capacity: 5,
    facilities: ["Bảng", "Điều hòa"],
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  }
];

export const schedules = [
  {
    id: 1,
    roomId: 1,
    title: "Họp dự án A",
    startTime: "2025-10-15T09:00:00",
    endTime: "2025-10-15T11:00:00",
    createdBy: 2
  },
  {
    id: 2,
    roomId: 2,
    title: "Đào tạo nhân viên mới",
    startTime: "2025-10-16T13:00:00",
    endTime: "2025-10-16T15:00:00",
    createdBy: 1
  },
  {
    id: 3,
    roomId: 1,
    title: "Họp phòng marketing",
    startTime: "2025-10-17T10:00:00",
    endTime: "2025-10-17T12:00:00",
    createdBy: 2
  }
]; 