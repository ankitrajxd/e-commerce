# Full Stack E-Commerce

Full-stack e-commerce application designed to provide a seamless shopping experience. It features user authentication, product listings, and a shopping cart, all built with a robust and scalable tech stack.

## Features

- User Authentication (Sign Up, Sign In, Sign Out)
- Product Listings with detailed views
- Shopping Cart functionality (With guest Cart)
- Responsive design
- Payment Gateway (razorpay)
- Admin Panel (CRUD operations for products and Users)
- Dynamic Search, Sort, and Filter product/users/orders
- Pagination for products/users/orders

## Screenshots - I Can't keeep this website up for long : )

<div align="center">

<details open>
<summary><b>User Journey</b></summary>

| ![Sign In Page](./public/images/website-ss/signinpage.png) |
| :--------------------------------------------------------: |
|  _Secure User Authentication with Email & Google Sign-In_  |

| ![Home Page](./public/images/website-ss/homepage.png) |
| :---------------------------------------------------: |
| _Product Showcase with Categories and Featured Items_ |

| ![Product Details](./public/images/website-ss/productDetailpage.png) |
| :------------------------------------------------------------------: |
|    _Detailed Product Information with Images and Specifications_     |

|    ![Shopping Cart](./public/images/website-ss/cartPage.png)    |
| :-------------------------------------------------------------: |
| _User-Friendly Cart with Quantity Controls and Price Breakdown_ |

| ![Address Page](./public/images/website-ss/address-page.png) |
| :----------------------------------------------------------: |
|           _Simple Address Collection for Shipping_           |

| ![Payment Method](./public/images/website-ss/payment-method.png) |
| :--------------------------------------------------------------: |
|       _Multiple Payment Options for Customer Convenience_        |

| ![Place Order](./public/images/website-ss/place-order.png) |
| :--------------------------------------------------------: |
|         _Order Summary Before Final Confirmation_          |

| ![Razorpay Integration](./public/images/website-ss/razorpay.png) |
| :--------------------------------------------------------------: |
|            _Secure Payment Processing with Razorpay_             |

| ![Order Success](./public/images/website-ss/order-success.png) |
| :------------------------------------------------------------: |
|           _Order Confirmation with Success Message_            |

| ![Order Details](./public/images/website-ss/order-placed-details.png) |
| :-------------------------------------------------------------------: |
|               _Complete Order Information and Tracking_               |

</details>

<details>
<summary><b>Admin Dashboard</b></summary>

| ![Admin Dashboard](./public/images/website-ss/admin-dashboard.png) |
| :----------------------------------------------------------------: |
|        _Comprehensive Admin Dashboard with Sales Analytics_        |

| ![Product Management](./public/images/website-ss/product-management.png) |
| :----------------------------------------------------------------------: |
|            _Complete Product Management with CRUD Operations_            |

| ![User Management](./public/images/website-ss/admin-users.png) |
| :------------------------------------------------------------: |
|        _User Management with Role-Based Access Control_        |

</details>

<details>
<summary><b>Search Functionality</b></summary>

| ![Search Feature](./public/images/website-ss/search.png) |
| :------------------------------------------------------: |
|    _Dynamic Search with Filters and Sorting Options_     |

</details>

</div>

## Tech Stack

### Frontend

- **Next.js**: A React framework for server-side rendering and generating static websites.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **ShadCn UI**: A set of accessible, unstyled UI components for building high-quality design systems and web apps.
- **Lucide Icons**: A collection of simple and consistent icons.

### Backend

- **Auth.js**: Authentication for Next.js applications.
- **Prisma**: An ORM for Node.js and TypeScript.
- **Neon**: A serverless PostgreSQL database.
- **uploadthingy**: A file uploader for Node.js.

### Other Tools

- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **PostCSS**: A tool for transforming CSS with JavaScript plugins.
- **Zod**: A TypeScript-first schema declaration and validation library.

# Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL database (Vercel neon)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ankitrajxd/e-commerce.git
   ```

2. Install dependencies:

   ```bash
   npm install or npm install --legacy-peer-deps
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   NEXT_PUBLIC_APP_NAME = 'Ecommerce'
   NEXT_PUBLIC_APP_DESCRIPTION = 'Modern Ecommerce store'
   NEXT_PUBLIC_SERVER_URL= 'http://localhost:3000'
   DATABASE_URL='db url'

   # auth
   AUTH_SECRET="random generated string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_URL_INTERNAL="http://localhost:3000"

   PAYMENT_METHODS="Online,CashOnDelivery"
   DEFAULT_PAYMENT_METHOD="Online"


   #  razorpay
   RZR_KEY_ID=''
   NEXT_PUBLIC_KEY_ID=''
   RZR_KEY_SECRET=''


   # google oauth - https://console.cloud.google.com/ - for authjs
   AUTH_GOOGLE_ID=''
   AUTH_GOOGLE_SECRET=''



   # uploadthing -  for uploading files
   UPLOADTHING_TOKEN=''
   UPLOADTHING_SECRET=''
   UPLOADTHING_APP_ID='' # get for the url
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the db (Make sure the code is uncommented. It is commented to avoid seeding the db every time the server starts):

   ```bash
   npx tsx ./db/seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
