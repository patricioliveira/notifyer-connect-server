FROM oven/bun
WORKDIR /notifyer-middleware
RUN curl -fsSL https://bun.sh/install | bash
COPY . /notifyer-middleware
RUN bun install
#RUN 
EXPOSE 3000
CMD ["bun", "run", "--watch", "src/index.ts"]
#CMD [ "tail", "-f", "/dev/null" ]
# RUN cd middleware-server && bun install

# ENV NODE_ENV=production
# RUN bun test
# RUN bun run build
# USER bun
# EXPOSE 3000/tcp
# ENTRYPOINT [ "bun", "run", "index.ts" ]