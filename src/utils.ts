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
