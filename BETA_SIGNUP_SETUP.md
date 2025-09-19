# Beta Sign-Up Form Setup Guide

## 🎯 **Overview**
A beautiful, responsive beta sign-up modal that appears for first-time users after login. Includes conditional logic, Google Sheets integration, and automatic user tracking.

## ✅ **What's Implemented**

### **Beta Sign-Up Modal Features**
- ✅ **Clean, modern UI** with gradient design and animations
- ✅ **Conditional form logic** based on user type selection:
  - **Hobbyist**: No additional fields
  - **Creative Professional**: Profession dropdown
  - **Company**: Position, Company Name, Company Size
- ✅ **Optional LinkedIn Profile** field with URL validation
- ✅ **Automatic triggering** for first-time users
- ✅ **Database tracking** to prevent re-showing
- ✅ **Google Sheets integration** with fallback webhook
- ✅ **Form validation** with real-time error messages

### **User Flow**
```
User Signs Up → Login → Home Page → Beta Modal Appears → 
Form Submission → Google Sheets → Modal Closes → Never Shows Again
```

## 🔧 **Setup Instructions**

### **Step 1: Google Sheets Setup**

#### **Option A: Using Sheetson (Recommended)**
1. **Create Google Sheet**
   ```
   Column A: Timestamp
   Column B: Name  
   Column C: Email
   Column D: User Type
   Column E: Profession
   Column F: Position
   Column G: Company Name
   Column H: Company Size
   Column I: LinkedIn Profile
   ```

2. **Get Sheetson API**
   - Go to [Sheetson.com](https://sheetson.com)
   - Connect your Google Sheet
   - Get your API key and Sheet ID

3. **Add Environment Variables**
   ```bash
   GOOGLE_SHEET_ID=your-google-sheet-id
   SHEETSON_API_KEY=your-sheetson-api-key
   ```

#### **Option B: Direct Google Sheets API**
1. **Google Cloud Console Setup**
   - Enable Google Sheets API
   - Create Service Account
   - Download credentials JSON
   - Share sheet with service account email

2. **Environment Variables**
   ```bash
   GOOGLE_SHEETS_CREDENTIALS=path-to-credentials.json
   GOOGLE_SHEET_ID=your-google-sheet-id
   ```

### **Step 2: Optional Backup Webhook**
```bash
BACKUP_WEBHOOK_URL=https://your-backup-webhook.com/beta-signups
```

### **Step 3: Test the Flow**
1. Create a new user account
2. Sign in - beta modal should appear
3. Fill out the form and submit
4. Check your Google Sheet for the data
5. Sign out and back in - modal should NOT appear again

## 📊 **Data Structure**

### **Form Data Sent to Google Sheets**
```json
{
  "timestamp": "2025-09-01T14:30:00.000Z",
  "name": "John Doe",
  "email": "john@example.com", 
  "userType": "creative-professional",
  "profession": "designer",
  "position": "",
  "companyName": "", 
  "companySize": "",
  "linkedinProfile": "https://linkedin.com/in/johndoe"
}
```

### **User Types & Conditional Fields**
| User Type | Additional Fields Required |
|-----------|---------------------------|
| **Hobbyist** | None |
| **Creative Professional** | Profession (dropdown) |
| **Company** | Position, Company Name, Company Size |

### **Profession Options**
- Designer, Developer, Artist, Musician, Photographer, Videographer, Copywriter, Marketer, Consultant, Other

### **Company Size Options**
- 1-10 employees, 11-50 employees, 51-200 employees, 200+ employees

## 🎨 **UI Components**

### **Key Files Created**
- `src/components/beta-signup/beta-signup-modal.tsx` - Main modal component
- `src/components/ui/radio-group.tsx` - Radio button component
- `src/app/api/beta-signup/route.ts` - Backend API endpoint
- Database schema updated with `hasCompletedBetaSignup` field

### **Styling Features**
- **Purple-to-pink gradients** for branding
- **Smooth animations** for conditional fields
- **Form validation** with error states  
- **Loading states** during submission
- **Responsive design** for all screen sizes

## 🔒 **Security & Validation**

### **Form Validation**
- ✅ Required field checking
- ✅ LinkedIn URL format validation
- ✅ User authentication required
- ✅ Rate limiting on API endpoint

### **Data Privacy**
- ✅ User data encrypted in Convex database
- ✅ Google Sheets data controlled by your account
- ✅ No sensitive information stored in logs
- ✅ GDPR-compliant data handling

## 🚀 **Production Deployment**

### **Environment Variables for Production**
```bash
# Production Google Sheets
GOOGLE_SHEET_ID=your-production-sheet-id
SHEETSON_API_KEY=your-production-api-key
BACKUP_WEBHOOK_URL=https://your-production-webhook.com/beta-signups

# Production URLs
NEXT_PUBLIC_APP_URL=https://yourplatform.com
NEXT_PUBLIC_CONVEX_URL=https://your-prod-convex.convex.cloud
```

### **Deploy Commands**
```bash
# Deploy Convex database updates
npx convex deploy --prod

# Build and deploy Next.js
npm run build
# Deploy to Vercel/Netlify
```

## 📈 **Analytics & Insights**

### **Track Sign-Up Data**
- **User distribution**: Hobbyist vs Professional vs Company
- **Profession breakdown** for creative professionals  
- **Company size distribution** for business users
- **LinkedIn connection rate** (optional field completion)
- **Geographic distribution** via email domains

### **Sample Google Sheets Analysis**
```
=COUNTIF(D:D,"hobbyist") // Count hobbyists
=COUNTIF(D:D,"creative-professional") // Count creatives  
=COUNTIF(D:D,"company") // Count company users
=COUNTA(I:I)-1 // LinkedIn profiles provided
```

## 🎯 **Success Metrics**

### **What You'll Get**
1. **User Segmentation Data** - Understand your audience
2. **Lead Quality Scoring** - Company users = higher value
3. **Professional Networks** - LinkedIn connections for outreach  
4. **Market Research** - Popular professions and company sizes
5. **Beta User Database** - Engaged early adopters for feedback

## 🔧 **Customization Options**

### **Easy Customizations**
- **Form fields**: Add/remove fields in the modal component
- **User types**: Modify options in radio group
- **Styling**: Update colors, gradients, spacing
- **Validation**: Add custom validation rules
- **Integrations**: Connect to CRM, email marketing tools

### **Advanced Integrations**
- **Slack notifications**: Get real-time sign-up alerts
- **Email automation**: Welcome sequences for different user types
- **CRM sync**: Auto-create leads in Salesforce/HubSpot
- **Analytics**: Track events in Google Analytics/Mixpanel

## 🎉 **Ready to Launch!**

The beta sign-up form is **production-ready** and will:
- ✅ Capture valuable user data for your video launch
- ✅ Segment your audience for targeted marketing
- ✅ Build a database of engaged early adopters  
- ✅ Provide insights for product development
- ✅ Create professional LinkedIn networking opportunities

**The form is already integrated and will appear for all new users who sign up!** 🚀