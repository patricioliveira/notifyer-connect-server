FROM oven/bun:canary-debian
WORKDIR /notifyer-middleware
COPY . /notifyer-middleware
COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node

# Install packages
RUN bun install --production --silent

# Run generation
RUN bunx prisma generate
# RUN bunx prisma migrate deploy

EXPOSE 3000
CMD ["bun", "run", "--watch", "src/index.ts"]
# CMD [ "tail", "-f", "/dev/null" ]