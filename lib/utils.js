export const getBudgetWithRequestedGrantValue = (submission) => [
  { id: 'vaf-grant', name: 'VAF Grant', value: submission.budgetRequested },
  ...submission.budget.income.filter(item => item.id !== 'vaf-grant')
];

export const getBudgetTotal = (values) => values.reduce((total, value) => {
  const thisValue = value?.value ? parseInt(value?.value) : 0;
  return total = total + thisValue;
}, 0);

export const getDifference = (value0, value1) => value0 - value1;

