import * as core from '@actions/core'
import * as godot from './godot'
import * as utils from './utils'

async function run(): Promise<void> {
    try {
        if (process.platform !== 'linux') {
            throw Error('This action is only available on Linux runners.')
        }

        const version: string = core.getInput('version')
        if (!utils.validateVersion(version)) {
            throw Error(`${version} is not a valid version.`)
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
