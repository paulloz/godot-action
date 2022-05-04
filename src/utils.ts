export function godotDownloadURL(version: string, mono: boolean): string {
    return `https://downloads.tuxfamily.org/godotengine/${version}/${mono ? 'mono/' : ''}${godotZipName(version, mono)}.zip`
}

export function godotZipName(version: string, mono: boolean): string {
    if (mono) {
        const binName = godotBinName(version, mono)
        const index = binName.lastIndexOf('.')
        return `${binName.substring(0, index)}_${binName.substring(index + 1)}`
    }
    return godotBinName(version, mono)
}

export function godotBinName(version: string, mono: boolean): string {
    return `Godot_v${version}-stable${mono ? '_mono' : ''}_linux_headless.64`
}

export function godotContainingPath(basePath: string, version: string, mono: boolean): string {
    if (mono) {
        return `${basePath}/${godotZipName(version, mono).replace('.zip', '')}`
    }
    return basePath
}

// prettier-ignore
const validVersions: string[] = [
    '3.0', '3.0.1', '3.0.2', '3.0.3', '3.0.4', '3.0.5', '3.0.6',
    '3.1', '3.1.1', '3.1.2',
    '3.2', '3.2.1', '3.2.2', '3.2.3', '3.2.4',
    '3.3', '3.3.1', '3.3.2', '3.3.3', '3.3.4',
    '3.4', '3.4.1', '3.4.2', '3.4.3', '3.4.4',
]

export function validateVersion(version: string): boolean {
    return validVersions.includes(version)
}
