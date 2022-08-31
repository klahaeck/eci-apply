import { getBudgetTotal, getDifference, getBudgetWithRequestedGrantValue } from './utils';

export const validateSubmission = (program, submission) => {
  const dollarFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

  const errors = {};
  const { minWorkAssets, maxWorkAssets, questions } = program;
  const { title, contacts, startDate, completionDate, summary, details, bios, budget, budgetRequested, assets } = submission;

  if (!title) {
    errors.title = 'Title is required';
  }

  if (!contacts) {
    errors.contacts = 'Contacts are required';
  } else {
    contacts.forEach(contact => {
      if (!contact.name || !contact.email || !contact.phone_number || !contact.address0 || !contact.city || !contact.county) {
        errors.contacts = 'There is a contact missing a required field';
      }
    });
  }

  if (startDate && completionDate && startDate > completionDate) {
    errors.startDate = 'Start date must be before completion date';
  }

  if (!summary) {
    errors.summary = 'Summary is required';
  }

  if (!details || details.length !== questions.length) {
    errors.details = 'You must answer all questions in the Details section';
  }

  if (bios.length === 0) {
    errors.bios = 'Bios are required';
  }

  bios.forEach(bio => {
    if (!bio.name || !bio.bio) {
      errors.bios = 'There is a bio missing a required field';
    }
  });

  if (!budget || budget?.expenses?.length === 0 || budget?.income?.length === 0) {
    errors.budget = 'Budget is required';
  }

  const budgetTotal = getBudgetTotal(budget.expenses);
  const budgetIncomeItems = getBudgetWithRequestedGrantValue(submission);
  const budgetIncome = getBudgetTotal(budgetIncomeItems);
  const budgetDifference = getDifference(budgetTotal, budgetIncome);
  // console.log(dollarFormatter.format(budgetTotal));
  if (budgetDifference !== 0) {
    errors.budget = `Budget total (${dollarFormatter.format(budgetTotal)}) does not match your income values value (${dollarFormatter.format(budgetRequested)})`;
  }

  if (!assets.length) {
    errors.assets = 'Visual support materials are required';
  }

  if (assets.length < minWorkAssets) {
    errors.assets = `You must add at least ${minWorkAssets} visual support materials`;
  }

  if (assets.length > maxWorkAssets) {
    errors.assets = `You must remove ${assets.length - maxWorkAssets} visual support materials`;
  }

  return errors;
};