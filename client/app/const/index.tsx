import { InfoIcon, RatingIcon } from "@/components/icons";
import { UserCategory } from "@/components/UserCategoryTable";
export const userCategories: UserCategory[] = [
  {
    name: "Thông tin tài khoản",
    slug: "/info",
    icon: InfoIcon,
  },
  {
    name: "Chi tiết đánh giá",
    slug: "/rating",
    icon: RatingIcon,
  },
  {
    name: "Sản phẩm yêu thích",
    slug: "/favorite_products",
  },
  {
    name: "Sản phẩm đang đấu giá",
    slug: "/bidding_products",
  },
  {
    name: "Sản phẩm đã thắng",
    slug: "/winning_products",
  },
  {
    name: "Quyền seller",
    slug: "/seller_role",
  },
  {
    name: "Sản phẩm đang bán",
    slug: "/selling_products",
  },
  {
    name: "Sản phẩm đã bán",
    slug: "/sold_products",
  },
  {
    name: "Tạo sản phẩm",
    slug: "/selling_products/create",
  },
];
