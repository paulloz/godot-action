import * as core from '@actions/core'
import * as godot from './godot'
import * as utils from './utils'

async function run(): Promise<void> {
    try {
        const version: string = core.getInput('version')
        if (!utils.validateVersion(version)) {
            // TODO: Write an error message
            throw Error()
        }

        await godot.install(version, core.getBooleanInput('mono'))

        if (await godot.test(version)) {
            core.info(`Successfully installed Godot!`)
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
