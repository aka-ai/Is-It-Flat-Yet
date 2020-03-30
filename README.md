## Development + Deployment
### Frontend Development
- `npm start` from `client/` for local development + hot reloading

### Frontend Deployment
- `npm run deploy:staging` from `client/` 
  - builds and deploys your code to staging (staging.coronavirus.show)
- `npm run deploy:prod` from `client/` 
  - builds and deploys your code to prod

### Backend Development
- `firebase functions:shell` from anywhere in project
  - starts the functions emulator
  - call the function name (i.e. `reportService()`) to execute the function

### Backend Deployment
- `npm run deploy:staging` from `functions/`
- `npm run deploy:prod` from `functions/`