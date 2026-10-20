import { motion } from 'framer-motion';

export const VaultTransition = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex pointer-events-none overflow-hidden"
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-1/2 bg-black border-r-2 border-gold"
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
      />
      <motion.div
        className="w-1/2 bg-black border-l-2 border-gold"
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
      />
    </motion.div>
  );
};
