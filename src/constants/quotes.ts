export interface Quote {
  text: string;
  author: string;
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { text: 'Take care of your body. It’s the only place you have to live.', author: 'Jim Rohn' },
  { text: 'A healthy outside starts from the inside.', author: 'Robert Urich' },
  { text: 'The groundwork for all happiness is good health.', author: 'Leigh Hunt' },
  { text: 'Small steps every day add up to big results.', author: 'Unknown' },
  { text: 'Your body can do it. It’s your mind you need to convince.', author: 'Unknown' },
  { text: 'Discipline is choosing what you want most over what you want now.', author: 'Unknown' },
  { text: 'Wellness is the natural state of the body.', author: 'Unknown' },
  { text: 'Progress, not perfection.', author: 'Unknown' },
  { text: 'The only bad workout is the one that didn’t happen.', author: 'Unknown' },
  { text: 'Drink water, move daily, sleep well, repeat.', author: 'Unknown' },
];

/** Deterministic quote-of-the-day based on the calendar day. */
export function quoteOfTheDay(date: Date = new Date()): Quote {
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  return MOTIVATIONAL_QUOTES[dayIndex % MOTIVATIONAL_QUOTES.length]!;
}
