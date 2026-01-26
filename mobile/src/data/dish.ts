export interface Product {
  id: number;
  categoryId: number;
  name: string;
  price: string;
  description?: string;
  image?: string;
}

export const PRODUCTS: Product[] = [
  // 1. Khai vị
  {
    id: 101,
    categoryId: 1,
    name: "Ngô chiên",
    price: "40.000đ",
    description: "Ngô ngọt chiên giòn, thơm bơ.",
  },
  {
    id: 102,
    categoryId: 1,
    name: "Khoai chiên",
    price: "40.000đ",
    description: "Khoai tây chiên vàng giòn rụm.",
  },
  {
    id: 103,
    categoryId: 1,
    name: "Bánh mì chiên",
    price: "20.000đ",
    description: "Bánh mì chiên bơ tỏi thơm lừng.",
  },
  {
    id: 104,
    categoryId: 1,
    name: "Bánh bao chiên",
    price: "30.000đ",
    description: "Bánh bao nhỏ chiên vàng, nhân thịt.",
  },

  // 2. Súp các loại
  {
    id: 201,
    categoryId: 2,
    name: "Súp cá hồi",
    price: "20.000đ/bát",
    description: "Súp cá hồi nấu nấm hương, thanh ngọt.",
  },
  {
    id: 202,
    categoryId: 2,
    name: "Súp cua",
    price: "25.000đ/bát",
    description: "Súp cua bể tươi ngon, đậm đà.",
  },
  {
    id: 203,
    categoryId: 2,
    name: "Súp hải sản",
    price: "25.000đ/bát",
    description: "Hải sản tươi nấu cùng rau củ.",
  },
  {
    id: 204,
    categoryId: 2,
    name: "Súp gà ngô kem",
    price: "15.000đ/bát",
    description: "Gà xé phay nấu ngô non kem tươi.",
  },
  {
    id: 205,
    categoryId: 2,
    name: "Súp rau thôn dã",
    price: "20.000đ/bát",
    description: "Rau củ quả tươi ngon theo mùa.",
  },
  {
    id: 206,
    categoryId: 2,
    name: "Súp lươn",
    price: "20.000đ/bát",
    description: "Lươn đồng nấu súp, bổ dưỡng.",
  },

  // 3. Rau theo mùa
  {
    id: 301,
    categoryId: 3,
    name: "Rau bò khai xào tỏi",
    price: "50.000đ",
    description: "Rau bò khai rừng xào tỏi thơm.",
  },
  {
    id: 302,
    categoryId: 3,
    name: "Rau dớn xào đu đủ",
    price: "50.000đ",
    description: "Đặc sản rau dớn xào cùng đu đủ.",
  },
  {
    id: 303,
    categoryId: 3,
    name: "Rau bí xào",
    price: "40.000đ",
    description: "Ngọn bí xanh non xào tỏi.",
  },
  {
    id: 304,
    categoryId: 3,
    name: "Rau muống xào",
    price: "40.000đ",
    description: "Rau muống xanh mướt xào tỏi.",
  },
  {
    id: 305,
    categoryId: 3,
    name: "Măng tơi xào",
    price: "40.000đ",
    description: "Măng tơi xào tỏi giản dị, ngon miệng.",
  },
  {
    id: 306,
    categoryId: 3,
    name: "Rau lang xào",
    price: "40.000đ",
    description: "Ngọn rau lang xào tỏi dân dã.",
  },
  {
    id: 307,
    categoryId: 3,
    name: "Ngọn su su xào",
    price: "40.000đ",
    description: "Ngọn su su Tam Đảo xào tỏi.",
  },
  {
    id: 308,
    categoryId: 3,
    name: "Rau bí xào nấm tươi",
    price: "70.000đ",
    description: "Rau bí xào cùng nấm tươi ngọt lịm.",
  },

  // 4. Nộm và Salad
  {
    id: 401,
    categoryId: 4,
    name: "Nộm ngó sen tôm thịt",
    price: "120.000đ",
    description: "Ngó sen giòn, tôm thịt tươi ngon.",
  },
  {
    id: 402,
    categoryId: 4,
    name: "Nộm sứa phồng tôm",
    price: "60.000đ",
    description: "Sứa biển giòn sần sật, ăn kèm phồng tôm.",
  },
  {
    id: 403,
    categoryId: 4,
    name: "Nộm dưa chuột (dưa cà)",
    price: "40.000đ",
    description: "Dưa chuột mát lạnh trộn chua ngọt.",
  },
  {
    id: 404,
    categoryId: 4,
    name: "Nộm rau má",
    price: "50.000đ",
    description: "Rau má tươi trộn chua cay.",
  },
  {
    id: 405,
    categoryId: 4,
    name: "Nộm rau dớn",
    price: "50.000đ",
    description: "Rau dớn rừng trộn lạc rang bùi bùi.",
  },
  {
    id: 406,
    categoryId: 4,
    name: "Nộm hoa chuối",
    price: "50.000đ",
    description: "Hoa chuối thái rối trộn tai heo.",
  },
  {
    id: 407,
    categoryId: 4,
    name: "Salad rau trộn cá ngừ",
    price: "100.000đ",
    description: "Rau xanh tổng hợp sốt cá ngừ.",
  },
  {
    id: 408,
    categoryId: 4,
    name: "Salad rau trộn",
    price: "60.000đ",
    description: "Rau tươi các loại sốt mayonnaise.",
  },
  {
    id: 409,
    categoryId: 4,
    name: "Salad rau mầm",
    price: "60.000đ",
    description: "Rau mầm sạch trộn dầu giấm.",
  },
  {
    id: 410,
    categoryId: 4,
    name: "Salad củ quả",
    price: "100.000đ",
    description: "Củ quả tươi ngon thái hạt lựu.",
  },
  {
    id: 411,
    categoryId: 4,
    name: "Salad dầu dấm",
    price: "50.000đ",
    description: "Xà lách trộn dầu giấm thanh mát.",
  },

  // 5. Gà ta
  {
    id: 501,
    categoryId: 5,
    name: "Gà tần thuốc bắc ngải cứu",
    price: "350.000đ/con",
    description: "Gà ta tần hạt sen, thuốc bắc bổ dưỡng.",
  },
  {
    id: 502,
    categoryId: 5,
    name: "Gà hấp lá chanh",
    price: "200.000đ - 230.000đ",
    description: "Gà hấp giữ nguyên vị ngọt, thơm lá chanh.",
  },
  {
    id: 503,
    categoryId: 5,
    name: "Gà ủ muối hột",
    price: "400.000đ/con",
    description: "Gà ủ muối da giòn, thịt dai ngọt.",
  },
  {
    id: 504,
    categoryId: 5,
    name: "Gà nướng ngũ vị",
    price: "400.000đ/con",
    description: "Gà nướng ngũ vị hương đậm đà.",
  },
  {
    id: 505,
    categoryId: 5,
    name: "Gà xào nấm tươi",
    price: "200.000đ/đĩa",
    description: "Thịt gà xào nấm tươi ngon ngọt.",
  },
  {
    id: 506,
    categoryId: 5,
    name: "Gà hấp cải xanh nấm hương",
    price: "250.000đ/đĩa",
    description: "Gà hấp cải bẹ xanh, nấm hương.",
  },
  {
    id: 507,
    categoryId: 5,
    name: "Gà hấp mắm nhĩ",
    price: "250.000đ/đĩa",
    description: "Gà hấp mắm nhĩ đậm vị truyền thống.",
  },
  {
    id: 508,
    categoryId: 5,
    name: "Gỏi gà xé chua ngọt",
    price: "200.000đ/nửa con",
    description: "Gà xé trộn hành tây rau răm chua ngọt.",
  },
  {
    id: 509,
    categoryId: 5,
    name: "Gà sốt dầu hào",
    price: "230.000đ/nửa con",
    description: "Gà sốt dầu hào đậm đà đưa cơm.",
  },
  {
    id: 510,
    categoryId: 5,
    name: "Gà rang muối",
    price: "230.000đ/nửa con",
    description: "Gà rang muối giòn tan, vị mặn vừa.",
  },
  {
    id: 511,
    categoryId: 5,
    name: "Gà rang gừng",
    price: "200.000đ/nửa con",
    description: "Gà rang gừng ấm bụng ngày lạnh.",
  },
  {
    id: 512,
    categoryId: 5,
    name: "Gà xào gừng",
    price: "200.000đ/nửa con",
    description: "Gà xào gừng tươi thơm nức mũi.",
  },
  {
    id: 513,
    categoryId: 5,
    name: "Canh gà gừng",
    price: "200.000đ/nửa con",
    description: "Canh gà gừng nóng hổi, giải cảm.",
  },
  {
    id: 514,
    categoryId: 5,
    name: "Gà chiên mắm",
    price: "350.000đ/con",
    description: "Cánh gà chiên mắm tỏi ớt đậm đà.",
  },
  {
    id: 515,
    categoryId: 5,
    name: "Gà quay mật ong",
    price: "400.000đ/con",
    description: "Gà quay mật ong da giòn óng ả.",
  },

  // 6. Gà đen
  {
    id: 601,
    categoryId: 6,
    name: "Gà đen nướng mọi",
    price: "500.000đ/con",
    description: "Gà đen H'Mông nướng than hoa.",
  },
  {
    id: 602,
    categoryId: 6,
    name: "Gà đen hấp lá chanh",
    price: "500.000đ/con",
    description: "Gà đen hấp lá chanh giữ vị ngọt tự nhiên.",
  },
  {
    id: 603,
    categoryId: 6,
    name: "Gà đen ủ muối hột",
    price: "500.000đ/con",
    description: "Đặc sản gà đen ủ muối hột.",
  },
  {
    id: 604,
    categoryId: 6,
    name: "Gà đen xào gừng",
    price: "500.000đ/con",
    description: "Gà đen xào gừng bổ dưỡng.",
  },
  {
    id: 605,
    categoryId: 6,
    name: "Lẩu gà đen dân tộc",
    price: "700.000đ/nồi",
    description: "Lẩu gà đen nấu măng chua, hạt dổi.",
  },

  // 7. Trà Trái Cây & Giải Nhiệt
  {
    id: 701,
    categoryId: 7,
    name: "Trà Đào Cam Sả",
    price: "35.000đ",
    description: "Trà đào kết hợp cam sả thơm mát.",
  },
  {
    id: 702,
    categoryId: 7,
    name: "Trà Mãng Cầu",
    price: "35.000đ",
    description: "Trà mãng cầu tươi giải nhiệt.",
  },
  {
    id: 703,
    categoryId: 7,
    name: "Trà Dâu Tây / Dâu Tằm",
    price: "30.000đ",
    description: "Trà dâu chua ngọt hấp dẫn.",
  },
  {
    id: 704,
    categoryId: 7,
    name: "Trà Quất (Tắc) Mật Ong",
    price: "25.000đ",
    description: "Trà quất mật ong tốt cho cổ họng.",
  },
  {
    id: 705,
    categoryId: 7,
    name: "Nước Sấu / Mơ ngâm",
    price: "20.000đ",
    description: "Nước sấu/mơ ngâm đường phèn đơn giản.",
  },
  {
    id: 706,
    categoryId: 7,
    name: "Trà Đá / Trà Nóng",
    price: "5.000đ",
    description: "Trà mạn ướp hương nhài/sen.",
  },

  // 8. Nước Ép Tươi
  {
    id: 801,
    categoryId: 8,
    name: "Nước Cam vắt tươi",
    price: "40.000đ",
    description: "Cam sành vắt tươi nguyên chất.",
  },
  {
    id: 802,
    categoryId: 8,
    name: "Nước ép Dứa (Thơm)",
    price: "35.000đ",
    description: "Nước ép dứa thơm ngon, đẹp da.",
  },
  {
    id: 803,
    categoryId: 8,
    name: "Nước ép Dưa hấu",
    price: "30.000đ",
    description: "Nước ép dưa hấu ngọt mát.",
  },
  {
    id: 804,
    categoryId: 8,
    name: "Dừa quả tươi",
    price: "35.000đ",
    description: "Dừa xiêm ngọt nước, cùi non.",
  },

  // 9. Đồ Uống Truyền Thống & Sữa
  {
    id: 901,
    categoryId: 9,
    name: "Sữa Ngô (Sữa bắp) non",
    price: "25.000đ",
    description: "Sữa ngô tự làm béo ngậy.",
  },
  {
    id: 902,
    categoryId: 9,
    name: "Sữa Đậu Nành",
    price: "15.000đ",
    description: "Sữa đậu nành nguyên chất thơm ngon.",
  },
  {
    id: 903,
    categoryId: 9,
    name: "Nước Rau Má tươi",
    price: "20.000đ",
    description: "Rau má xay tươi mát lành.",
  },

  // 10. Cà Phê
  {
    id: 1001,
    categoryId: 10,
    name: "Cà phê Muối",
    price: "30.000đ",
    description: "Cà phê kem muối béo mặn độc đáo.",
  },
  {
    id: 1002,
    categoryId: 10,
    name: "Bạc Xỉu đá",
    price: "25.000đ",
    description: "Cà phê sữa nhiều sữa đá xay.",
  },
  {
    id: 1003,
    categoryId: 10,
    name: "Cà phê Đen / Nâu đá",
    price: "20.000đ",
    description: "Cà phê phin truyền thống đậm đà.",
  },

  // 11. Đồ Đóng Chai & Có Cồn
  {
    id: 1101,
    categoryId: 11,
    name: "Coca-Cola / Pepsi / 7Up",
    price: "15.000đ",
    description: "Nước ngọt có gas giải khát.",
  },
  {
    id: 1102,
    categoryId: 11,
    name: "Bia Heineken / Tiger",
    price: "25.000đ - 30.000đ",
    description: "Bia ướp lạnh sảng khoái.",
  },
  {
    id: 1103,
    categoryId: 11,
    name: "Bia hơi",
    price: "10.000đ - 15.000đ",
    description: "Bia hơi Hà Nội mát lạnh.",
  },
  {
    id: 1104,
    categoryId: 11,
    name: "Rượu Táo Mèo / Rượu Mơ",
    price: "80.000đ - 150.000đ",
    description: "Rượu ngâm thủ công êm dịu.",
  },
];

