import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-20 right-4 md:top-24 md:right-4 z-50 flex flex-col gap-2 md:gap-4 pointer-events-none items-end">
                <AnimatePresence mode='popLayout'>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`${toast.type === 'success' ? 'bg-[#1A2E16] text-[#F3F6F1]' : 'bg-red-900 text-white'
                                } p-3 md:p-4 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-3 md:gap-4 min-w-[200px] max-w-[calc(100vw-32px)] md:w-auto md:min-w-[300px] pointer-events-auto border border-white/10 backdrop-blur-md`}
                        >
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 flex items-center justify-center ${toast.type === 'success' ? 'bg-[#4A7A45] text-white' : 'bg-red-600'
                                }`}>
                                {toast.type === 'success' ? <CheckCircle className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" /> : <AlertCircle className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[9px] md:text-sm uppercase tracking-wider mb-0.5 leading-none md:leading-tight">
                                    {toast.type === 'success' ? 'Success' : 'Error'}
                                </h4>
                                <p className="text-[10px] md:text-sm font-medium opacity-90 truncate md:whitespace-normal">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
