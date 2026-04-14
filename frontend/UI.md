Analyze my restaurant POS/cashier dashboard UI and improve it professionally.

Current Issues to Fix:

1. Product images are incorrect/mismatched:
- Same/random placeholder food images are being shown for unrelated items.
- Example:
  - Dosa, Idli, Uttapam are showing grilled meat images.
  - Coffee/Tea items have repeated/wrong images.
- This looks unrealistic and reduces UI quality.

Implement proper image handling:
- Since backend schema currently has no imageUrl field, DO NOT modify backend/database schema.
- Instead create frontend image mapping utility.
- Map product names/categories to curated high-quality relevant food images.
- Example:
  - Dosa → dosa image
  - Idli → idli image
  - Uttapam → uttapam image
  - Coffee → coffee image
  - Cold Coffee → cold coffee image
  - Paneer Sandwich → sandwich image
- Use fallback placeholder image if no mapping exists.

2. Improve overall UI/UX professionally:
- Current background is too dark and heavy.
- Change to softer modern background (#f8fafc or similar light neutral).
- Make cards pop better.

3. Improve product cards:
- Reduce card size slightly for better spacing and more products visible.
- Reduce excessive padding/image height.
- Add hover animation:
  - slight scale up
  - shadow lift
  - smooth transition.

4. Improve category headings:
- Increase visibility/contrast of category names.
- Make headings bigger, bolder, and more readable.

5. Improve right-side current order panel:
- Better spacing/padding between sections.
- Improve alignment.
- Add breathing room between Total and Place Order button.

6. Improve payment mode buttons:
- Add icons:
  - Cash → money icon
  - UPI → phone/payment icon
  - Card → credit card icon.
- Improve active/inactive states visually.

7. Reduce unnecessary empty spaces:
- Fix spacing below categories/products.
- Make layout more compact and polished.

8. Improve responsiveness:
- Ensure layout works properly on tablet/mobile.
- Product grid should adapt responsively.

9. Maintain modern SaaS/admin dashboard aesthetic:
- Professional clean design like Stripe/Shopify/Square POS.
- Keep blue accent theme consistent.

Technical Requirements:
- Use clean reusable React/Next.js/Tailwind CSS code.
- Keep code modular and production-ready.
- Do not break existing functionality.
- Preserve backend API/database structure.

Goal:
Make this POS dashboard look premium, polished, and production-level with accurate food images and modern UX.