export type Option = {
  id: string;
  label: string;
  color: string;
  feedback: string;
  image: string;
};

export type Question = {
  id: string;
  title: string;
  hint?: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: "time-for",
    title: "Đêm Trung Thu, bạn thường ưu tiên dành thời gian cho ai?",
    options: [
      {
        id: "family-dinner",
        label: "Về nhà ăn bữa cơm ấm cúng cùng ba mẹ.",
        color: "#ff9a3c",
        image: "/images/phan_hoi_1_a.png",
        feedback:
          "Lựa chọn tuyệt vời! Ánh trăng ngoài kia dù rực rỡ đến đâu cũng không thể ấm áp bằng ánh mắt rạng rỡ của ba mẹ khi thấy con đẩy cửa bước vào.",
      },
      {
        id: "friends-lantern",
        label: "Lên phố lồng đèn dạo chơi cùng hội bạn thân.",
        color: "#8b74f0",
        image: "/images/phan_hoi_1_b.png",
        feedback:
          "Bạn bè lúc nào hẹn gặp cũng được, nhưng thanh xuân của ba mẹ lại trôi đi nhanh lắm. Trăng rằm năm nay, thử một lần rẽ lối về nhà sớm hơn xem, có hai người vẫn đang đứng ngóng bạn bên mâm cơm đấy!",
      },
    ],
  },
  {
    id: "gift",
    title: "Món quà bạn muốn mang về nhà nhất trong dịp này là gì?",
    options: [
      {
        id: "luxury-cake",
        label: "Một hộp bánh trung thu sang trọng, đắt tiền.",
        color: "#ff6b6b",
        image: "/images/phan_hoi_2_a.png",
        feedback:
          "Bánh ngon thì ai cũng thích, nhưng ba mẹ già rồi ăn đâu được bao nhiêu. Thứ họ nâng niu không phải là hộp bánh mạ vàng, mà là niềm tự hào vì con cái đã trưởng thành, giỏi giang.",
      },
      {
        id: "tea-pomelo",
        label: "Tự tay pha ấm trà, gọt đĩa bưởi và ngồi tâm sự.",
        color: "#4fde9a",
        image: "/images/phan_hoi_2_b.png",
        feedback:
          "Bình yên quá! Hương vị của sự chân thành và thời gian bạn chắt chiu dành cho gia đình chính là thức quà vô giá mà không một tiệm bánh lừng danh nào bán cả.",
      },
    ],
  },
  {
    id: "memory",
    title: "Ký ức nào làm bạn rưng rưng nhất khi nhớ về Trung Thu tuổi thơ?",
    options: [
      {
        id: "lantern-parade",
        label: "Rước đèn ống bơ, nến tò te khắp xóm với đám trẻ con.",
        color: "#ff9a3c",
        image: "/images/phan_hoi_3_a.png",
        feedback:
          "Dù chiếc lồng đèn ngày xưa được dán vụng về, nến đụng gió là tắt bùng, nhưng tiếng cười trong vắt đêm đó mãi là ánh sáng đẹp nhất mà người lớn chúng ta luôn thèm khát tìm lại.",
      },
      {
        id: "mother-story",
        label: "Gối đầu lên đùi mẹ nghe kể chuyện chú Cuội, chị Hằng.",
        color: "#8b74f0",
        image: "/images/phan_hoi_3_b.png",
        feedback:
          "Hơi ấm và giọng nói của mẹ đã nuôi dưỡng tâm hồn bạn lớn lên. Giờ bạn đã cao hơn mẹ rồi, Trung Thu này hãy để mẹ tựa vào vai bạn và nghe bạn kể chuyện ngược lại nhé.",
      },
    ],
  },
  {
    id: "far-from-home",
    title:
      "Nếu đêm rằm bạn phải đi làm xa nhà hoặc tăng ca mệt mỏi, bạn sẽ làm gì?",
    options: [
      {
        id: "video-call",
        label: "Gọi một cuốc điện thoại video về cho gia đình.",
        color: "#ff6b6b",
        image: "/images/phan_hoi_4_a.png",
        feedback:
          "Khoảng cách địa lý làm sao ngăn được tình thân. Chỉ cần nghe tiếng bạn cười qua màn hình nhỏ, đêm trăng của ba mẹ ở quê nhà bỗng chốc trở nên tròn đầy, viên mãn.",
      },
      {
        id: "keep-working",
        label: 'Lặng lẽ làm việc, tự nhủ "Trung thu cũng chỉ là một ngày bình thường".',
        color: "#4fde9a",
        image: "/images/phan_hoi_4_b.png",
        feedback:
          "Thành phố xô bồ đôi khi làm ta kiệt sức, nhưng đừng để sự cô đơn đánh gục bạn. Hãy nhớ rằng ở quê nhà, vẫn có người đang ngước lên cùng một vầng trăng và thầm cầu mong cho bạn luôn được bình an.",
      },
    ],
  },
];

export type Persona = {
  title: string;
  emoji: string;
  description: string;
};

export function getPersona(answers: Record<string, string>): Persona {
  const homeCalls =
    Number(answers["time-for"] === "family-dinner") +
    Number(answers.gift === "tea-pomelo") +
    Number(answers["far-from-home"] === "video-call");

  if (homeCalls >= 2) {
    return {
      title: "Người con luôn nhớ lối về",
      emoji: "🌕",
      description:
        "Dù phố đèn có rực rỡ đến đâu, bạn vẫn giữ một góc ấm cho mâm cơm nhà. Trung Thu này, ánh trăng đẹp nhất là khi soi vào gương mặt ba mẹ.",
    };
  }

  return {
    title: "Người đang tìm lối về dưới trăng",
    emoji: "🏮",
    description:
      "Đêm rằm không chỉ là một ngày trên lịch. Nếu lòng còn vương, hãy gọi về nhà — có người đang ngóng cùng một vầng trăng với bạn.",
  };
}
