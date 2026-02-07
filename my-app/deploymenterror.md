14:24:38.008 Running build in Washington, D.C., USA (East) – iad1
14:24:38.009 Build machine configuration: 2 cores, 8 GB
14:24:38.129 Cloning github.com/NisargS28/restaurant-management-app (Branch: main, Commit: 8621a29)
14:24:38.130 Previous build caches not available.
14:24:38.315 Cloning completed: 186.000ms
14:24:38.674 Running "vercel build"
14:24:39.710 Vercel CLI 50.11.0
14:24:40.020 Installing dependencies...
14:24:54.590 
14:24:54.591 added 373 packages in 14s
14:24:54.591 
14:24:54.592 145 packages are looking for funding
14:24:54.592   run `npm fund` for details
14:24:54.630 Detected Next.js version: 16.1.6
14:24:54.634 Running "npm run build"
14:24:54.731 
14:24:54.731 > my-app@0.1.0 build
14:24:54.731 > next build
14:24:54.732 
14:24:55.477 Attention: Next.js now collects completely anonymous telemetry regarding usage.
14:24:55.478 This information is used to shape Next.js' roadmap and prioritize features.
14:24:55.478 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
14:24:55.478 https://nextjs.org/telemetry
14:24:55.478 
14:24:55.493 ▲ Next.js 16.1.6 (Turbopack)
14:24:55.494 
14:24:55.531   Creating an optimized production build ...
14:25:01.167 ✓ Compiled successfully in 5.2s
14:25:01.170   Running TypeScript ...
14:25:05.046 Failed to compile.
14:25:05.047 
14:25:05.047 ./components/OrderCard.tsx:44:35
14:25:05.047 Type error: Argument of type 'Decimal' is not assignable to parameter of type 'string | number'.
14:25:05.047 
14:25:05.047 [0m [90m 42 |[39m               {showPrices [33m&&[39m (
14:25:05.048  [90m 43 |[39m                 [33m<[39m[33mp[39m className[33m=[39m[32m"text-sm text-gray-600"[39m[33m>[39m
14:25:05.048 [31m[1m>[22m[39m[90m 44 |[39m                   {formatCurrency(item[33m.[39mprice)} × {item[33m.[39mquantity}
14:25:05.048  [90m    |[39m                                   [31m[1m^[22m[39m
14:25:05.048  [90m 45 |[39m                 [33m<[39m[33m/[39m[33mp[39m[33m>[39m
14:25:05.048  [90m 46 |[39m               )}
14:25:05.048  [90m 47 |[39m             [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m[0m
14:25:05.075 Next.js build worker exited with code: 1 and signal: null
14:25:05.112 Error: Command "npm run build" exited with 1