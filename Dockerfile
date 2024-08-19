FROM docker.io/ubuntu:noble
LABEL maintainer Lyas Spiehler

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y autoconf automake libtool pkg-config libssl-dev git build-essential

WORKDIR /usr/src

RUN git clone https://github.com/certnanny/sscep.git

WORKDIR /usr/src/sscep

#RUN git checkout b3f9798

RUN ./bootstrap.sh && ./configure && make && make install

RUN rm -rf /usr/src/sscep

WORKDIR /tmp

CMD ["sscep"]