type CsvText = string;

/**
 * 
 * @param file 
 * @param fileEncoding 
 */
const readFromFile = async (file: File, fileEncoding: string = 'UTF-8'): Promise<CsvText> => {
    const reader = new FileReader();

    const promise = (): Promise<CsvText> => {
        const p = new Promise<CsvText>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as CsvText);
            reader.onerror = () => reject(new Error('Failed to read file.'));
        });

        reader.readAsText(file, fileEncoding);

        return p;
    };

    const text = promise();

    return text;

}

export { readFromFile };