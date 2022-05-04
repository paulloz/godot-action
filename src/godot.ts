import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as toolCache from '@actions/tool-cache'
import * as utils from './utils'

export const executable: string = 'godot'

export async function install(version: string, mono: boolean): Promise<void> {
    const versionID: string = `${version}${mono ? '-mono' : ''}`

    // First, try to pull from the cache
    let godotPath = toolCache.find(executable, versionID, process.platform)

    if (godotPath) {
        // If that was successful, there's not much more to do
        core.info(`Godot ${versionID} was found in cache. Pulling it now...`)
    } else {
        // Else, download the zip from the repository
        core.info(`Downloading Godot ${versionID}...`)
        const downloadedPath: string = await toolCache.downloadTool(utils.godotDownloadURL(version, mono))

        // Extract it
        core.info(`Extracting package...`)
        const extractedPath: string = await toolCache.extractZip(downloadedPath)
        const containingPath: string = utils.godotContainingPath(extractedPath, version, mono)

        // Easier if the executables for all versions are named the exact same way
        await io.mv(`${containingPath}/${utils.godotBinName(version, mono)}`, `${containingPath}/${executable}`)

        // Push our newly downloaded version in the cache
        core.info(`Pushing Godot ${versionID} into cache...`)
        godotPath = await toolCache.cacheDir(containingPath, executable, versionID, process.platform)

        // And tidy up
        await io.rmRF(downloadedPath)
        await io.rmRF(extractedPath)
    }

    // Finally, update the PATH
    core.addPath(godotPath)
}

export async function test(version: string): Promise<boolean> {
    // Need to run with ignoreReturnCode, since Godot always returns weird codes (even on success)
    const output: exec.ExecOutput = await exec.getExecOutput(executable, ['--version', '--quit'], { ignoreReturnCode: true })
    return output.stdout.startsWith(version)
}
