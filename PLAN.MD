# Phase 1: SetUp

## 1: Database & Schema (Luan)

--> Thiết kế database (sử dụng PostgreSQL để viết sql dựa trên DBdiagram, DBeaver để quản lý)
--> Up database len cloud (FireBase)
--> Viết script seed data
--> Export DB diagram

---

## 2: Backend Base Setup (Tri)

--> Thiết lập Express server + TS config + cấu trúc thư mục (controllers, services, routes, middleware, utils) (Đã thực hiện)
Nói sơ về backend: Luồng request-response sẽ tuân thủ restAPI cùng mô hình MVC nhu sau + Request + Routes: Định tuyến api -> xac dinh endpoint va HTTP method, chi dinh controller tuong ung, gan them middleware(optional) + Middlewares: Xac thuc nguoi dung (se lam sau khi hoan thanh cac phan khac) + Controllers: Xu ly logic cua req/res, chi nhan req + goi service phu hop + tra ve res, khong lam viec voi dtb + Services: Giao tiep voi dtb, repo, .. + Response -> Front End + Utils: Dung de chua cac ham co the tai su dung trong backend
--> Config .env, DB connection (Singleton)
--> Service
--> Viết helper logger & error handler cơ bản (Theo doi cac api, error neu co)
--> Viet base class cho Routes, Controllers, Services

---

## 3: Shared types (Au)

--> Định nghĩa type cho Auction, Item, Bid, Transaction,... để frontend import dùng chung
--> Publish qua shared folder

---

# Phase 2: Api Development

## 1: USER & UPGRADES REQUEST API (Hà)

--> user.routes.ts
GET /user/profile/:id Xem hồ sơ user (ẩn email nếu không phải chủ)
PATCH /user/profile Cập nhật hồ sơ cá nhân
PATCH /user/password Đổi mật khẩu (yêu cầu mật khẩu cũ)
--> upgrade.routes.ts
POST /upgrade/request Bidder gửi yêu cầu trở thành seller
GET /upgrade/status Xem tình trạng yêu cầu
PATCH /upgrade/approve Duyệt yêu cầu
PATCH /upgrade/:id/reject Từ chối yêu cầu

---

## 2: PRODUCT API (Trí)
 --> product.routes.ts
    GET	    /product	                                Lấy danh sách tất cả sản phẩm 
    GET	    /product?query&category&sort	                        Tìm kiếm full-text theo tên, danh mục, sắp xếp theo thời gian, giá...	
    GET	    /product/top	                            Top 5 sản phẩm sắp kết thúc / nhiều lượt ra giá / giá cao nhất
    GET	    /product/:productId	                            Xem chi tiết sản phẩm	
    POST	/product	                                Seller đăng sản phẩm mới	 --> check --> ok 
    PATCH	/product/:productId/description	                Seller bổ sung mô tả	--> ok
    DELETE	/product/:productId	                            Gỡ sản phẩm	 --> ok
    GET	    /product/:productId/questions	            Lấy danh sách câu hỏi & trả lời  --> ok	
    POST	/product/:productId/questions	            Đặt câu hỏi	
    POST	/product/:productId/:questionsId/answers	Người bán trả lời câu hỏi
    GET	    /product/:productId/status	        Kiểm tra tình trạng (đang diễn ra / kết thúc / gia hạn)	
    PATCH	/product/:productId/extend	        Tự động gia hạn 
----------------------------
## 3: CATEGORY API (Luân)

--> ategory.routes.ts
Done GET /category Lấy danh sách tất cả danh mục 2 cấp
Done GET /category/:id/products Lấy sản phẩm theo danh mục (phân trang)
Done POST /category Tạo danh mục mới   
Done PATCH /category/:id Cập nhật danh mục (Name)
Done DELETE /category/:id Xoá danh mục

---

## 4: FAVORITE (Watch List) API (Âu)

--> favorite.route.ts
    GET	    /favorite	                        Xem danh sách sản phẩm yêu thích	
    POST	/favorite/:productId/           Thêm vào danh sách yêu thích
    DELETE	/favorite/:productId/           Xóa khỏi danh sách yêu thích
---------------------------
## 5: RATING API (Hà)

--> rating.route.ts
GET /rating/:userId Xem chi tiết đánh giá của user
POST /rating Gửi đánh giá (0 hoặc 1, có thể không có comment)

---

## 6: BID & AUCTION API (Luân)

--> bid.routes.ts
done GET /bid/:productId Xem lịch sử đấu giá
done POST /bid Gửi giá đấu
done POST /bid/reject Seller từ chối người mua cụ thể Seller

---

## 7: ORDER & TRANSACTION API (Âu)

--> order.route.ts
    GET	    /order	                            Xem danh sách đơn hàng của user	
    GET	    /order/:productId	                Xem chi tiết đơn hàng (thắng đấu giá)	
    POST	/order	                            Tạo đơn hàng sau khi kết thúc phiên	
    PATCH	/order/:productId/:status	        Cập nhật trạng thái (paid / shipped / completed / cancelled)
    GET   /order/:productId/chat             Lấy dữ liệu chat giữa buyer & seller	
    POST	/order/:productId/chat	            Cập nhật chat giữa buyer & seller	



src/
├── config/
│ ├── database.ts # Singleton DB connection
│ └── env.ts # Environment config
├── core/
│ ├── BaseRoute.ts # Abstract base class cho routes
│ ├── BaseController.ts # Abstract base class cho controllers
│ ├── BaseService.ts # Abstract base class cho services
│ └── BaseRepository.ts # Abstract base class cho repositories
├── middleware/
│ ├── errorHandler.ts # Global error handling
│ ├── logger.ts # Request logging
│ ├── validator.ts # Request validation
│ └── auth.ts # Authentication (implement sau)
├── utils/
│ ├── Logger.ts # Logger utility (Winston/Pino)
│ ├── ApiResponse.ts # Standardized API response
│ └── ApiError.ts # Custom error classes
├── modules/ # Feature-based organization
│ └── user/
│ ├── user.routes.ts
│ ├── user.controller.ts
│ ├── user.service.ts
│ ├── user.repository.ts
│ └── user.model.ts
└── app.ts # Express app setup
