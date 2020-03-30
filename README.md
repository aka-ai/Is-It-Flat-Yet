## Development + Deployment
### Frontend Development
- `npm start` from `client/` for local development + hot reloading
- `npm run serve` to test locally
  - builds and uses `firebase serve` to serve locally

### Frontend Deployment
- `npm run deploy:staging` from `client/` 
  - builds and deploys your code to staging (staging.coronavirus.show)
- `npm run deploy:prod` from `client/` 
  - builds and deploys your code to prod

### Backend Development
- `npm start` from `functions/`
- starts the functions emulator, pointed to staging
- call the function name (i.e. `reportService()`) to execute the function

### Backend Deployment
- `npm run deploy:staging` from `functions/`
- `npm run deploy:prod` from `functions/`