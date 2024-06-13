import BasicApplication from "./view/BasicApplication"

Hooks.once('ready', () => new BasicApplication().render(true, { focus: true }) && console.log('TemplateESM | Ready'));