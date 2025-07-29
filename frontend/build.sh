#!/bin/bash
echo "Building Next.js frontend..."
npm install
echo "NEXT_PUBLIC_API_URL is set to: $NEXT_PUBLIC_API_URL"
npm run build
