# SecureVault v1 - Website Documentation

## 📱 Project Overview

This is the official website for **SecureVault v1**, an AI-powered Android security companion app designed to help users scan, clean, and secure their devices.

The website is built with:
- **HTML5** - Semantic structure
- **CSS3** - Modern responsive design with animations
- **JavaScript (Vanilla)** - Interactive features
- **PHP** - Backend email handling for bug reports

## 🎨 Features

### Website Features:
✅ Fully responsive design (desktop, tablet, mobile)
✅ Smooth animations and transitions
✅ Professional color scheme (neon green, cyan, purple)
✅ Feature showcase with videos and images
✅ Developer profile section
✅ Bug report form with email integration
✅ Advanced reports gallery
✅ Team information

### Key Sections:
1. **Hero Section** - Eye-catching landing with CTA buttons
2. **Development Status** - Clear "Under Development" warning
3. **What is SecureVault** - Quick overview cards
4. **Features** - Detailed feature descriptions with videos
5. **App Gallery** - Screenshots showcase
6. **Why Choose** - Competitive advantages
7. **What Makes Different** - Comparison section
8. **Download** - APK download button with system requirements
9. **Team** - Developer profile (Saathvik Bonakurthi)
10. **Bug Report Form** - Detailed issue reporting
11. **Footer** - Links, legal, contact info

## 🚀 Getting Started

### Prerequisites:
- Web server with PHP support (Apache, Nginx with PHP-FPM, or local PHP server)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- All media files (videos, images) in the same directory

### Installation Steps:

#### Option 1: Using Local PHP Server (Easiest)
```bash
cd /path/to/webapp
php -S localhost:8000
```
Then open: `http://localhost:8000`

#### Option 2: Using Apache/Nginx
1. Place all files in your web root directory
2. Ensure PHP is enabled
3. Access via your server URL

#### Option 3: Hosting Online
1. Upload all files to your hosting provider
2. Ensure PHP mail() function is enabled
3. Test the bug report form

### File Structure:
```
webapp/
├── index.html              # Main website HTML
├── styles.css              # All styling and animations
├── script.js               # JavaScript functionality
├── send_email.php          # Email handler for bug reports
├── sw.js                   # Service worker for offline support
│
├── Media Files:
├── appintro.mp4            # App intro animation
├── ss.mp4                  # Smart Scan feature video
├── ms.mp4                  # Malware Scan feature video
├── jcvid.mp4               # Junk Cleaner feature video
├── lp.mp4                  # Link Protection feature video
├── ai.mp4                  # AI Security Adviser video
│
├── Images:
├── appicon.png             # App icon (high res)
├── appicon.ico             # Favicon
├── s1.jpg to s4.jpg        # App intro screenshots
├── login.jpg               # Login screen
├── signup.jpg              # Signup screen
├── md.jpg                  # Main dashboard
├── reports.jpg             # Reports screenshot
├── useraccount.jpg         # Account settings
├── fp1.jpg & fp2.jpg       # Forgot password screens
├── aiimg.jpg               # AI adviser image
├── jcimg.jpg               # Junk cleaner image
│
└── Documentation:
    └── SecureVault_Terms_and_Privacy_Policy_v1.docx
```

## 📧 Email Configuration

### Bug Report Form Setup:

The bug report form automatically sends reports to: `securevaultappofficial@gmail.com`

To change the recipient email, edit `send_email.php`:
```php
$recipient_email = 'your-email@example.com';
```

### PHP Mail Requirements:
- PHP mail() function must be enabled
- SMTP server configured on your hosting
- Or use a mail service (Gmail SMTP, SendGrid, etc.)

### Gmail SMTP Setup (Optional):
If you want to use Gmail for sending emails, modify `send_email.php` to use PHPMailer or similar library.

## 🎬 Video Integration

All videos are embedded with:
- Autoplay enabled
- Muted (required for autoplay)
- Loop enabled
- Responsive sizing (300px × 600px on desktop, adaptive on mobile)

