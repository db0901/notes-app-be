/* 
    - ^: This is the start-of-string anchor. It ensures that the matching process starts at the beginning of the string.
    - \d: This is a digit character shorthand in regular expressions. It's equivalent to the character class [0-9], which matches any single digit from 0 to 9.
    - +: This is a quantifier that matches one or more occurrences of the preceding element. In this case, it applies to \d, meaning that the regex will match a sequence of one or more digits.
    - $: This is the end-of-string anchor. It ensures that the matching process goes all the way to the end of the string.
*/
export const isNumericString = new RegExp("^\\d+$");
