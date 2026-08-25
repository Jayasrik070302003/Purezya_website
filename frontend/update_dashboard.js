const fs = require('fs');
const path = require('path');

const filePath = 'c:/abi project/frontend/src/pages/AdminDashboard.jsx';
const fileContent = fs.readFileSync(filePath, 'utf8');

const startMarker = '{/* Order Details Modal */}';
const endMarker = '</AnimatePresence>';

const startIndex = fileContent.lastIndexOf(startMarker);
const endIndex = fileContent.lastIndexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find markers');
    process.exit(1);
}

// Check if indices make sense
if (startIndex >= endIndex) {
    console.error('Start index is after End index');
    process.exit(1);
}

// Define New Content
const newModalContent = `{/* Order Details Modal */}
                    <AnimatePresence>
                        {isOrderDetailsModalOpen && selectedOrderDetails && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsOrderDetailsModalOpen(false)}
                                    className="absolute inset-0 bg-earthy-900/60 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
                                >
                                     {/* Modal Header */}
                                     <div className="px-8 py-6 border-b border-earthy-100 flex justify-between items-center bg-white sticky top-0 z-20">
                                         <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                 <h2 className="text-2xl font-bold font-display text-earthy-900">Order Details</h2>
                                                 <span className="bg-organic-50 text-organic-700 px-3 py-1 rounded-full text-sm font-bold border border-organic-100 flex items-center gap-1">
                                                     <span className="w-1.5 h-1.5 rounded-full bg-organic-500"></span>
                                                     #{selectedOrderDetails.id}
                                                 </span>
                                            </div>
                                            <p className="text-earthy-500 text-sm flex items-center gap-2">
                                                Placed on <span className="font-medium text-earthy-700">{new Date(selectedOrderDetails.created_at).toLocaleString()}</span>
                                            </p>
                                         </div>
                                         <div className="flex items-center gap-3">
                                             <span className={\`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 shadow-sm
                                                \${selectedOrderDetails.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                  selectedOrderDetails.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                  selectedOrderDetails.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                  'bg-amber-50 text-amber-700 border-amber-100'
                                                }\`}>
                                                {selectedOrderDetails.status === 'Delivered' ? <Check size={14} /> : 
                                                 selectedOrderDetails.status === 'Cancelled' ? <X size={14} /> : 
                                                 <div className="w-2 h-2 rounded-full bg-current animate-pulse" />}
                                                {selectedOrderDetails.status}
                                             </span>
                                             <button onClick={() => setIsOrderDetailsModalOpen(false)} className="bg-earthy-50 p-2 rounded-full hover:bg-earthy-100 transition-colors border border-earthy-100 text-earthy-500 hover:text-earthy-900">
                                                 <X size={20} />
                                             </button>
                                         </div>
                                     </div>

                                     {/* Modal Content - Scrollable */}
                                     <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-white to-earthy-50/30">
                                         
                                         {/* Info Cards Grid */}
                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                             {[
                                                 { icon: User, title: 'Customer', content: (
                                                     <>
                                                        <p className="font-bold text-earthy-900 text-lg mb-0.5">{selectedOrderDetails.user_name || 'Guest'}</p>
                                                        <p className="text-earthy-500 text-sm mb-1">{selectedOrderDetails.user_email}</p>
                                                        <p className="text-earthy-500 text-sm flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-earthy-300"></span> {selectedOrderDetails.phone || 'No phone'}</p>
                                                     </>
                                                 )},
                                                 { icon: DollarSign, title: 'Payment', content: (
                                                     <>
                                                       <div className="flex justify-between items-center mb-1">
                                                           <span className="text-earthy-500 text-sm">Method</span>
                                                           <span className="font-bold text-earthy-800">{selectedOrderDetails.payment_method || 'Online'}</span>
                                                       </div>
                                                       <div className="flex justify-between items-center mt-3 pt-3 border-t border-earthy-100/50">
                                                           <span className="text-earthy-500 text-sm font-medium">Total Paid</span>
                                                           <span className="font-bold text-organic-700 text-xl font-display">₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                       </div>
                                                     </>
                                                 )},
                                                 { icon: Package, title: 'Shipping', content: (
                                                     <p className="text-sm text-earthy-600 leading-relaxed font-medium">
                                                          {selectedOrderDetails.shipping_address 
                                                              ? (typeof selectedOrderDetails.shipping_address === 'string' && selectedOrderDetails.shipping_address.startsWith('{') 
                                                                  ? 'Address details available on file' 
                                                                  : selectedOrderDetails.shipping_address)
                                                              : 'No shipping address provided.'}
                                                     </p>
                                                 )}
                                             ].map((card, idx) => (
                                                 <div key={idx} className="bg-white p-6 rounded-2xl border border-earthy-100 shadow-sm hover:shadow-md transition-all group">
                                                     <div className="flex items-center gap-3 mb-4">
                                                         <div className="p-2.5 rounded-xl bg-earthy-50 text-organic-600 group-hover:scale-110 transition-transform duration-300 border border-earthy-100">
                                                             <card.icon size={18} />
                                                         </div>
                                                         <h4 className="font-bold text-earthy-400 uppercase tracking-widest text-xs">{card.title}</h4>
                                                     </div>
                                                     <div className="pl-1">
                                                         {card.content}
                                                     </div>
                                                 </div>
                                             ))}
                                         </div>

                                         {/* Order Items Section */}
                                         <div className="bg-white rounded-2xl border border-earthy-100 shadow-sm overflow-hidden">
                                             <div className="px-6 py-4 bg-earthy-50/50 border-b border-earthy-100 flex justify-between items-center">
                                                 <h3 className="font-bold text-earthy-900 flex items-center gap-2">
                                                     <ShoppingBag size={18} className="text-earthy-400" /> Order Items 
                                                     <span className="text-xs font-normal text-earthy-500 ml-1">({selectedOrderDetails.items ? selectedOrderDetails.items.length : 0} items)</span>
                                                 </h3>
                                             </div>
                                             
                                             <div>
                                                 {selectedOrderDetails.isLoading ? (
                                                      <div className="flex justify-center p-12">
                                                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-organic-600"></div>
                                                      </div>
                                                 ) : selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? (
                                                     <div className="divide-y divide-earthy-50">
                                                         {selectedOrderDetails.items.map((item, idx) => (
                                                             <div key={idx} className="p-6 flex items-center gap-6 hover:bg-earthy-50/30 transition-colors group">
                                                                 {/* Product Icon/Image Placeholder */}
                                                                 <div className="w-16 h-16 rounded-xl bg-earthy-100 flex items-center justify-center text-earthy-400 border border-earthy-200 group-hover:border-organic-200 group-hover:bg-organic-50 group-hover:text-organic-600 transition-all">
                                                                     <Leaf size={24} />
                                                                 </div>
                                                                 
                                                                 {/* Product Details */}
                                                                 <div className="flex-1">
                                                                     <h4 className="font-bold text-earthy-900 text-lg mb-1">{item.product_name}</h4>
                                                                     <div className="flex items-center gap-3 text-sm text-earthy-500">
                                                                         <span className="font-medium">ID: {item.product_id || 'N/A'}</span>
                                                                         <span className="w-1 h-1 rounded-full bg-earthy-300"></span>
                                                                         <span>Unit Price: ₹{parseFloat(item.price).toFixed(2)}</span>
                                                                     </div>
                                                                 </div>

                                                                 {/* Quantity Badge */}
                                                                 <div className="px-4 py-1.5 rounded-lg bg-earthy-50 border border-earthy-100 text-earthy-600 font-bold text-sm">
                                                                     Qty: {item.quantity}
                                                                 </div>

                                                                 {/* Total Price */}
                                                                 <div className="text-right min-w-[100px]">
                                                                     <span className="block font-bold text-earthy-900 text-lg">₹{(item.quantity * item.price).toFixed(2)}</span>
                                                                 </div>
                                                             </div>
                                                         ))}
                                                     </div>
                                                 ) : (
                                                     <div className="text-center p-12">
                                                         <p className="text-earthy-400">No items found for this order.</p>
                                                     </div>
                                                 )}
                                             </div>
                                             
                                             {/* Summary Footer */}
                                             <div className="bg-earthy-50/50 p-6 border-t border-earthy-100">
                                                 <div className="flex flex-col gap-2 max-w-xs ml-auto">
                                                     <div className="flex justify-between text-earthy-500 text-sm">
                                                         <span>Subtotal</span>
                                                         <span>₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                     </div>
                                                     <div className="flex justify-between text-earthy-500 text-sm">
                                                         <span>Shipping</span>
                                                         <span>Free</span>
                                                     </div>
                                                     <div className="flex justify-between text-earthy-900 font-bold text-lg pt-2 border-t border-earthy-200 mt-2">
                                                         <span>Total Amount</span>
                                                         <span className="text-organic-700">₹{parseFloat(selectedOrderDetails.total_amount).toFixed(2)}</span>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>`;

// Replacement
const updatedContent = fileContent.substring(0, startIndex) + newModalContent + fileContent.substring(endIndex + endMarker.length);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully updated AdminDashboard.jsx');
