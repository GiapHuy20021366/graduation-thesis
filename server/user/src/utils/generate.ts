export const generateRandomPassword = (): string => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const digitChars = '0123456789';
    const specialChars = '@#$?';

    const getRandomChar = (charSet: string) => {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        return charSet.charAt(randomIndex);
    };

    // Ensure at least one character from each character set
    const randomUppercase = getRandomChar(uppercaseChars);
    const randomLowercase = getRandomChar(lowercaseChars);
    const randomDigit = getRandomChar(digitChars);
    const randomSpecial = getRandomChar(specialChars);

    // Fill the remaining characters with random choices
    const remainingChars = Array.from({ length: 4 }, () => {
        const allChars = uppercaseChars + lowercaseChars + digitChars;
        return getRandomChar(allChars);
    });

    // Concatenate all characters and shuffle the result
    const allChars = [randomUppercase, randomLowercase, randomDigit, randomSpecial, ...remainingChars];
    const shuffledChars = allChars.sort(() => Math.random() - 0.5);

    // Convert the array to a string
    const randomString = shuffledChars.join('');

    return randomString;
}
