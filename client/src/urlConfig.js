export const apiUrl = process.env.SERVER
export const generatePublicUrl = (fileName) => {
    return `${apiUrl}/public/${fileName}`
}