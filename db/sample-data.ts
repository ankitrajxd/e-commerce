import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      name: "Jane",
      email: "user@example.com",
      password: hashSync("123456", 10),
      role: "user",
    },
  ],

  products: [
    {
      name: "Polo Sporting Stretch Shirt",
      slug: "polo-sporting-stretch-shirt",
      category: "Men's Dress Shirts",
      description: "Classic Polo style with modern comfort",
      images: [
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCifkPc53I60zChE7e9XJAm2YqTxcUkf8Oi5vZ",
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCVyZSbbcPhCr4JDlL20wT9KxdQ5GvBa1R6WuX",
      ],
      price: 59.99,
      brand: "Polo",
      rating: 4.5,
      numReviews: 10,
      stock: 500,
      isFeatured: true,
      banner: false,
    },
    {
      name: "Brooks Brothers Long Sleeved Shirt",
      slug: "brooks-brothers-long-sleeved-shirt",
      category: "Men's Dress Shirts",
      description: "Timeless style and premium comfort",
      images: [
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCDZy8XTilvYeWyQ6wiK5zgNHhZXo2IEBRc8um",
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCCYjMIq9TXaCTJ9ueQ5KpwBWjs6OVlrUivcGx",
      ],
      price: 85.99,
      brand: "Brooks Brothers",
      rating: 4.2,
      numReviews: 8,
      stock: 500,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Tommy Hilfiger Classic Fit Dress Shirt",
      slug: "tommy-hilfiger-classic-fit-dress-shirt",
      category: "Men's Dress Shirts",
      description: "A perfect blend of sophistication and comfort",
      images: [
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCirrE8gS3I60zChE7e9XJAm2YqTxcUkf8Oi5v",
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCk2c7hfOVV6S1LrHDopElO5BJXKNuPCcf8ha7",
      ],
      price: 99.95,
      brand: "Tommy Hilfiger",
      rating: 4.9,
      numReviews: 3,
      stock: 500,
      isFeatured: false,
      banner: null,
    },
    {
      name: "Calvin Klein Slim Fit Stretch Shirt",
      slug: "calvin-klein-slim-fit-stretch-shirt",
      category: "Men's Dress Shirts",
      description: "Streamlined design with flexible stretch fabric",
      images: [
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCiwJBHT3I60zChE7e9XJAm2YqTxcUkf8Oi5vZ",
        "https://4m6no0dadg.ufs.sh/f/iLgTho3I60zCR9zTHn8QVHUcnwXbLJ7tZx4vmIDydCqseB9j",
      ],
      price: 99.95,
      brand: "Calvin Klein",
      rating: 3.6,
      numReviews: 5,
      stock: 500,
      isFeatured: false,
      banner: null,
    },
  ],
};

export default sampleData;
