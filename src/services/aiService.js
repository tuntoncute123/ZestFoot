import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllProducts } from './api';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: "Bạn là trợ lý ảo nhiệt tình của cửa hàng giày ZestFoot (còn gọi là HKT-Shoes). Nhiệm vụ của bạn là tư vấn giày, gợi ý size (kích cỡ), trả lời các thắc mắc về đơn hàng, vận chuyển, đổi trả. Luôn lịch sự, thân thiện và ngôn ngữ tự nhiên. Trả lời ngắn gọn, súc tích bằng tiếng Việt.\n\nQUAN TRỌNG NHẤT:\n1. Chỉ được phép gợi ý các sản phẩm có tên trong danh sách cửa hàng cung cấp. Nếu khách hỏi sản phẩm không có trong danh sách, hãy nói xin lỗi shop chưa có mặt hàng này và mời khách xem dòng sản phẩm khác đang có. Tuyệt đối không gợi ý sản phẩm của các thương hiệu hoặc tên giày không nằm trong danh sách của shop.\n2. Khi gợi ý sản phẩm cho khách, LUÔN LUÔN tạo đường link kèm hình ảnh thu nhỏ để khách dễ nhìn thấy bằng cú pháp Markdown như sau:\n`![Tên sản phẩm](URL_HÌNH_ẢNH)`\n`[Tên sản phẩm hiên thị](/product/ID_CỦA_SẢN_PHẨM)`\nVí dụ:\n`![Giày Nike Air Max](https://example.com/image.png)`\n`[Giày Nike Air Max](/product/12)`\nThông tin ID và URL hình ảnh của từng sản phẩm sẽ được cho trong danh sách.",
    });
}

let chatSession = null;

export const sendMessageToBot = async (message) => {
    if (!model) {
        return "Xin lỗi, hệ thống AI chưa được cấu hình. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env.";
    }

    try {
        if (!chatSession) {
            // Lấy danh sách sản phẩm để AI lấy làm ngữ cảnh
            const products = await getAllProducts();

            // Lấy toàn bộ danh sách sản phẩm và không giới hạn số lượng nữa
            const contextText = products && products.length > 0
                ? `Danh sách tất cả sản phẩm hiện có:\n` + products.map(p => `- Tên sản phẩm: ${p.name}\n  ID: ${p.id}\n  Hình ảnh: ${p.image || ''}\n  Hãng: ${p.brand}\n  Giá: ${p.salePrice ? p.salePrice.toLocaleString() + 'đ (đang Sale, Giá gốc: ' + p.price?.toLocaleString() + 'đ)' : (p.price?.toLocaleString() + 'đ')}\n  Giới tính: ${p.gender || 'Bất kỳ'}\n  Phân loại: ${p.category}`).join('\n\n')
                : 'Hiện không tải được danh sách sản phẩm.';

            const knowledgeBase = `Các thông tin chung về cửa hàng:
- Thời gian giao hàng: Nội thành (TP.HCM/Hà Nội) 1-2 ngày, Các tỉnh khác 3-5 ngày.
- Thanh toán: COD, Chuyển khoản QR, Ví điện tử.
- Đổi trả: Hỗ trợ đổi size hoặc mẫu trong vòng 7 ngày (giày chưa sử dụng, còn tem hộp).
- Size: Có bảng quy đổi size theo US, UK, và CM (chiều dài chân).
Dưới đây là thông tin sản phẩm:
${contextText}`;

            chatSession = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: `Đây là thông tin về cửa hàng của bạn. Hãy ghi nhớ để tư vấn: ${knowledgeBase}` }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Tuyệt vời, tôi đã ghi nhớ thông tin về chính sách cửa hàng và danh sách sản phẩm. Tôi đã sẵn sàng tư vấn và gợi ý sản phẩm cho khách hàng." }],
                    },
                ],
            });
        }

        const result = await chatSession.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error("Lỗi gọi Gemini AI:", error);
        return "Xin lỗi, hiện tại hệ thống tư vấn bị lỗi kết nối hoặc quá tải. Bạn vui lòng thử lại sau nhé.";
    }
};
