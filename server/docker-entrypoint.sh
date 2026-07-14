#!/bin/sh
set -e

npx prisma migrate deploy
node dist/prisma/seed.js
exec node dist/src/index.js
