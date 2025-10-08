# Product Images Guide

## How to Add Product Images

### Method 1: Public Folder (Recommended)

1. **Place your images in the public folder:**
   ```
   public/
   ├── images/
   │   └── products/
   │       ├── nuts/
   │       │   ├── cashew-nuts.jpg
   │       │   ├── cashew-nuts-1.jpg
   │       │   ├── cashew-nuts-2.jpg
   │       │   └── cashew-nuts-3.jpg
   │       ├── dried-fruits/
   │       ├── seeds/
   │       └── mixed/
   ```

2. **Reference images in products.ts:**
   ```typescript
   {
     id: 1,
     name: 'Premium Cashew Nuts',
     image: '/images/products/nuts/cashew-nuts.jpg',
     images: [
       '/images/products/nuts/cashew-nuts-1.jpg',
       '/images/products/nuts/cashew-nuts-2.jpg',
       '/images/products/nuts/cashew-nuts-3.jpg'
     ],
     // ... other product data
   }
   ```

### Method 2: Import as Modules

1. **Create src/assets/images/products/ folder structure**
2. **Import images in your component:**
   ```typescript
   import cashewMain from '../assets/images/products/nuts/cashew-nuts.jpg';
   import cashew1 from '../assets/images/products/nuts/cashew-nuts-1.jpg';

   // Use in product data:
   {
     image: cashewMain,
     images: [cashew1, cashew2, cashew3],
   }
   ```

### Image Naming Convention

- Use descriptive names: `cashew-nuts.jpg`, `almond-kernels.jpg`
- For multiple images: `product-name-1.jpg`, `product-name-2.jpg`
- Use JPG, PNG, or WebP formats
- Optimize images for web (under 500KB each)

### File Structure

```
public/
├── images/
│   └── products/
│       ├── nuts/
│       │   ├── cashew-nuts.jpg
│       │   ├── almonds.jpg
│       │   └── walnuts.jpg
│       ├── dried-fruits/
│       │   ├── apricots.jpg
│       │   └── raisins.jpg
│       ├── seeds/
│       │   ├── pumpkin-seeds.jpg
│       │   └── sunflower-seeds.jpg
│       └── mixed/
│           └── trail-mix.jpg
```