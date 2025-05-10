#!/bin/bash

# Netlify deployment script for NEDA Pay Admin Portal
echo "Starting NEDA Pay Admin Portal deployment process..."

# Ensure we're in the admin-portal directory
cd "$(dirname "$0")"

# Create _redirects file for SPA routing
echo "Creating _redirects file for SPA routing..."
mkdir -p public
echo "/* /index.html 200" > public/_redirects

# Install dependencies with legacy peer deps to handle TypeScript conflicts
echo "Installing dependencies with --legacy-peer-deps..."
npm install --legacy-peer-deps

# Build the application
echo "Building the application..."
CI=false SKIP_PREFLIGHT_CHECK=true npm run build

echo "Deployment preparation complete!"
echo "You can now deploy to Netlify using the admin-portal/build directory."
