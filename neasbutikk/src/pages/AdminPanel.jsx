import { useState } from "react";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar";

function AdminPanel() {
    const [activePage, setActivePage] = useState('dashboard');
    
    return (
        <div className="min-h-screen flex flex-col hide-scrollbar">
            <header>
                <Navbar />
            </header>
            <main className="flex flex-1 p-4 gap-4">
                {/* Sidebar taking 2/5 of the width */}
                <div className="w-2/5">
                    <AdminSidebar onPageChange={setActivePage} />
                </div>
                
                {/* Main content area */}
                <div className="w-3/5 bg-lightgray rounded-lg p-6 shadow-md">
                    <h1 className="text-2xl font-mabry text-pinegreen mb-6">
                        {activePage === 'dashboard' ? 'Dashboard' : 'Admin Panel'}
                    </h1>
                    
                    <div className="bg-white rounded-lg p-6 shadow-sm"> 
                        <p className="font-mabrylight text-pinegreen mb-4">
                            Velg en funksjon fra sidemenyen for å administrere nettbutikken.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-mossgreen/20 rounded-lg p-4 text-center">
                                <h3 className="font-mabry text-pinegreen text-lg mb-2">Produkter</h3>
                                <p className="font-mabrylight text-pinegreen">5 aktive produkter</p>
                            </div>
                            
                            <div className="bg-mossgreen/20 rounded-lg p-4 text-center">
                                <h3 className="font-mabry text-pinegreen text-lg mb-2">Ordrer</h3>
                                <p className="font-mabrylight text-pinegreen">0 ventende ordrer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <FooterMain />
            </footer>
        </div>
    );
}

export default AdminPanel;