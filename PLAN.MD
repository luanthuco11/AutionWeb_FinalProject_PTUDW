# Phase 1: SetUp
## 1: Database & Schema (Luan)
 --> Thiết kế database (sử dụng PostgreSQL để viết sql dựa trên DBdiagram, DBeaver để quản lý) 
 --> Up database len cloud (FireBase) 
 --> Viết script seed data 
 --> Export DB diagram
---------------------------
## 2: Backend Base Setup (Tri)
 --> Thiết lập Express server + TS config + cấu trúc thư mục (controllers, services, routes, middleware, utils) (Đã thực hiện)
     Nói sơ về backend: Luồng request-response sẽ tuân thủ restAPI cùng mô hình MVC nhu sau
        + Request 
        + Routes: Định tuyến api -> xac dinh endpoint va HTTP method, chi dinh controller tuong ung, gan them middleware(optional)
        + Middlewares: Xac thuc nguoi dung (se lam sau khi hoan thanh cac phan khac)
        + Controllers: Xu ly logic cua req/res, chi nhan req + goi service phu hop + tra ve res, khong lam viec voi dtb
        + Services: Giao tiep voi dtb, repo, ..
        + Response -> Front End
        + Utils: Dung de chua cac ham co the tai su dung trong backend
 --> Config .env, DB connection (Singleton) 
 --> Service 
 --> Viết helper logger & error handler cơ bản (Theo doi cac api, error neu co)
 --> Viet base class cho Routes, Controllers, Services
---------------------------
## 3: Shared types (Au)
 --> Định nghĩa type cho Auction, Item, Bid, Transaction,... để frontend import dùng chung
 --> Publish qua shared folder


---------------------------- 


# Phase 2: Api Development
## 1: USER & UPGRADES REQUEST API
 --> user.routes.ts
    GET	    /users/:id	                        Xem hồ sơ user (ẩn email nếu không phải chủ)	
    PATCH	/users/profile	                    Cập nhật hồ sơ cá nhân	
    PATCH	/users/password	                    Đổi mật khẩu (yêu cầu mật khẩu cũ)	
    GET	    /users/:id/summary	                Tổng hợp số sản phẩm tham gia, thắng, đánh giá  	
 --> upgrade.routes.ts
    POST	/upgrades/request	                Bidder gửi yêu cầu trở thành seller	
    GET	    /upgrades/status	                Xem tình trạng yêu cầu	
    PATCH	/upgrades/:id/approve	            Duyệt yêu cầu	
    PATCH	/upgrades/:id/reject	            Từ chối yêu cầu	
----------------------------
## 2: PRODUCT API
 --> Product.routes.ts
    GET	    /products	                                Lấy danh sách tất cả sản phẩm 
    GET	    /products/search	                        Tìm kiếm full-text theo tên, danh mục, sắp xếp theo thời gian, giá...	
    GET	    /products/top	                            Top 5 sản phẩm sắp kết thúc / nhiều lượt ra giá / giá cao nhất
    GET	    /products/:slug	                            Xem chi tiết sản phẩm	
    POST	/products	                                Seller đăng sản phẩm mới	
    PATCH	/products/:id/description	                Seller bổ sung mô tả	
    DELETE	/products/:id	                            Gỡ sản phẩm	
    GET	    /products/:productId/questions	            Lấy danh sách câu hỏi & trả lời	
    POST	/products/:productId/questions	            Đặt câu hỏi	
    POST	/products/:productId/:questionsId/answers	Người bán trả lời câu hỏi	
----------------------------
## 3: CATEGORY API
 --> Category.routes.ts
    GET	    /categories	                        Lấy danh sách tất cả danh mục 2 cấp	
    GET	    /categories/:id/products	        Lấy sản phẩm theo danh mục (phân trang)	
    POST	/categories	                        Tạo danh mục mới	    
    PATCH	/categories/:id	                    Cập nhật danh mục (Name)	
    DELETE	/categories/:id	                    Xoá danh mục        
----------------------------
## 4: FAVORITE (Watch List) API
--> favorite.route.ts
    GET	    /favorites	                        Xem danh sách sản phẩm yêu thích	
    POST	/favorites/:productId	            Thêm vào danh sách yêu thích	
    DELETE	/favorites/:productId	            Xoá khỏi danh sách yêu thích
---------------------------
## 5: RATING API
--> rating.route.ts
    GET	    /ratings/:userId	Xem chi tiết đánh giá của user	
    POST	/ratings	        Gửi đánh giá (+1 hoặc -1, có comment)		
---------------------------
## 6: BID & AUCTION API
--> bid.routes.ts
    GET	    /bids/:productId	                Xem lịch sử đấu giá 
    POST	/bids	                            Gửi giá đấu 
    POST	/bids/reject	                    Seller từ chối người mua cụ thể	Seller
--> auction.route.ts
    GET	    /auctions/active	                Lấy danh sách phiên đang diễn ra	
    GET	    /auctions/:productId/status	        Kiểm tra tình trạng (đang diễn ra / kết thúc / gia hạn)	
    POST	/auctions/:productId/extend	        Tự động gia hạn (trigger nội bộ hoặc admin chỉnh config)	
---------------------------
## 7: ORDER & TRANSACTION API
--> order.route.ts
    GET	    /orders	                            Xem danh sách đơn hàng của user	
    GET	    /orders/:productId	                Xem chi tiết đơn hàng (thắng đấu giá)	
    POST	/orders	                            Tạo đơn hàng sau khi kết thúc phiên	
    PATCH	/orders/:productId/status	        Cập nhật trạng thái (paid / shipped / completed / cancelled)	
    POST	/orders/:productId/chat	            Chat giữa buyer & seller	



src/
├── config/
│   ├── database.ts          # Singleton DB connection
│   └── env.ts               # Environment config
├── core/
│   ├── BaseRoute.ts         # Abstract base class cho routes
│   ├── BaseController.ts    # Abstract base class cho controllers
│   ├── BaseService.ts       # Abstract base class cho services
│   └── BaseRepository.ts    # Abstract base class cho repositories
├── middleware/
│   ├── errorHandler.ts      # Global error handling
│   ├── logger.ts            # Request logging
│   ├── validator.ts         # Request validation
│   └── auth.ts              # Authentication (implement sau)
├── utils/
│   ├── Logger.ts            # Logger utility (Winston/Pino)
│   ├── ApiResponse.ts       # Standardized API response
│   └── ApiError.ts          # Custom error classes
├── modules/                 # Feature-based organization
│   └── user/
│       ├── user.routes.ts
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.repository.ts
│       └── user.model.ts
└── app.ts                   # Express app setup