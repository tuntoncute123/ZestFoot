
const MOCK_ADDRESSES = [
    "Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Bến Nghé, Quận 1, Hồ Chí Minh",
    "Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, Hồ Chí Minh",
    "Bitexco Financial Tower, 2 Hải Triều, Bến Nghé, Quận 1, Hồ Chí Minh",
    "Aeon Mall Tân Phú Celadon, 30 Bờ Bao Tân Thắng, Sơn Kỳ, Tân Phú, Hồ Chí Minh",
    "Nhà Hát Thành Phố, 07 Công Trường Lam Sơn, Bến Nghé, Quận 1, Hồ Chí Minh",
    "Chợ Bến Thành, Lê Lợi, Phường Bến Thành, Quận 1, Hồ Chí Minh",
    "Sân bay Tân Sơn Nhất, Trường Sơn, Tân Bình, Hồ Chí Minh",
    "Hồ Gươm, Hoàn Kiếm, Hà Nội",
    "Lăng Chủ Tịch Hồ Chí Minh, 2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội",
    "Royal City, 72A Nguyễn Trãi, Thượng Đình, Thanh Xuân, Hà Nội"
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const searchAddress = async (query) => {
    if (!query) return [];

    await delay(300); // 300ms delay for realism

    const lowerQuery = query.toLowerCase();
    return MOCK_ADDRESSES.filter(addr => addr.toLowerCase().includes(lowerQuery));
};
