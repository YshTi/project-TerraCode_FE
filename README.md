# 🌿 Природні Мандри — TerraCode

Вебплатформа для пошуку, створення та збереження історій про подорожі Україною, екотуризм і цікаві природні місця.

Проєкт створений командою **TerraCode** як повноцінний full-stack застосунок із адаптивним інтерфейсом, авторизацією, особистим профілем та керуванням історіями.

---

## 🔗 Links

- **Live website:** [Open deployed application](https://project-terra-code-fe.vercel.app/)
- **Front-end repository:** [GitHub repository](https://github.com/YshTi/project-TerraCode_FE)
- **Back-end repository:** [GitHub repository](https://github.com/YshTi/project-TerraCode_BE)
- **API documentation:** [Swagger documentation](https://project-terracode-be.onrender.com/api-docs/)

---

## 📖 About the project

**Природні Мандри** допомагають користувачам відкривати нові місця для подорожей, ділитися власним досвідом та знаходити натхнення для екологічного туризму.

Користувач може:

- переглядати історії інших мандрівників;
- фільтрувати історії за категоріями;
- переглядати популярні публікації;
- створювати, редагувати та видаляти власні історії;
- зберігати цікаві історії в особистому профілі;
- переглядати профілі інших мандрівників;
- змінювати ім’я, аватар, email і пароль;
- використовувати світлу або темну тему;
- працювати із сайтом на мобільних, планшетних і desktop-пристроях.

---

## ✨ Main features

### Public functionality

- Home page with featured stories and travellers
- List of all stories
- Category filtering
- Popular stories
- Story details page
- Travellers list
- Public traveller profiles
- Responsive navigation
- Dark and light themes

### Authenticated functionality

- Registration and login
- Automatic session refresh
- Logout across open browser tabs
- Personal profile
- Saved stories
- User-created stories
- Story creation, editing and deletion
- Avatar upload
- Name and password update
- Email change with verification link

---

## 🛠 Technologies

### Front-end

- HTML5
- CSS3
- CSS Modules
- JavaScript
- TypeScript
- React 19
- Next.js 16
- Next.js App Router
- TanStack React Query
- Axios
- Fetch API
- Formik
- Yup
- Swiper
- React Hot Toast
- Context API
- Responsive design
- Dark and light themes
- Next.js Image optimization

### Back-end

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- JWT authentication
- Access and refresh tokens
- HTTP-only cookies
- Multer
- Cloudinary
- bcrypt
- Joi / Celebrate
- Swagger
- Brevo email service

### Development and deployment

- Git
- GitHub
- VS Code
- Figma
- Postman
- Swagger UI
- MongoDB Compass
- Chrome DevTools
- Lighthouse
- PageSpeed Insights
- ESLint
- Vercel
- Render

---

## 📱 Responsive design

The interface is implemented using a mobile-first approach and supports the following layouts:

- Mobile — from `320px`
- Tablet — from `768px`
- Desktop — from `1440px`

The application includes responsive navigation, cards, forms, sliders, profile pages and image optimization for different screen sizes.

---

## 🔐 Authentication flow

The application uses access and refresh tokens stored in HTTP-only cookies.

The authentication system includes:

1. User login or registration
2. Creation of access and refresh tokens
3. Protected API requests
4. Automatic access-token renewal using the refresh token
5. Session validation
6. Secure logout
7. Cross-tab logout synchronization

When the access token expires, the application requests a new one using the refresh token and repeats the original protected request.

---

## ✉️ Email change flow

Changing the email requires confirmation:

1. The user enters a new email in the profile settings.
2. The back end sends a verification message to the new address.
3. The user follows the verification link.
4. The back end validates the token and updates the email.
5. The existing session is closed.
6. The user logs in using the new email address.

---

## 🖼 Image handling

Images are uploaded and stored using Cloudinary.

Supported avatar formats:

- JPG / JPEG
- PNG
- GIF
- WebP
- HEIC
- HEIF

The maximum avatar size is `1 MB`.

Next.js Image is used for:

- responsive image delivery;
- lazy loading;
- image optimization;
- layout-shift prevention;
- appropriate image sizes for different devices.

---

## ⚡ Performance and accessibility

The project includes:

- responsive image sizes;
- lazy loading;
- dynamic imports;
- reserved loading space for dynamic sections;
- Cumulative Layout Shift optimization;
- accessible labels for buttons and links;
- semantic HTML;
- keyboard-friendly navigation;
- sufficient color contrast;
- Lighthouse and PageSpeed testing.

---

## 🚀 Running the project locally

### Requirements

Before starting, install:

- Node.js 20 or newer
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YshTi/project-TerraCode_FE.git
```


# Collaborators:
- Fullstack
  - [Anna Smyrnova](https://github.com/Anna-Smyrnova)
  - [grytsaidmitry](https://github.com/grytsaidmitry)
  - [Tymofii-Danilov](https://github.com/Tymofii-Danilov)
  - [Valentyna Modyrka](https://github.com/MoVa-ops)
  - [vitalii-sementsov](https://github.com/vitalii-sementsov)
  - [Yurii Davydiuk](https://github.com/YuriiDavydiuk)
  - [Erik](https://github.com/AvalianY)
  - [Lara Kosta](https://github.com/Larimar4you)
  - [Maksym Orlenko](https://github.com/MaksOrlenko)
  - [ROMAN LUBENNIKOV](https://github.com/RomanLubennikov)
- QA:
  - [doroninroma93](https://github.com/doroninroma93)
  - [Yaroslava Rozhkova](https://github.com/slava-rozh)
  - [Anastasiia Tkachyck](https://github.com/weaver-ast)
