type LogContext = Record<string, unknown>

type SerializedError = {
    name: string
    message: string
    stack?: string
    cause?: SerializedError
}

const serializeError = (error: unknown, depth = 0): SerializedError => {
    if (!(error instanceof Error)) {
        return {
            name: 'UnknownError',
            message: String(error)
        }
    }

    const serialized: SerializedError = {
        name: error.name,
        message: error.message,
        stack: error.stack
    }

    const cause = (error as Error & { cause?: unknown }).cause
    if (cause && depth < 5) {
        serialized.cause = serializeError(cause, depth + 1)
    }

    return serialized
}

const writeLog = (
    stream: NodeJS.WriteStream,
    level: 'info' | 'error',
    event: string,
    context: LogContext = {}
) => {
    stream.write(
        `${JSON.stringify({
            timestamp: new Date().toISOString(),
            level,
            event,
            ...context
        })}\n`
    )
}

const logInfo = (event: string, context: LogContext = {}) => {
    writeLog(process.stdout, 'info', event, context)
}

const logError = (event: string, error: unknown, context: LogContext = {}) => {
    writeLog(process.stderr, 'error', event, {
        ...context,
        error: serializeError(error)
    })
}

export { logError, logInfo, serializeError }
