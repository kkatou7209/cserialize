const readFromFile = async (file: File): Promise<string> => {
    const data = await file.text();

    return data;
}