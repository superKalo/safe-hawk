let isExtension: boolean = false

try {
    if (chrome?.runtime?.id) isExtension = true
} catch (error) {
    // Silent fail
}

export { isExtension }
