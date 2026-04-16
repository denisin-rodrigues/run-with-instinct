# Guia de Deploy – Run With Instinct
**Link ao Vivo:** [https://run-with-instinct.netlify.app](https://run-with-instinct.netlify.app)

## Quick Deployment Checklist

- [ ] Replace placeholder imagery with real deer/forest photography
- [ ] Add 204-frame sequence to `/assets/frames/` folder
- [ ] Update product descriptions and pricing
- [ ] Verify all internal links work
- [ ] Test on mobile devices (iOS Safari, Chrome Android)
- [ ] Check Lighthouse score (target 90+)
- [ ] Enable HTTPS/SSL
- [ ] Add analytics (Google Analytics / Plausible)
- [ ] Verify email signup captures work
- [ ] Deploy to production

---

## Deployment Platforms

### 🚀 Netlify (Recommended – 2 minutes)

1. **Create Netlify account** (free tier available)
2. **Connect GitHub repository** or drag-and-drop `public/` folder
3. **Site builds automatically** (no build step needed)
4. **Custom domain**: Add in Site Settings
5. **HTTPS**: Automatic via Netlify certificate

### 🚀 Vercel (2 minutes)

1. **Create Vercel account** (free tier available)
2. **Import GitHub repo** or upload `public/` folder
3. **Select `public` as root directory**
4. **Deploy** – instantly live
5. **Custom domain**: Add in Project Settings
6. **HTTPS**: Automatic

### 🚀 GitHub Pages (Free)

1. **Create `gh-pages` branch**
2. **Copy `public/` contents to root**
3. **Enable Pages in repository settings**
4. **Site lives at `username.github.io/repo-name`**
5. **HTTPS**: Automatic

### 🚀 Traditional Hosting (cPanel/FTP)

1. **Connect via FTP/SFTP**
2. **Upload contents of `public/` to web root** (usually `public_html/` or `www/`)
3. **Visit your domain** – site is live
4. **Enable HTTPS**: Through hosting provider (Let's Encrypt usually free)

---

## File Size Optimization

### Before Adding Images
- HTML files: ~85KB total
- CSS/JS: CDN-hosted (0 bytes locally)
- **Total**: ~85KB

### After Adding 204-Frame Image Sequence
Estimate based on image dimensions:

- If frames are 1920x1080 JPEG @ 60% quality: ~2-3MB per frame
- 204 frames × 2.5MB = ~510MB **(not practical for web)**

**Solution**: Use WebP or compress to 800x600 @ 40% quality (~300KB per frame)
- 204 frames × 300KB = ~61MB (still large, consider video instead)

**Better Solution**: Compress to MP4 video (~10-15MB total)
```bash
ffmpeg -framerate 24 -i ezgif-frame-%03d.jpg -c:v libx264 -pix_fmt yuv420p hero.mp4
```

Then update hero section to use `<video>` with fallback.

---

## Performance Optimization Checklist

### Critical (Pre-Launch)
- [ ] Compress all images to <100KB each (WebP + JPG)
- [ ] Test on 3G throttling (Lighthouse throttle)
- [ ] Verify LCP < 1.2s
- [ ] Minify inline CSS/JS (optional, improves ~5%)

### Important
- [ ] Add `loading="lazy"` to below-fold images
- [ ] Preload hero fonts
- [ ] Cache busting for CSS/JS if CDN version updates

### Optional (Nice-to-Have)
- [ ] Service worker for offline mode
- [ ] Local storage for cart persistence
- [ ] Prefetch next page on hover

---

## Analytics Setup

### Google Analytics 4

Add to `<head>` of each page:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXXXX` with your GA4 property ID.

### Plausible Analytics (Privacy-Friendly)

Add to `<head>`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## SSL/HTTPS Configuration

### Netlify
✓ Automatic (free)

### Vercel
✓ Automatic (free)

### GitHub Pages
✓ Automatic (free)

### Traditional Hosting
- Use Let's Encrypt (usually free through hosting provider)
- Or purchase SSL certificate
- Redirect HTTP → HTTPS in `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## Testing Before Launch

### Browser Testing
```bash
# Desktop
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

# Mobile
- iOS Safari (iPad, iPhone 12+)
- Chrome Android (Pixel 5+)
- Samsung Internet
```

### Performance Testing
1. **Lighthouse** (Chrome DevTools)
   - Target: 90+ overall
   - LCP: < 1.2s
   - FID: < 100ms
   - CLS: < 0.1

2. **WebPageTest** (webpagetest.org)
   - Test from real global locations
   - Check waterfall for bottlenecks

3. **Mobile Simulation**
   - Chrome DevTools: Throttle to "Slow 4G"
   - Test all interactions work smoothly

### Functionality Testing
- [ ] All product "Add to Cart" buttons work
- [ ] Cart drawer opens/closes smoothly
- [ ] Quantity controls work (+/−)
- [ ] Cart totals calculate correctly
- [ ] Checkout button triggers demo alert
- [ ] Mobile menu opens/closes
- [ ] Search panel opens/closes
- [ ] All links internal and external work
- [ ] Email signup captures focus

---

## Monitoring After Launch

### Essential
- [ ] Set up error tracking (Sentry.io – free tier)
- [ ] Monitor 404 errors
- [ ] Track conversion funnel (cart adds → checkout clicks)

### Recommended
- [ ] Weekly backup (if using traditional host)
- [ ] Monitor page load times (Pingdom, UptimeRobot – free)
- [ ] Review analytics for traffic patterns

---

## Energy & Hosting Recommendations

### Scalability
- **Expected Users**: < 1,000/month → Netlify free tier
- **1,000 – 100,000/month** → Vercel / Netlify Pro
- **100,000+/month** → Cloudflare Pages / AWS CloudFront

### Cost
- **Netlify Free**: $0/month, 300GB/month bandwidth
- **Vercel Free**: $0/month, 1TB/month bandwidth
- **GitHub Pages**: $0, unlimited bandwidth
- **Traditional Hosting**: $5-15/month typical

### Recommendation
Start with **Netlify Free**. Upgrade to Pro ($19/month) only if needed.

---

## Post-Launch Improvements

### Month 1
- [ ] Gather user feedback
- [ ] Monitor analytics
- [ ] Fix any bugs reported
- [ ] Improve mobile UX based on usage data

### Month 2-3
- [ ] Integrate real payments (Stripe)
- [ ] Add email capture integration (Mailchimp/Brevo)
- [ ] Implement search functionality
- [ ] Add more blog/story content

### Ongoing
- [ ] Monthly content updates
- [ ] Seasonal collection refreshes
- [ ] Community engagement (social links)
- [ ] SEO improvements (schema markup, sitemaps)

---

## Troubleshooting

### Site won't load
- [ ] Check file paths are relative (`/page.html` not `C:/page.html`)
- [ ] Verify `.htaccess` or `web.config` is deployed
- [ ] Check browser console for 404s

### Cart not working
- [ ] Verify JavaScript is enabled
- [ ] Check browser console for JS errors
- [ ] Products might have mismatched `data-product` / `data-price`

### Images not loading
- [ ] Check file extension (case-sensitive on Linux servers)
- [ ] Verify image is in correct `/assets/` subfolder
- [ ] Test image path directly in browser

### Mobile menu broken
- [ ] Check viewport meta tag is present
- [ ] Test on actual mobile device (not just DevTools)
- [ ] Verify burger icon JavaScript fires correctly

---

## Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Pages**: https://pages.github.com
- **GSAP Docs**: https://greensock.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **MDN Web Docs**: https://developer.mozilla.org

---

**Ready to deploy! 🚀 Pick a platform and go live in minutes.**
