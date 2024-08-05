export class DataGenerator {
    private static randomLetters(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    private static randomCharacters(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    public static createRandomEmail(): string {
        const email = `testUser${this.generateRandomString(5)}@automation.cedar`;
        return email;
    }

    public static createRandomPassword(): string {
   // Generate a password with 14 characters, a combination of uppercase letters, lowercase letters, numbers, and symbols
   const password = this.generateRandomPassword(14);
   return password;
    }

    private static generateRandomString(length: number): string {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    private static generateRandomPassword(length: number): string {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numericChars = '0123456789';
        const specialChars = '!@#$%^&*()';
    
        const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars;
    
        // Ensure at least one character from each set is included
        const randomUppercase = uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
        const randomLowercase = lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
        const randomNumeric = numericChars.charAt(Math.floor(Math.random() * numericChars.length));
        const randomSpecial = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    
        // Generate the rest of the characters
        let restLength = length - 4; // Subtract 4 for the characters we've already ensured
        let restChars = '';
        for (let i = 0; i < restLength; i++) {
          const randomIndex = Math.floor(Math.random() * allChars.length);
          restChars += allChars.charAt(randomIndex);
        }
    
        // Shuffle the characters (optional)
        const shuffledChars = randomUppercase + randomLowercase + randomNumeric + randomSpecial + restChars;
        const shuffledPassword = this.shuffleString(shuffledChars);
    
        return shuffledPassword;
      }

      private static shuffleString(str: string): string {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
      }
    
}
