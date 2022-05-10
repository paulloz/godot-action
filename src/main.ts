import * as core from '@actions/core'
import * as utils from './utils'

import { Godot } from './godot'

async function run(): Promise<void> {
    try {
        if (process.platform !== 'linux') {
            throw Error('This action is only available on Linux runners.')
        }

        const version: string = core.getInput('version')
        if (!utils.validateVersion(version)) {
            throw Error(`${version} is not a valid version.`)
        }

        const godot = new Godot(version, core.getBooleanInput('mono'))
        await godot.install()

        if (await godot.test()) {
            core.info(`Successfully installed Godot!`)
        } else {
            throw Error()
        }

        if (core.getBooleanInput('export-templates')) {
            await godot.installTemplates()
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
