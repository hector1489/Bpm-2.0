export const extractPercentage = (answer: string): number => {
  const match = answer.match(/^(\d+)%/);
  return match ? parseInt(match[1], 10) : 100;
}

export const getCurrentDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export const estados = ['Abierto', 'En Progreso', 'Cerrado'];

export const calculateSolutionDate = (criticidad: string): string => {
  const today = new Date();
  let daysToAdd = 0;

  if (criticidad === 'green') {
    daysToAdd = 45;
  } else if (criticidad === 'yellow') {
    daysToAdd = 30;
  } else if (criticidad === 'red') {
    daysToAdd = 15;
  }

  const solutionDate = new Date(today.setDate(today.getDate() + daysToAdd));
  const dd = String(solutionDate.getDate()).padStart(2, '0');
  const mm = String(solutionDate.getMonth() + 1).padStart(2, '0');
  const yyyy = solutionDate.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}
