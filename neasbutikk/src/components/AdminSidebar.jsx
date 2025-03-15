import { useState } from 'react';
import { 
  FaBox, 
  FaTags, 
  FaChartLine, 
  FaCog, 
  FaUsers, 
  FaClipboardList, 
  FaEdit,
  FaPlus,
  FaTrash,
  FaImages,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';

function AdminSidebar() {
    const [activeSection, setActiveSection] = useState('products');
    const [expandedMenus, setExpandedMenus] = useState({
        products: true,
        orders: false,
        customers: false,
        settings: false
    });

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="h-full bg-pinegreen text-white rounded-lg shadow-xl p-4 overflow-y-auto">
            <div className="mb-8">
                <h2 className="font-mabry text-2xl text-mossgreen mb-2">Admin Panel</h2>
                <p className="font-mabrylight text-sm text-gray-300">Administrer nettbutikken</p>
            </div>
            
            {/* Navigation Menu */}
            <nav className="space-y-1">
                {/* Products Section */}
                <div>
                    <button 
                        onClick={() => toggleMenu('products')}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-pinegreen-footer transition-all duration-200"
                    >
                        <div className="flex items-center">
                            <FaBox className="mr-3 text-mossgreen" />
                            <span className="font-mabry">Produkter</span>
                        </div>
                        {expandedMenus.products ? <FaChevronDown className="text-mossgreen" /> : <FaChevronRight className="text-mossgreen" />}
                    </button>
                    
                    {expandedMenus.products && (
                        <div className="pl-10 pr-2 py-2 space-y-1 font-mabrylight">
                            <button 
                                onClick={() => handleSectionClick('addProduct')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'addProduct' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <FaPlus className="mr-2 text-sm" />
                                <span>Legg til produkt</span>
                            </button>
                            <button 
                                onClick={() => handleSectionClick('editProducts')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'editProducts' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <FaEdit className="mr-2 text-sm" />
                                <span>Rediger produkter</span>
                            </button>
                            <button 
                                onClick={() => handleSectionClick('manageImages')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'manageImages' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <FaImages className="mr-2 text-sm" />
                                <span>Administrer bilder</span>
                            </button>
                            <button 
                                onClick={() => handleSectionClick('categories')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'categories' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <FaTags className="mr-2 text-sm" />
                                <span>Kategorier</span>
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Orders Section */}
                <div>
                    <button 
                        onClick={() => toggleMenu('orders')}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-pinegreen-footer transition-all duration-200"
                    >
                        <div className="flex items-center">
                            <FaClipboardList className="mr-3 text-mossgreen" />
                            <span className="font-mabry">Ordrer</span>
                        </div>
                        {expandedMenus.orders ? <FaChevronDown className="text-mossgreen" /> : <FaChevronRight className="text-mossgreen" />}
                    </button>
                    
                    {expandedMenus.orders && (
                        <div className="pl-10 pr-2 py-2 space-y-1 font-mabrylight">
                            <button 
                                onClick={() => handleSectionClick('viewOrders')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'viewOrders' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <span>Alle ordrer</span>
                            </button>
                            <button 
                                onClick={() => handleSectionClick('pendingOrders')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'pendingOrders' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <span>Ventende ordrer</span>
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Analytics Section */}
                <button 
                    onClick={() => handleSectionClick('analytics')}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeSection === 'analytics' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                >
                    <FaChartLine className="mr-3 text-mossgreen" />
                    <span className="font-mabry">Statistikk</span>
                </button>
                
                {/* Settings */}
                <div>
                    <button 
                        onClick={() => toggleMenu('settings')}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-pinegreen-footer transition-all duration-200"
                    >
                        <div className="flex items-center">
                            <FaCog className="mr-3 text-mossgreen" />
                            <span className="font-mabry">Innstillinger</span>
                        </div>
                        {expandedMenus.settings ? <FaChevronDown className="text-mossgreen" /> : <FaChevronRight className="text-mossgreen" />}
                    </button>
                    
                    {expandedMenus.settings && (
                        <div className="pl-10 pr-2 py-2 space-y-1 font-mabrylight">
                            <button 
                                onClick={() => handleSectionClick('siteSettings')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'siteSettings' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <span>Nettside innstillinger</span>
                            </button>
                            <button 
                                onClick={() => handleSectionClick('users')}
                                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === 'users' ? 'bg-mossgreen text-pinegreen' : 'hover:bg-pinegreen-footer'}`}
                            >
                                <span>Administrer brukere</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default AdminSidebar;