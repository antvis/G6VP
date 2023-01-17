# Website for graphinsight

######################## BUILDER: Website ##########################
# from docker.io/library/node:16.17.1 AS builder
from python:3.9-alpine AS builder

COPY ./dist /work/dist

# # change the default shell to bash
# SHELL ["/bin/bash", "-c"]

# # install pnpm
# # RUN npm install -g pnpm

# # RUN cd /work/G6VP/packages/gi-site && \
# #   pnpm install && \
# #   npm run build

# ######################## RUNTIME: Website ##########################
# from docker.io/library/node:16.17.1

# COPY --from=builder /work/G6VP/packages/gi-site/dist /work/dist

# WORKDIR /work/dist
# ENTRYPOINT ["python3", "-m", "http.server", "9000"]
