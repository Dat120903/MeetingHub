import { useState } from 'react';
import { rooms as initialRooms } from '../../data/mockData';
import RoomCard from '../common/RoomCard';

function RoomManagement() {
  const [rooms, setRooms] = useState(initialRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({
    id: Date.now(),
    name: '',
    capacity: '',
    facilities: [],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
  });
  const [facilityInput, setFacilityInput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'capacity') {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) || value === '') {
        setCurrentRoom({
          ...currentRoom,
          [name]: value === '' ? '' : numValue
        });
      }
    } else {
      setCurrentRoom({
        ...currentRoom,
        [name]: value
      });
    }
  };

  const handleAddFacility = () => {
    if (facilityInput.trim() === '') return;
    
    if (!currentRoom.facilities.includes(facilityInput.trim())) {
      setCurrentRoom({
        ...currentRoom,
        facilities: [...currentRoom.facilities, facilityInput.trim()]
      });
    }
    
    setFacilityInput('');
  };

  const handleRemoveFacility = (facility) => {
    setCurrentRoom({
      ...currentRoom,
      facilities: currentRoom.facilities.filter(f => f !== facility)
    });
  };

  const validateRoom = () => {
    if (!currentRoom.name) {
      setError('Vui lòng nhập tên phòng họp');
      return false;
    }
    
    if (!currentRoom.capacity) {
      setError('Vui lòng nhập sức chứa phòng họp');
      return false;
    }
    
    if (currentRoom.facilities.length === 0) {
      setError('Vui lòng thêm ít nhất một tiện nghi');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateRoom()) {
      return;
    }
    
    if (isEditMode) {
      setRooms(rooms.map(room => 
        room.id === currentRoom.id ? currentRoom : room
      ));
    } else {
      setRooms([...rooms, { ...currentRoom, id: Date.now() }]);
    }
    
    setCurrentRoom({
      id: Date.now(),
      name: '',
      capacity: '',
      facilities: [],
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setError('');
  };

  const handleAddRoom = () => {
    setCurrentRoom({
      id: Date.now(),
      name: '',
      capacity: '',
      facilities: [],
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80'
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditRoom = (roomId) => {
    const roomToEdit = rooms.find(room => room.id === roomId);
    if (roomToEdit) {
      setCurrentRoom(roomToEdit);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng họp này?')) {
      setRooms(rooms.filter(room => room.id !== roomId));
    }
  };

  const handleViewRoom = (roomId) => {
    // In a real app, this would navigate to a room detail page
    console.log('View room:', roomId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách phòng họp</h2>
        <button
          onClick={handleAddRoom}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm phòng họp mới
        </button>
      </div>
      
      {rooms.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-600">Chưa có phòng họp nào. Hãy thêm phòng họp mới.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <RoomCard 
              key={room.id}
              room={room}
              onView={handleViewRoom}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
              isAdmin={true}
            />
          ))}
        </div>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white flex justify-between items-center rounded-t-xl">
              <h3 className="text-xl font-bold">
                {isEditMode ? 'Chỉnh sửa phòng họp' : 'Thêm phòng họp mới'}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setError('');
                }}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng họp
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentRoom.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên phòng họp"
                  />
                </div>
                
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Sức chứa (người)
                  </label>
                  <input
                    type="text"
                    id="capacity"
                    name="capacity"
                    value={currentRoom.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập sức chứa phòng họp"
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    URL hình ảnh
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={currentRoom.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập URL hình ảnh"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiện nghi
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={facilityInput}
                      onChange={(e) => setFacilityInput(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tiện nghi"
                    />
                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentRoom.facilities.map((facility, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {facility}
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(facility)}
                          className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setError('');
                    }}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomManagement; 