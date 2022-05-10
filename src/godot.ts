import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as io from '@actions/io'
import * as toolCache from '@actions/tool-cache'

export class Godot {
    public static readonly executable: string = 'godot'
    public static readonly templates: string = `${Godot.executable}-tpz`
    private static readonly repoURL: string = 'https://downloads.tuxfamily.org/godotengine/'

    private version: string
    private mono: boolean

    private path: string

    public get versionID(): string {
        return `${this.version}${this.mono ? '.mono' : ''}`
    }

    private get engineDownloadURL(): string {
        if (this.mono) return `${Godot.repoURL}${this.version}/mono/${this.engineDownloadedFileName.replace(/\.64$/, '_64')}.zip`
        return `${Godot.repoURL}${this.version}/${this.engineDownloadedFileName}.zip`
    }

    private get engineDownloadedFileName(): string {
        return `Godot_v${this.version}-stable${this.mono ? '_mono' : ''}_linux_headless.64`
    }

    private get templatesDownloadURL(): string {
        if (this.mono) return `${Godot.repoURL}${this.version}/mono/Godot_v${this.version}-stable_mono_export_templates.tpz`
        return `${Godot.repoURL}${this.version}/Godot_v${this.version}-stable_export_templates.tpz`
    }

    private get templatesPath(): string {
        return `/home/runner/.local/share/godot/templates/${this.versionID}.stable`
    }

    public constructor(version: string, mono: boolean) {
        this.version = version
        this.mono = mono
        this.path = ''
    }

    private async fetch(): Promise<void> {
        // First, try to pull from the cache
        this.path = toolCache.find(Godot.executable, this.versionID, process.platform)

        if (this.path.length > 0) {
            // If that was successful, there's not much more to do
            core.info(`Godot ${this.versionID} was found in cache. Pulling it now...`)
        } else {
            // Else, download the zip from the repository
            core.info(`Downloading Godot ${this.versionID}...`)
            const downloadedPath: string = await toolCache.downloadTool(this.engineDownloadURL)

            // Extract it
            core.info(`Extracting package...`)
            const extractedPath: string = await toolCache.extractZip(downloadedPath)
            const toolPath: string = !this.mono
                ? extractedPath
                : `${extractedPath}/${this.engineDownloadedFileName.replace(/\.64$/, '_64')}`

            // Easier if the executables for all versions are named the exact same way
            await io.mv(`${toolPath}/${this.engineDownloadedFileName}`, `${toolPath}/${Godot.executable}`)

            // Push our newly downloaded version in the cache
            core.info(`Pushing Godot ${this.versionID} into cache...`)
            this.path = await toolCache.cacheDir(toolPath, Godot.executable, this.versionID, process.platform)

            // And tidy up
            await io.rmRF(downloadedPath)
            await io.rmRF(extractedPath)
        }
    }

    public async install(): Promise<void> {
        await this.fetch()

        if (this.path.length > 0) {
            core.addPath(this.path)
        }
    }

    private async fetchTemplates(): Promise<void> {
        // First, try to pull from the cache
        let path: string = toolCache.find(Godot.templates, this.versionID, process.platform)

        if (path.length > 0) {
            core.info(`Export templates for Godot ${this.versionID} were found in cache. Pulling them now...`)
        } else {
            // If we find nothing, first download the .tpz file from the repository
            core.info(`Downloading export templates for Godot ${this.versionID}...`)
            const downloadedPath: string = await toolCache.downloadTool(this.templatesDownloadURL)

            // Push our newly downloaded .tpz file in the cache
            core.info(`Pushing export templates for Godot ${this.versionID} into cache...`)
            path = await toolCache.cacheFile(downloadedPath, Godot.templates, Godot.templates, this.versionID, process.platform)
        }

        // Extract the content of the .tpz file
        core.info(`Extracting package...`)
        const extractedPath = await toolCache.extractZip(`${path}/${Godot.templates}`)

        // Move everything to the right place
        await io.rmRF(this.templatesPath)
        await io.mv(`${extractedPath}/templates/`, this.templatesPath)

        // And tidy up
        await io.rmRF(extractedPath)
    }

    public async installTemplates(): Promise<void> {
        await this.fetchTemplates()
    }

    public async test(): Promise<boolean> {
        // Need to run with ignoreReturnCode, since Godot always returns weird codes (even on success)
        const output: exec.ExecOutput = await exec.getExecOutput(Godot.executable, ['--version', '--quit'], {
            ignoreReturnCode: true,
        })
        return output.stdout.startsWith(this.version)
    }
}
