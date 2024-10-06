
export const estados = ['Abierto', 'En Progreso', 'Cerrado'];
export const criticidad = [
  { valor: 'Leve', clase: 'prioridad-leve', dias: 45 },
  { valor: 'Moderado', clase: 'prioridad-moderada', dias: 30 },
  { valor: 'Crítico', clase: 'prioridad-critica', dias: 15 }
];

export const crearSelectEstado = (): HTMLSelectElement => {
  const select = document.createElement('select');

  estados.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    select.appendChild(option);
  });

  return select;
};

export const crearSelectCriticidad = (): HTMLSelectElement => {
  const select = document.createElement('select');

  criticidad.forEach(criticidad => {
    const option = document.createElement('option');
    option.value = criticidad.valor;
    option.textContent = criticidad.valor;
    select.appendChild(option);
  });

  return select;
}

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
};

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


export const getColorByPercentage = (percentage: number) => {
  if (percentage >= 90) return 'green';
  if (percentage >= 75) return 'yellow';
  return 'red';
}

export const getColorByPercentageLum = (percentage: number) => {
  if (percentage >= 90) {
    return 'bg-light-green';
  } else if (percentage >= 70) {
    return 'bg-yellow';
  } else if (percentage >= 50) {
    return 'bg-red';
  } else {
    return 'bg-danger';
  }
}


