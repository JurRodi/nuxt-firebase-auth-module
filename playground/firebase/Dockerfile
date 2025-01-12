FROM node:20.14-alpine3.20
    WORKDIR /opt/firebase
    RUN npm install -g firebase-tools
    COPY .firebaserc firebase.json ./
    RUN firebase setup:emulators:ui
    CMD ["firebase", "emulators:start", "--only", "auth"]