import { useState, useEffect } from 'react';
import { schedules as initialSchedules, rooms, users } from '../../data/mockData';

function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState({
    id: Date.now(),
    roomId: '',
    title: '',
    startTime: '',
    endTime: '',
    createdBy: 1, 
    attendees: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [error, setError] = useState('');
  const [attendeeInput, setAttendeeInput] = useState('');

  useEffect(() => {
    const sortedSchedules = [...initialSchedules].sort((a, b) => 
      new Date(b.startTime) - new Date(a.startTime)
    );
    setSchedules(sortedSchedules);
    setFilteredSchedules(sortedSchedules);
  }, []);

  useEffect(() => {
    let result = [...schedules];
    
    if (filterRoom) {
      result = result.filter(schedule => schedule.roomId === parseInt(filterRoom));
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(schedule => 
        schedule.title.toLowerCase().includes(term)
      );
    }
    
    setFilteredSchedules(result);
  }, [schedules, searchTerm, filterRoom]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN');
  };

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Không xác định';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Không xác định';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule({
      ...currentSchedule,
      [name]: value
    });
  };

  const handleAddAttendee = () => {
    if (attendeeInput.trim() === '') return;
    
    if (!currentSchedule.attendees.includes(attendeeInput.trim())) {
      setCurrentSchedule({
        ...currentSchedule,
        attendees: [...currentSchedule.attendees, attendeeInput.trim()]
      });
    }
    
    setAttendeeInput('');
  };

  const handleRemoveAttendee = (attendee) => {
    setCurrentSchedule({
      ...currentSchedule,
      attendees: currentSchedule.attendees.filter(a => a !== attendee)
    });
  };

  const validateSchedule = () => {
    if (!currentSchedule.title) {
      setError('Vui lòng nhập tiêu đề cuộc họp');
      return false;
    }
    
    if (!currentSchedule.roomId) {
      setError('Vui lòng chọn phòng họp');
      return false;
    }
    
    if (!currentSchedule.startTime || !currentSchedule.endTime) {
      setError('Vui lòng nhập thời gian bắt đầu và kết thúc');
      return false;
    }
    
    const start = new Date(currentSchedule.startTime);
    const end = new Date(currentSchedule.endTime);
    
    if (start >= end) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu');
      return false;
    }
    
    const isOverlapping = schedules.some(schedule => {
      if (schedule.id === currentSchedule.id || schedule.roomId !== parseInt(currentSchedule.roomId)) {
        return false;
      }
      
      const scheduleStart = new Date(schedule.startTime);
      const scheduleEnd = new Date(schedule.endTime);
      
      return (
        (start >= scheduleStart && start < scheduleEnd) ||
        (end > scheduleStart && end <= scheduleEnd) ||
        (start <= scheduleStart && end >= scheduleEnd)
      );
    });
    
    if (isOverlapping) {
      setError('Thời gian này đã có lịch họp khác trong cùng phòng');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateSchedule()) {
      return;
    }
    
    const formattedSchedule = {
      ...currentSchedule,
      roomId: parseInt(currentSchedule.roomId)
    };
    
    if (isEditMode) {
      setSchedules(schedules.map(schedule => 
        schedule.id === formattedSchedule.id ? formattedSchedule : schedule
      ));
    } else {
      setSchedules([...schedules, { ...formattedSchedule, id: Date.now() }]);
    }
    
    setCurrentSchedule({
      id: Date.now(),
      roomId: '',
      title: '',
      startTime: '',
      endTime: '',
      createdBy: 1, 
      attendees: []
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setError('');
  };

  const handleAddSchedule = () => {
    setCurrentSchedule({
      id: Date.now(),
      roomId: '',
      title: '',
      startTime: '',
      endTime: '',
      createdBy: 1, 
      attendees: []
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditSchedule = (scheduleId) => {
    const scheduleToEdit = schedules.find(schedule => schedule.id === scheduleId);
    if (scheduleToEdit) {
      setCurrentSchedule({
        ...scheduleToEdit,
        roomId: scheduleToEdit.roomId.toString()
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch họp này?')) {
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Quản lý lịch họp</h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm lịch họp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả phòng</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
          
          <button
            onClick={handleAddSchedule}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm lịch họp
          </button>
        </div>
      </div>
      
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch họp nào</h3>
          <p className="text-gray-500">
            {searchTerm || filterRoom 
              ? 'Không có lịch họp nào phù hợp với bộ lọc của bạn.' 
              : 'Chưa có lịch họp nào được tạo. Hãy thêm lịch họp mới.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phòng họp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian bắt đầu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian kết thúc
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người tạo
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map(schedule => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.title}</div>
                      {schedule.attendees && schedule.attendees.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {schedule.attendees.length} người tham dự
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getRoomName(schedule.roomId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDateTime(schedule.startTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDateTime(schedule.endTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getUserName(schedule.createdBy)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditSchedule(schedule.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white flex justify-between items-center rounded-t-xl">
              <h3 className="text-xl font-bold">
                {isEditMode ? 'Chỉnh sửa lịch họp' : 'Thêm lịch họp mới'}
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
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
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
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề cuộc họp
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentSchedule.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tiêu đề cuộc họp"
                  />
                </div>
                
                <div>
                  <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng họp
                  </label>
                  <select
                    id="roomId"
                    name="roomId"
                    value={currentSchedule.roomId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn phòng họp</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.name} (Sức chứa: {room.capacity} người)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={currentSchedule.startTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian kết thúc
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      value={currentSchedule.endTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người tham dự
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={attendeeInput}
                      onChange={(e) => setAttendeeInput(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên người tham dự"
                    />
                    <button
                      type="button"
                      onClick={handleAddAttendee}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentSchedule.attendees && currentSchedule.attendees.map((attendee, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {attendee}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttendee(attendee)}
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

export default ScheduleManagement; 