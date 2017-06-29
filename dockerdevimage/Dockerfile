FROM ubuntu:16.04

RUN apt-get update -y && \
    apt-get install -y git vim curl libcurl4-openssl-dev g++ cmake libboost-all-dev libargtable2-dev && \

    curl -sL https://deb.nodesource.com/setup_7.x | bash - && \

    # Install Node.js Dependencies
    apt-get update -y && \
    apt-get install -y nodejs && \
    npm install typescript -g && \
    npm install tslint -g && \

    # libmicrohttpd
    curl -O http://ftp.gnu.org/gnu/libmicrohttpd/libmicrohttpd-0.9.52.tar.gz && \
    tar -xvf libmicrohttpd-0.9.52.tar.gz && \
    cd libmicrohttpd-0.9.52 && \
    ./configure && make && \
    make install && ldconfig && \
    cd .. && rm -rf libmicrohttpd-0.9.52 && \

    # jsoncpp
    git clone git://github.com/open-source-parsers/jsoncpp.git && \
    mkdir -p jsoncpp/build && \
    cd jsoncpp/build && \
    cmake -DCMAKE_BUILD_TYPE=debug -DCMAKE_CXX_FLAGS=-fPIC -DBUILD_STATIC_LIBS=ON -DBUILD_SHARED_LIBS=OFF -DARCHIVE_INSTALL_DIR=. -G "Unix Makefiles" .. && \
    make && \
    make install && ldconfig && \
    cd ../../ && rm -rf jsoncpp && \

    # libjson-rpc-cpp
    git clone git://github.com/tinganho/libjson-rpc-cpp.git && \
    mkdir -p libjson-rpc-cpp/build && \
    cd libjson-rpc-cpp/build && \
    cmake -DCMAKE_BUILD_TYPE=Debug -DHTTP_CLIENT=YES -DHTTP_SERVER=YES -DCOMPILE_STUBGEN=YES .. && \
    make && \
    make install && ldconfig && \
    cd ../../ && rm -rf libjson-rpc-cpp

CMD exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"
