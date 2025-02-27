import PropTypes from 'prop-types';

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-2xl font-bold tracking-tight">MeetingHub</span>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="bg-blue-800 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Xin chào, {user.name}</span>
              <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">{user.role === 'admin' ? 'Admin' : 'User'}</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="text-sm">
            Hệ thống quản lý phòng họp
          </div>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }),
  onLogout: PropTypes.func.isRequired
};

export default Navbar; 