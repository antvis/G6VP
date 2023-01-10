# Website for graphinsight

######################## BUILDER: Website ##########################
from docker.io/library/node:16.17.1 AS builder

COPY . /work/G6VP

# change the default shell to bash
SHELL ["/bin/bash", "-c"]

# install pnpm
RUN npm install -g pnpm

RUN cd /work/G6VP/packages/gi-site && \
  pnpm install && \
  npm run build

######################## RUNTIME: Website ##########################
from docker.io/library/node:16.17.1

COPY --from=builder /work/G6VP/packages/gi-site/dist /work/dist

WORKDIR /work/dist
ENTRYPOINT ["python3", "-m", "http.server", "9000"]
