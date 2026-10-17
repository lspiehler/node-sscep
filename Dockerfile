FROM docker.io/ubuntu:noble
LABEL maintainer Lyas Spiehler

ENV DEBIAN_FRONTEND=noninteractive

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt update && apt install -y autoconf automake libtool pkg-config libssl-dev git build-essential nodejs npm

WORKDIR /usr/src

RUN git clone https://github.com/certnanny/sscep.git

WORKDIR /usr/src/sscep

# pinned so the patch below applies; the patch makes sscep read the response with CMS instead of PKCS#7,
# so it can decrypt responses for EC keys (key agreement) as well as RSA (certnanny/sscep#183)
RUN git checkout cb3e539

COPY sscep-cms.patch /tmp/sscep-cms.patch

RUN git apply /tmp/sscep-cms.patch

RUN ./bootstrap.sh && ./configure && make && make install

RUN rm -rf /usr/src/sscep

RUN mkdir -p /var/node

WORKDIR /var/node

ARG CACHE_DATE=2024-08-31

RUN git clone https://github.com/lspiehler/node-sscep.git

WORKDIR /var/node/node-sscep

RUN npm install

CMD ["npm", "start"]