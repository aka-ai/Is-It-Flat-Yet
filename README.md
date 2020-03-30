## Development
### Frontend
- Firebase hosting app is all in `/client/`
- `npm start` for local development + hot reloading
- `npm run deploy:staging` will build and deploy your code to (staging.coronavirus.show)
- `npm run deploy:prod` will _not_ rebuild and deploy whatever is built to prod (coronavirus.show) 
  - why? expectation is that you just built and deployed to staging, so we want to use the same build in prod

### Backend (reportService)
- reportService function is in `/functions/`
- TODO setup local development
- `npm run deploy:staging`
- `npm run deploy:prod`