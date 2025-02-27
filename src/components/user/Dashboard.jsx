import { useState } from 'react';
import PropTypes from 'prop-types';
import { rooms } from '../../data/mockData';
import RoomCard from '../common/RoomCard';
import BookMeeting from './BookMeeting';

function UserDashboard({ user }) {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleViewRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoomId(null);
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-green-500 rounded-full p-3 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Xin chào, {user.name}</h1>
            <p className="text-gray-600">Chọn phòng họp để xem lịch và đặt lịch</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-medium">Phòng họp khả dụng</p>
                <p className="text-3xl font-bold mt-1">{rooms.length}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-medium">Cuộc họp của bạn hôm nay</p>
                <p className="text-3xl font-bold mt-1">1</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách phòng họp</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <RoomCard 
            key={room.id}
            room={room}
            onView={handleViewRoom}
            isAdmin={false}
          />
        ))}
      </div>
      
      {isBookingModalOpen && selectedRoomId && (
        <BookMeeting 
          roomId={selectedRoomId}
          userId={user.id}
          onClose={handleCloseBookingModal}
        />
      )}
    </div>
  );
}

UserDashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default UserDashboard; 