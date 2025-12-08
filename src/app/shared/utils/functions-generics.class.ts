export class FunctionsGenerics {
  static toUpperUnderscore(input: string): string {
    if (!input) return '';
    return input.toUpperCase().replace(/ /g, '_');
  }

  static removeUnderscoreFormat(value: string): string {
    if (!value) return '';
    const cleaned = value.replace(/_/g, ' ').toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
}
