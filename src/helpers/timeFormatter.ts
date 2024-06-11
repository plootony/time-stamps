/**
 * Конвертирует секунды в строку формата HH:MM:SS.ss
 * @param seconds - количество секунд
 * @returns Время в формате HH:MM:SS.ss
 */
export function formatTime(seconds: number): string {
    if (seconds < 0) {
        throw new Error('Время не может быть отрицательным')
    }

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = (seconds % 60).toFixed()

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const formattedSeconds = parseFloat(remainingSeconds) < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}