import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glass-hover p-6 flex flex-col gap-4"
      style={{ minWidth: '240px' }}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <Icon className="w-6 h-6 text-blue-400" style={{ color: '#3b82f6' }} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend === 'up' ? '+' : '-'}{trendValue}%
          </span>
        )}
      </div>
      <div>
        <p className="text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
