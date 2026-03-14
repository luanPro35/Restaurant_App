export const LOW_CALORIE = [
    { label: "Nước Ép Cam Tươi", icon: "cup-water", color: "#3B82F6" },
    { label: "Trà Đào Cam Sả", icon: "tea", color: "#F59E0B" },
    { label: "Cà Phê Sữa Đá", icon: "coffee", color: "#6B7280" },
];

export const MEDIUM_CALORIE = [
    { label: "Bánh Mì Hội An", icon: "bread-slice", color: "#F97316" },
    { label: "Mì Quảng Tôm Thịt", icon: "noodles", color: "#D97706" },
    { label: "Khoai Tây Chiên", icon: "food", color: "#EAB308" },
    { label: "Nem Chua Rán", icon: "food", color: "#EF4444" },
    { label: "Trà Sữa Trân Châu", icon: "cup", color: "#EC4899" },
    { label: "Bia Heineken", icon: "beer", color: "#16A34A" },
];

export const HIGH_CALORIE = [
    { label: "Gà Rán KFC Style", icon: "food-drumstick", color: "#DC2626" },
    { label: "Phở Bò Đặc Biệt", icon: "noodles", color: "#10B981" },
    { label: "Cơm Tấm Sườn Bì Chả", icon: "rice", color: "#22C55E" },
    { label: "Bún Chả Hà Nội", icon: "noodles", color: "#84CC16" },
];

export const AI_SUGGESTIONS = [
    { label: "Năng lượng", icon: "lightning-bolt", color: "#F59E0B" },
    { label: "Nước uống", icon: "cup-water", color: "#3B82F6" },
    { label: "Đồ ăn vặt", icon: "cookie", color: "#EC4899" },
    { label: "Món gà", icon: "food-drumstick", color: "#E07B39" },
    { label: "Menu chính", icon: "book-open-variant", color: "#6366F1" },
];

export const CALORIE = [
    { label: "Ít calo", data: LOW_CALORIE, color: "#10B981", icon: "leaf" },
    { label: "Vừa calo", data: MEDIUM_CALORIE, color: "#F59E0B", icon: "lightning-bolt" },
    { label: "Nhiều calo", data: HIGH_CALORIE, color: "#EF4444", icon: "fire" },
];

const CHILD = [
    { label: "Mì Quảng Tôm Thịt", icon: "noodles", color: "#F59E0B" },
    { label: "Phở Bò Đặc Biệt", icon: "noodles", color: "#10B981" },
    { label: "Bánh Mì Hội An", icon: "bread-slice", color: "#F97316" },
    { label: "Khoai Tây Chiên", icon: "french-fries", color: "#EAB308" },
    { label: "Trà Sữa Trân Châu", icon: "cup", color: "#EC4899" },
    { label: "Trà Đào Cam Sả", icon: "tea", color: "#FB923C" },
    { label: "Nước Ép Cam Tươi", icon: "cup-water", color: "#3B82F6" },
];

const ADULT = [
    { label: "Gà Rán KFC Style", icon: "food-drumstick", color: "#DC2626" },
    { label: "Trà Sữa Trân Châu", icon: "cup", color: "#EC4899" },
    { label: "Mì Quảng Tôm Thịt", icon: "noodles", color: "#F59E0B" },
    { label: "Cà Phê Sữa Đá", icon: "coffee", color: "#6B7280" },
    { label: "Bánh Mì Hội An", icon: "bread-slice", color: "#F97316" },
    { label: "Khoai Tây Chiên", icon: "french-fries", color: "#EAB308" },
    { label: "Trà Đào Cam Sả", icon: "tea", color: "#FB923C" },
    { label: "Nem Chua Rán", icon: "food", color: "#EF4444" },
    { label: "Phở Bò Đặc Biệt", icon: "noodles", color: "#10B981" },
    { label: "Cơm Tấm Sườn Bì Chả", icon: "rice", color: "#22C55E" },
    { label: "Nước Ép Cam Tươi", icon: "cup-water", color: "#3B82F6" },
    { label: "Bia Heineken", icon: "beer", color: "#16A34A" },
    { label: "Bún Chả Hà Nội", icon: "noodles", color: "#84CC16" },
];

const OLD = [
    { label: "Phở Bò Đặc Biệt", icon: "noodles", color: "#10B981" },
    { label: "Mì Quảng Tôm Thịt", icon: "noodles", color: "#F59E0B" },
    { label: "Bún Chả Hà Nội", icon: "noodles", color: "#84CC16" },
    { label: "Nước Ép Cam Tươi", icon: "cup-water", color: "#3B82F6" },
    { label: "Trà Đào Cam Sả", icon: "tea", color: "#FB923C" },
    { label: "Bánh Mì Hội An", icon: "bread-slice", color: "#F97316" },
];

export const AGE = [
    {
        label: "Trẻ em",
        data: CHILD,
        icon: "baby-face-outline",
        color: "#F472B6"
    },
    {
        label: "Người lớn",
        data: ADULT,
        icon: "account",
        color: "#3B82F6"
    },
    {
        label: "Người già",
        data: OLD,
        icon: "account-tie-voice",
        color: "#6B7280"
    }
];
