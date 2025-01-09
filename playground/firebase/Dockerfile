FROM alpine:3.21.2
    WORKDIR /opt/firebase
    RUN apk --no-cache add curl bash libc6-compat libstdc++ libgcc
    RUN curl -sL https://firebase.tools | bash
    COPY .firebaserc firebase.json ./
    RUN firebase setup:emulators:ui
    CMD ["firebase", "emulators:start", "--only", "auth"]