Videos play automatically on page load. No additional setup needed.

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 1024px (adjusted grid)
- **Mobile**: 768px (single column)
- **Small Mobile**: 480px (optimized for phones)

Test on different devices:
- DevTools (F12 in Chrome/Firefox)
- Mobile devices (iOS/Android)
- Tablets

## ⚡ Performance Optimization

- Videos use H.264 codec for broad compatibility
- Images are optimized
- CSS animations use GPU acceleration
- JavaScript is minified and optimized
- Service Worker enables offline viewing
- Lazy loading for images

## 🔒 Security Features

- Email validation on both client and server side
- Input sanitization to prevent XSS
- CSRF protection ready (add token if needed)
- No sensitive data stored in localStorage except form drafts
- Email is sent securely via PHP mail

## 🎯 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, Firefox Mobile)

## 🔧 Customization

### Change Colors:
Edit `:root` variables in `styles.css`:
```css
:root {
    --primary: #1a1a2e;
    --accent: #00d4ff;
    --success: #00ff88;
    --danger: #ff4444;
    /* ... more variables */
}
```

### Update Developer Info:
Edit the Team section in `index.html`:
```html
<h3>Saathvik Bonakurthi</h3>
<p class="role">Founder & Lead Developer</p>
```

### Change Download Email:
1. Edit `send_email.php` line: `$recipient_email = 'your-email@example.com';`
2. Update HTML footer with new email if visible

### Modify Features:
Edit feature cards in `index.html` in the `#features` section.

## ✅ Testing Checklist

- [ ] All videos play correctly
- [ ] Images display properly
- [ ] Navigation links work
- [ ] Responsive design works on mobile
- [ ] Bug report form submits successfully
- [ ] Email is received at configured address
- [ ] All animations smooth and visible
- [ ] Download button works
- [ ] Team section displays correctly
- [ ] Footer links functional
- [ ] Mobile menu hamburger works

## 🐛 Troubleshooting

### Videos Not Playing:
- Check video file paths are correct
- Ensure video files exist in the same directory
- Check browser supports H.264 codec
- Try a different browser

### Email Not Sending:
- Verify PHP mail() is enabled on server
- Check server error logs
- Ensure SMTP is configured
- Test with a simple PHP mail script first

### Mobile Not Responsive:
- Clear browser cache
- Check viewport meta tag in HTML
- Test in incognito/private mode
- Check CSS is loading properly

### Form Not Submitting:
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Check email format is valid
- Ensure send_email.php path is correct

## 📊 Analytics & Tracking

You can add Google Analytics or other tracking by adding this to `<head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 📄 Legal

- Terms and Conditions: See `SecureVault_Terms_and_Privacy_Policy_v1.docx`
- Privacy Policy: See `SecureVault_Terms_and_Privacy_Policy_v1.docx`
- All content © 2026 Saathvik Bonakurthi

## 🤝 Support

For issues or questions:
- Email: securevaultappofficial@gmail.com
- Website: This website
- Bug Reports: Use the form on the website

## 🎓 Credits

- **Developer**: Saathvik Bonakurthi
- **Age**: 17 years old
- **School**: Swaminarayan Gurukul, Hyderabad
- **Class**: 12 MPC
- **App Version**: v1.0 BETA
- **Status**: Still Under Development & Testing

## 📝 Changelog

### v1.0 BETA
- Initial website launch
- All features documented
- Bug report form integrated
- Fully responsive design
- Professional animations

## 🚀 Future Improvements

- [ ] Add multi-language support
- [ ] Implement newsletter signup
- [ ] Add blog section
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] User testimonials section
- [ ] Video tutorials
- [ ] Community forum

## ⚖️ License

All rights reserved © 2026 SecureVault v1. Developed by Saathvik Bonakurthi.

---

**Last Updated**: May 21, 2026
**Status**: Under Development & Testing
**Version**: Website v1.0
