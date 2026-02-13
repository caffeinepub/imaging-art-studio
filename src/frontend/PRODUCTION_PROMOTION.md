# Production Promotion Runbook

This document outlines the steps to promote the current draft build (Version 5) to the production Internet Computer environment.

## Prerequisites

- DFX CLI installed and configured
- Access to the Internet Computer network
- Backend canister deployed and running
- All assets present in `frontend/public/assets/generated/`

## Pre-Deployment Checklist

Before promoting to production, verify the following:

1. **Contact Information**: Confirm that `frontend/src/config/contactInfo.ts` contains the correct production contact details:
   - Primary email: `imagingartstudio1994@gmail.com`
   - Phone numbers are accurate
   - Address and business hours are current

2. **Assets**: Verify all required assets are present in `frontend/public/assets/generated/`:
   - `hero-banner.dim_1920x1080.png`
   - `imaging-art-studio-logo.dim_512x512.png`
   - `portfolio-01.dim_1200x800.png` through `portfolio-06.dim_1200x800.png`

3. **Build Test**: Run a local build to ensure no errors:
   ```bash
   cd frontend
   npm run build
   ```

## Deployment Steps

### 1. Deploy to Internet Computer

From the project root directory:

