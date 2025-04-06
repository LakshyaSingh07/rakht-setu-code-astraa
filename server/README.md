# Life Bridge Server

## Email Configuration Guide

### Setting up Gmail for Application Use

To enable email functionality in the Life Bridge application, you need to configure Gmail credentials properly. Follow these steps:

1. **Create or use an existing Gmail account**
   - It's recommended to create a dedicated Gmail account for your application

2. **Enable 2-Step Verification**
   - Go to your Google Account settings: https://myaccount.google.com/security
   - Enable 2-Step Verification (this is required for App Passwords)

3. **Generate an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app and your device type
   - Click "Generate"
   - Google will display a 16-character password - copy this password

4. **Update your .env file**
   - Open the `.env` file in the server directory
   - Replace `your_email@gmail.com` with your actual Gmail address
   - Replace `your_app_password` with the 16-character App Password you generated

### Troubleshooting Email Issues

If you encounter email sending errors:

1. **Check your .env file**
   - Ensure EMAIL_USER and EMAIL_PASS are correctly set
   - Make sure there are no extra spaces or quotes

2. **Verify App Password**
   - App Passwords are 16 characters without spaces
   - They can only be used if 2-Step Verification is enabled

3. **Check server logs**
   - Look for specific authentication errors in the console
   - The application will log detailed error messages to help diagnose issues

4. **Gmail Security Settings**
   - Ensure your Gmail account doesn't have additional security restrictions
   - Check if you need to allow access to less secure apps (though App Passwords are preferred)

5. **Network Issues**
   - Ensure your server has internet connectivity
   - Some networks might block outgoing SMTP connections