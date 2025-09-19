module.exports = (rows) => {
    const parsedRows = rows.map(row => {
        const replaced = {}
        for (const key in row) {
            console.log('key:', key);
            const camelCase = key.replace(/([-_][a-z])/gi, ($1) => {
                return $1.toUpperCase().replace('-', '');
            });
            console.log('camelCase:', camelCase);
            replaced[camelCase] = row[key];
        }
        return replaced;
    });
    return parsedRows;
};