# wgen

File generator for React.js app based on TypeScript.

> Note: This will work only for Unix-like shells (bash, zsh etc).

#### Whats with the name "wgen?

wgen is just easy to type and seem to be available name (having "gen" in its name)

### Usage

Install globally with the package manager you are using.

For npm use
`npm i -g @rohilaharsh/wgen`

Then you can use below commands in your React project

- `wgen c <ComponentName>`
  - will create component under `src/components`
- `wgen c <ComponentName> -f <feature-name>`
  - will create component under `src/features/<feature-name>/components`
- `wgen s <service-name> -f <feature-name>`
  - will create service under `src/features/<feature-name>/services`
