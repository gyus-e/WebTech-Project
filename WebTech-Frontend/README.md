# WebTechFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Prerequisites

Make sure you have installed:
- [node and npm](https://nodejs.org/en/download)
- [Angular CLI](https://angular.dev/tools/cli/setup-local)

Run the following command:

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For running end-to-end (e2e) tests with Playwright, run:

```bash
ng e2e
```

## Running with Docker
```bash
docker build -t webtech-frontend . && \
docker run -p 4200:4200 webtech-frontend
```