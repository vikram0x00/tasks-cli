### Task Tracker CLI - roadmap.sh

Project: https://roadmap.sh/projects/task-tracker

CLI: https://docs.npmjs.com/cli/v12/configuring-npm/package-json#bin

Add `#!/usr/bin/env node` to the top of the CLI file
Add `bin` field in `package.json`

```json
"bin": {
	"cli-name": "/path/to/cli.js"
}
```

Run `npm link` in your terminal

Access using whatever cli-name you have provided

**No AI was used here**
