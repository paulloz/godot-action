# Godot action

A simple GitHub action to install and run Godot engine.  

This action is only available on Linux runners.

## Usage

```yml
steps:
  - uses: actions/checkout@v3
  - uses: paulloz/godot-action@v1
    with:
      version: 3.4.4
  - run: |
      godot --version
      godot --export <platform> <path-to-export-to>
```

## Options

### version (required)

Which version of the engine you want to install.

### mono (default: `false`)

If you want the standard or Mono version of the engine.

### export-templates (default: `true`) 

If you want the export templates installed or not.

Default value: `false`
