const UnauthorizedAccess = () => (
  <div className="w-screen flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
    <h1 className="text-6xl font-extrabold text-red-600">401</h1>
    <h2 className="text-3xl font-semibold mt-4">
      Truy cập bị từ chối (Unauthorized)
    </h2>
    <p className="text-gray-600 mt-2">
      Bạn không có quyền truy cập vào nội dung này.
    </p>
    {/* Thêm nút quay lại trang chủ hoặc đăng nhập */}
  </div>
);

export default UnauthorizedAccess;
