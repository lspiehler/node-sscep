FROM docker.io/ubuntu:noble
LABEL maintainer Lyas Spiehler

ENV DEBIAN_FRONTEND=noninteractive

# ubuntu:noble has no curl, so install it first; -f makes a failed download fail the build instead of falling back to Ubuntu's Node 18
RUN apt update && apt install -y curl ca-certificates

RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash -

# NodeSource's nodejs package includes npm
RUN apt install -y autoconf automake libtool pkg-config libssl-dev git build-essential nodejs

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

WORKDIR /var/node/node-sscep

# build from the checked-out code, so the image matches the commit it's tagged with
COPY . .

RUN npm install

CMD ["npm", "start"]