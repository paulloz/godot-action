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
```

## Options

### version **required**

Which version of the engine you want to install.

### mono

If you want the standard or Mono version of the engine.

Default value: `false`
