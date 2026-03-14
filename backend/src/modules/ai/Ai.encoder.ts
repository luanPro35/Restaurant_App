export function encode(product: string, allProducts: string[]) {
    const encoded: Record<string, number> = {};
    allProducts.forEach(name => {
        encoded[name] = product === name ? 1 : 0;
    });
    return encoded;
}
