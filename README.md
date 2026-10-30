# 📱 QR Studio – QR Code Generator

A modern, responsive, and customizable **QR Code Generator** built using HTML, CSS, and JavaScript. QR Studio allows users to generate QR codes for links, text, Wi-Fi networks, email addresses, and phone numbers with custom colors, sizes, and styling options.

## ✨ Features

- 🔗 **Link / Text QR Codes** – Generate QR codes for URLs and plain text.
- 📶 **Wi-Fi QR Codes** – Generate QR codes containing Wi-Fi network name, password, and security type.
- ✉️ **Email QR Codes** – Create QR codes with recipient, subject, and message.
- 📞 **Phone QR Codes** – Generate QR codes for phone numbers.
- 🎨 **Custom Styling** – Choose from predefined color palettes or select custom foreground and background colors.
- 📏 **Custom QR Size** – Generate QR codes in 256px, 512px, and 1024px sizes.
- ⚙️ **Error Correction** – Choose Low, Medium, Quartile, or High error correction levels.
- 📐 **Margin Control** – Adjust QR code margins.
- 🌙 **Dark / Light Mode** – Switch between themes with saved preferences.
- ⬇️ **Download QR Codes** – Export QR codes in PNG and SVG formats.
- 📋 **Copy QR Code** – Copy the generated QR image or its content.
- 📤 **Share QR Codes** – Share QR codes using supported device sharing features.
- 🕘 **Recent History** – Access recently generated QR codes.
- 💾 **Local Storage** – Save theme preferences and QR history in the browser.
- 📱 **Responsive Design** – Works across desktop, tablet, and mobile screens.

## 🛠️ Technologies Used

- **HTML5** – Structure of the application.
- **CSS3** – Styling, responsive layout, animations, and themes.
- **JavaScript (ES6)** – QR generation logic, event handling, and application functionality.
- **LocalStorage** – Store user preferences and recent QR code history.
- **QR Server API** – Generate QR codes dynamically.
- **Google Fonts (Inter)** – Modern typography.

## 📂 Project Structure

```text
QR-Studio/
│
├── index.html       # Main HTML structure
├── index.css        # Styling and responsive design
├── index.js         # QR generation and application logic
└── README.md        # Project documentation
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 2. Navigate to the Project Folder

```bash
cd YOUR-REPOSITORY
```

### 3. Run the Application

Open `index.html` in your browser.

Alternatively, use the **Live Server** extension in VS Code for a better development experience.

No additional dependencies or installation commands are required.

## 📖 How to Use

1. Open QR Studio in your browser.
2. Select a QR code type:
   - Link / Text
   - Wi-Fi
   - Email
   - Phone
3. Enter the required information.
4. Customize the QR code using color palettes or custom colors.
5. Select the desired size and error correction level.
6. Adjust the margin if needed.
7. Preview your generated QR code.
8. Download it as PNG or SVG, copy it, or share it.
9. Access previously generated QR codes through the Recent History section.

## 🔌 API Integration

QR Studio uses the **QR Server API** to generate QR codes dynamically.

API endpoint:

```text
https://api.qrserver.com/v1/create-qr-code/
```

The application sends the following parameters:

- `data` – Content to encode.
- `size` – QR code dimensions.
- `format` – PNG or SVG.
- `margin` – QR code margin.
- `ecc` – Error correction level.
- `color` – QR code foreground color.
- `bgcolor` – QR code background color.

**Note:** An active internet connection is required for QR code generation and export through the external API.

## 🎨 Design Highlights

- Modern glassmorphism-inspired interface.
- Beautiful gradient accents.
- Smooth animations and transitions.
- Interactive color palette selection.
- Clean and user-friendly layout.
- Automatic dark/light theme preference.

## 🔮 Future Improvements

- Add logo support inside QR codes.
- Add QR code scanning functionality.
- Allow users to upload custom logos.
- Add more QR code types.
- Provide downloadable QR code history.
- Add advanced customization options.

## 👨‍💻 Author

**Daksh Gajjar**

- GitHub: [GAJJAR-DAKSH](https://github.com/GAJJAR-DAKSH)
- LinkedIn: [Add Your LinkedIn Profile](https://www.linkedin.com/)

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

*Built with ❤️ using HTML, CSS, and JavaScript.*
