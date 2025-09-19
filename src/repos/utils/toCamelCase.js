module.exports = (rows) => {
    const parsedRows = rows.map(row => {
        const replaced = {}
        for (const key in row) {
            const camelCase = key.replace(/([-_][a-z])/gi, ($1) => {
                return $1.toUpperCase().replace('-', '');
            });

            replaced[camelCase] = row[key];
        }
        return replaced;
    });
    return parsedRows;
};