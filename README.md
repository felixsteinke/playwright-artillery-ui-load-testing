# UI Load Testing

This repository gives the opportunity for quick UI load testing. It lets you record a usage scenario in the browser as
a __Playwright Test__ to then execute a __Artillery Load Test__.

## Installation

> Prerequisite: Installed [NodeJS](https://nodejs.org/en/download)

```shell
npm install
```

## Usage

### 1. Generate Playwright Test

Start the __Playwright Code Generator__ with the `URL` of the interested website.

__Default Code Generator__:

```shell
npx playwright codegen https://www.google.com/
```

__Custom Code Generator__ (config from [playwright-codegen.js](src/playwright-codegen.js)):

```shell
npm run codegen
```

Copy the generated code into one or more `.js` files into the [1-generated-code](1-generated-code) directory.

![Playwright Codegen](.docs/playwright-codegen.png)

### 2. Transform generated Code

The generated code must be modified for a reliable load test. Run the following command to transform all generated files
in the [1-generated-code](1-generated-code) directory and save them to [2-transformed-code](2-transformed-code):

```shell
npm run transform
```

### 3. Select Usage Scenario

After generating the transformed scripts (and verifying them), select a script as usage scenario via the command line:

```shell
npm run select
```

Answer the CLI, and it will save the selected scenario to [3-scenario](3-scenario) for the artillery execution.

### 4. Run Artillery Script

Adjust [artillery-script.yml](src/artillery-script.yml) with custom options like
the [artillery-options.yml](src/artillery-options.yml) and run it:

```shell
npm run artillery
```

## References

* [Artillery Playwright Reference](https://www.artillery.io/docs/reference/engines/playwright)
* [Playwright Code Generator](https://playwright.dev/docs/codegen)
