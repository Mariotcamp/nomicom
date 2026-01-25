import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { Toast as ToastType } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-green-50 border-green-200',
    iconClass: 'text-green-500',
    textClass: 'text-green-800',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-500',
    textClass: 'text-red-800',
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-500',
    textClass: 'text-blue-800',
  },
};

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-full max-w-sm px-4"
      role="region"
      aria-label="通知"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`flex items-center gap-3 p-3 rounded-xl border shadow-lg ${config.bgClass}`}
              role="alert"
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconClass}`} />
              <p className={`flex-1 text-sm font-medium ${config.textClass}`}>
                {toast.message}
              </p>
              <button
                onClick={() => onRemove(toast.id)}
                className="p-1 rounded-full hover:bg-black/5 transition-colors"
                aria-label="閉じる"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