export const MENU_SECTIONS = [
  { title: "Khai vị", data: PRODUCTS.filter((p) => p.categoryId === 1) },
  { title: "Súp các loại", data: PRODUCTS.filter((p) => p.categoryId === 2) },
  { title: "Rau theo mùa", data: PRODUCTS.filter((p) => p.categoryId === 3) },
  { title: "Nộm và Salad", data: PRODUCTS.filter((p) => p.categoryId === 4) },
  { title: "Gà ta", data: PRODUCTS.filter((p) => p.categoryId === 5) },
  { title: "Gà đen", data: PRODUCTS.filter((p) => p.categoryId === 6) },
  {
    title: "Trà Trái Cây & Giải Nhiệt",
    data: PRODUCTS.filter((p) => p.categoryId === 7),
  },
  { title: "Nước Ép Tươi", data: PRODUCTS.filter((p) => p.categoryId === 8) },
  {
    title: "Đồ Uống Truyền Thống & Sữa",
    data: PRODUCTS.filter((p) => p.categoryId === 9),
  },
  { title: "Cà Phê", data: PRODUCTS.filter((p) => p.categoryId === 10) },
  {
    title: "Đồ Đóng Chai & Có Cồn",
    data: PRODUCTS.filter((p) => p.categoryId === 11),
  },
];
