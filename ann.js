describe('evalFormula', () => {
  it('should evaluate the formula correctly', () => {
    const formula = { value: 'x + 1' };
    const data = [
      { __timestamp: '1627815600000' },
      { __timestamp: '1627902000000' },
    ];

    const result = evalFormula(formula, data);

    expect(result).toEqual([
      [new Date(1627815600000), 1627815600001],
      [new Date(1627902000000), 1627902000001],
    ]);
  });
});
