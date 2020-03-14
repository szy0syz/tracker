import { useState } from 'react';

const HabitButton = () => {
  const [complete, setComplete] = useState(false);
  return <button onClick={() => setComplete(!complete)}>{complete ? 'X' : 'O'}</button>;
};

export default HabitButton;
