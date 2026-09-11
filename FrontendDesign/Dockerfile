FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_BOOKING_API_URL=/booking-api/api
ARG VITE_PROVIDER_API_URL=/provider-api/api
ARG VITE_NOTIFICATION_API_URL=/notification-api/api
ENV VITE_BOOKING_API_URL=$VITE_BOOKING_API_URL
ENV VITE_PROVIDER_API_URL=$VITE_PROVIDER_API_URL
ENV VITE_NOTIFICATION_API_URL=$VITE_NOTIFICATION_API_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
