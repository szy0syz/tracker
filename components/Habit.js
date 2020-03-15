import { useState } from 'react';
import HabitButton from './HabitButton';

const colors = ['#718096', '#F56565', '#F6E05E', '#68D391', '#63B3ED'];

const Habit = ({ habit, index }) => {
  const dates = getLast5Days();

  return (
    <acticle>
      <h3 style={{ borderColor: colors[index] }}>{habit.name}</h3>
      <div className="buttons">
        {dates.map(date => (
          <HabitButton key={date.getTime()} date={date} />
        ))}
      </div>
      <style jsx>
        {`
          acticle {
            padding: 20px;
            border-radius: 15px;
            box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
          }
          h3 {
            margin-top: 0;
            border-bottom: solid 4px #718096;
          }
          .buttons {
            display: flex;
          }
        `}
      </style>
    </acticle>
  );
};

// 获取最近五天
const getLast5Days = () => {
  // 函数式
  const dates = '01234'.split('').map(day => {
    const tempDate = new Date();
    // 要不然日期非法
    tempDate.setDate(tempDate.getDate() - day);
    return tempDate;
  });
  return dates;
};

export default Habit;
