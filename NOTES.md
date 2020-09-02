function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const author1 = a.author.toUpperCase();
    const author2 = b.author.toUpperCase();
    let comparison = 0;
    if (author1 > author2) {
        comparison = 1;
    } else if (author1 < author2) {
        comparison = -1;
    } return comparison;
}