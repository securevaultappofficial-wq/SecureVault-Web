# SecureVault v1 Website - Quick Setup Guide

## 🚀 Quick Start (60 seconds)

### Windows Users:

1. **Install PHP** (if not already installed):
   - Download from: https://www.php.net/downloads
   - Or install via Windows Subsystem for Linux (WSL)

2. **Open Terminal/Command Prompt** in the webapp folder

3. **Run this command**:
   ```bash
   php -S localhost:8000
   ```

4. **Open Browser**:
   - Go to: http://localhost:8000
   - Website should load immediately

### Mac/Linux Users:

1. **Open Terminal** in the webapp folder

2. **Run this command**:
   ```bash
   php -S localhost:8000
   ```

3. **Open Browser**:
   - Go to: http://localhost:8000
   - Website should load immediately

## ✨ What You Get

✅ Professional, animated website
✅ Full mobile responsiveness
✅ Working bug report form
✅ Video showcases
✅ App gallery
✅ Team profile
✅ Download section

## 📧 Email Configuration

1. Open `send_email.php`
2. Find this line:
   ```php
   $recipient_email = 'securevaultappofficial@gmail.com';
   ```
3. Change it to your email address
4. Save the file

**Note**: For production, you may need to configure SMTP on your server.

## 🔗 Testing the Form

1. Navigate to the "Report a Bug" section
2. Fill in the form with test data
3. Click "Submit Bug Report"
4. Check your email (check spam folder too)

## 🎨 Customization Tips

### Change Colors:
- Edit `styles.css`, look for `:root { }` section
- Modify CSS variables like `--accent`, `--primary`, etc.

### Update Developer Info:
- Edit the Team section in `index.html`
- Update name, age, school, achievements

### Change Download Link:
- Search for `securevault-v1-beta.apk` in `index.html`
- Replace with your actual APK file path or URL

### Modify Email Recipient:
- Edit `send_email.php` (line with `$recipient_email`)
- Change to your email address

## 📱 Testing on Mobile

### Method 1: Using Browser DevTools
1. Press F12 in Chrome/Firefox
2. Click device icon (top-left of DevTools)
3. Select different device sizes

### Method 2: Real Device
1. Find your computer's IP address:
   - Windows: `ipconfig` in CMD
   - Mac/Linux: `ifconfig` in Terminal
   - Look for IPv4 address (e.g., 192.168.1.100)

2. On your phone, open browser:
   - Go to: http://192.168.1.100:8000
   - Website should load

## 🌐 Going Live (Hosting)

1. **Choose a Host**: Bluehost, SiteGround, Hostinger, etc.
2. **Upload Files**: Use FTP or file manager
3. **Enable PHP**: Usually enabled by default
4. **Test Form**: Submit test bug report
5. **Check Email**: Verify emails are received

## ⚠️ Important Notes

- **APK File**: Create a placeholder or add your actual APK file
- **Email Sending**: Requires PHP mail() to be enabled on server
- **Videos**: Make sure all .mp4 files are in the same directory
- **Images**: All .jpg and .png files must be present
- **Browser Cache**: Clear cache if changes don't appear

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "PHP not found" | Install PHP or use an IDE like VS Code with Live Server |
| Website won't load | Check port 8000 is not in use: `php -S localhost:8001` |
| Videos not playing | Verify all .mp4 files exist in same folder |
| Form won't submit | Check browser console (F12) for errors |
| Email not received | Check spam folder, verify send_email.php path |
| Mobile looks broken | Clear browser cache, check viewport meta tag |

## 📞 Support

For issues:
1. Check README.md for detailed documentation
2. Look at browser console (F12) for errors
3. Verify all files are in the correct location
4. Test on a different browser

## 🎯 Next Steps

1. ✅ Website is set up and running
2. 🎨 Customize it with your branding
3. 📧 Configure email properly
4. 🚀 Upload to hosting
5. 📱 Test on actual devices
6. 🎉 Launch and celebrate!

---

**Version**: v1.0
**Status**: Ready to Use
**Last Updated**: May 21, 2026
