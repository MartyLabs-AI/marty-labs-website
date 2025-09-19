# 🔒 MartyLabs.ai - Security & Deployment Guide

## 🛡️ **SECURITY CHECKLIST - CRITICAL**

### ✅ **Environment Variables Protection**
- ✅ All `.env*` files are in `.gitignore` 
- ✅ API keys, secrets, and tokens are NEVER committed to Git
- ✅ Environment variables are set securely in Vercel dashboard
- ✅ Database credentials and webhook secrets are protected

### 🔐 **Files NEVER to Commit**
```bash
# These files contain sensitive data and should NEVER be in Git:
.env
.env.local
.env.development.local
.env.production.local
*.pem
*.key
*.crt
convex/secrets/
clerk-keys/
razorpay-secrets/
```

### 🚀 **Required Environment Variables for Production**

#### **Convex (Database & Backend)**
```bash
CONVEX_DEPLOYMENT=your-convex-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

#### **Clerk (Authentication)**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
```

#### **N8N Workflow Integration**
```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your-n8n-api-key
N8N_WEBHOOK_SECRET=your-webhook-secret
```

#### **Razorpay (Payments)**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your-secret-key
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: GitHub Setup**
1. Create repository at: https://github.com/new
2. Repository name: `martylabs-website`
3. Set to **Public** (required for Vercel free tier)
4. **DO NOT** initialize with README

### **Step 2: Push Code to GitHub**
```bash
# Add your GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/martylabs-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Step 3: Deploy to Vercel**
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. **Framework Preset:** Next.js
5. **Build Command:** `npm run build`
6. **Output Directory:** `.next`
7. Click "Deploy"

### **Step 4: Configure Environment Variables in Vercel**
1. Go to Project Settings → Environment Variables
2. Add ALL required environment variables listed above
3. Set Environment: **Production, Preview, Development**
4. **NEVER** add environment variables through Git

### **Step 5: Custom Domain Setup (martylabs.ai)**
1. Go to Project Settings → Domains
2. Add custom domain: `martylabs.ai`
3. Add custom domain: `www.martylabs.ai`
4. Configure DNS records in your domain provider:

```dns
# Add these DNS records to your domain provider:
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### **Step 6: SSL & Security Headers**
Vercel automatically provides:
- ✅ Free SSL certificates
- ✅ HTTPS redirect
- ✅ Security headers
- ✅ DDoS protection

---

## 🔧 **Vercel Configuration**

### **vercel.json** (Optional - for advanced settings)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📋 **Post-Deployment Checklist**

### **✅ Landing Page Features**
- [ ] Landing page loads at martylabs.ai
- [ ] Producer Agent page loads at martylabs.ai/producer-agent
- [ ] Navigation works between pages
- [ ] All UI components render properly
- [ ] Responsive design works on mobile
- [ ] Waitlist popup functions correctly

### **🔐 Security Verification**
- [ ] No environment variables exposed in client-side code
- [ ] All API endpoints are secure
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] No sensitive data in browser dev tools

### **🚀 Performance**
- [ ] Page load speed < 3 seconds
- [ ] Images are optimized
- [ ] CSS and JS are minified
- [ ] Core Web Vitals are good

---

## 🛠️ **Future Development Security**

### **Adding New Features**
1. **Always** add new environment variables to Vercel dashboard
2. **Never** commit secrets or API keys
3. Use Convex for secure database operations
4. Implement proper authentication with Clerk
5. Validate all user inputs
6. Use HTTPS for all external API calls

### **Database Security (Convex)**
- All database operations go through Convex functions
- Client-side code never directly accesses database
- Row-level security through Convex auth
- Automatic data validation and sanitization

### **Payment Security (Razorpay)**
- All payment processing server-side only
- Webhook signature verification required
- PCI DSS compliance through Razorpay
- No sensitive payment data stored locally

---

## 🆘 **Troubleshooting**

### **Build Failures**
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify environment variables are set

### **Domain Issues**
- DNS propagation can take up to 48 hours
- Use DNS checker tools to verify records
- Contact domain provider for DNS issues

### **Environment Variable Issues**
- Redeploy after adding new environment variables
- Check variable names for typos
- Ensure production/preview/development are all set

---

## 📞 **Support Contacts**

- **Vercel Support:** https://vercel.com/help
- **Convex Support:** https://docs.convex.dev
- **Clerk Support:** https://clerk.com/support
- **Domain DNS:** Your domain provider's support

---

**🔒 Remember: Security is not optional. Always follow these guidelines when deploying and adding new features to martylabs.ai**