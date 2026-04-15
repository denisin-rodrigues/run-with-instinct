# Asset Placeholders

## Image Assets Directory

This folder is ready to receive your imagery. Below is the expected structure and guidance:

### Structure

```
images/
├── deer_hero.png           # Main hero image (1920x1080)
├── deer_1.png              # Product/section image 1
├── deer_2.png              # Product/section image 2
├── deer_3.png              # Product/section image 3
├── bg_forest.png           # Forest parallax background
├── bg_meadow.png           # Meadow parallax background
├── bg_dawn.png             # Dawn forest background
└── logo.svg                # Brand logo
```

### Recommended Specifications

**Hero Images**
- Dimensions: 1920x1080px (16:9)
- Format: WebP + JPG fallback
- Quality: 60-80% JPEG
- Max size: 200KB each

**Product/Card Images**
- Dimensions: 800x800px (1:1)
- Format: WebP + JPG fallback
- Quality: 70% JPEG
- Max size: 100KB each

**Parallax Backgrounds**
- Dimensions: 1200x600px minimum
- Format: WebP + JPG fallback
- Quality: 50-60% JPEG
- Max size: 150KB each

### Implementation

Replace placeholder divs in HTML:

```html
<!-- Before -->
<div class="product-image">PLACEHOLDER TEXT</div>

<!-- After -->
<img src="/assets/images/product.jpg" 
     alt="Product Name" 
     class="w-full aspect-square object-cover rounded-lg"
     loading="lazy" />
```

### Photography Guidelines

**Deer Subjects**
- Adult male stag with visible antlers
- Natural outdoor settings (forest, meadow, dawn light)
- Documentary/editorial style (not studio)
- Warm autumn/golden hour lighting preferred
- Atmospheric depth and bokeh

**Forest Imagery**
- Dense woodland, morning mist, natural gradient
- Warm amber, moss, charcoal tones
- Movement implied (wind, water, living spaces)
- Parallax-suitable (distinct foreground/background layers)

**Color Palette**
- Dominant: Forest green (#2d5541), moss (#5a7c5e)
- Accent: Warm amber (#c9915f), bark gray (#6b5d52)
- Avoid: Bright primary colors, high saturation

### Free Stock Photo Resources

- **Unsplash**: unsplash.com (free, high quality)
- **Pexels**: pexels.com (free, diverse)
- **Pixabay**: pixabay.com (free, commercial use)
- **Shutterstock**: shutterstock.com (paid, premium)

Search: "deer", "forest", "meadow", "nature", "hiking"

---

## Frames Directory

This folder is prepared for the 204-frame animation sequence.

### Expected Structure

```
frames/
├── ezgif-frame-001.jpg
├── ezgif-frame-002.jpg
├── ...
├── ezgif-frame-203.jpg
└── ezgif-frame-204.jpg
```

### Canvas Hero Animation

Once frames are added, the hero canvas will animate via GSAP ScrollTrigger.

**Current Setup:**
- 204 frames expected
- Triggered on scroll
- Frame sequence plays forward/backward based on scroll position
- Fallback gradient shown if frames missing

**To Activate Frame Scrubbing (in index.html hero section):**

```javascript
// In the GSAP animations section, uncomment:
gsap.to("#heroCanvas", {
  backgroundImage: (i) => `url('/assets/frames/ezgif-frame-${String((i % 204) + 1).padStart(3, '0')}.jpg')`,
  ease: "none",
  scrollTrigger: {
    trigger: "#heroSection",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    markers: false
  }
});
```

### Frame Generation Tips

**From Video (Recommended)**
```bash
# Extract frames from video at 24fps
ffmpeg -i input.mp4 -vf fps=24 frame-%003d.jpg

# Or use online tool: ezgif.com
```

**Optimization**
- Compress to 800x600px (hero canvas size)
- Use 40-50% JPEG quality
- Consider WebP for 30% additional bandwidth savings

---

## Logo Assets

### Current Setup
- Text logo in navbar: "RUN WITH INSTINCT"
- No image logo loaded (using text)

### To Add Logo

1. **Save as SVG** (preferred, scales infinitely)
   - Place at `/assets/images/logo.svg`
   - Dimensions: 200x100px (or proportional)
   - Single or two-color design

2. **In Navbar**:
   ```html
   <a href="#" class="logo">
     <img src="/assets/images/logo.svg" alt="Run With Instinct" height="24" />
   </a>
   ```

### Logo Design Inspiration
- Minimalist silhouette of deer head/antlers
- Monoline or geometric style
- Color: Forest green or charcoal
- Fits 24px height for navbar

---

## Notes

- All missing imagery shows graceful fallback gradients
- Performance is maintained without real images
- Replace placeholders incrementally
- Use CDN compression (CloudFlare, AWS) for large assets
- Monitor cumulative page weight (target < 2MB total)

**Ready to add real assets! 🎨**
