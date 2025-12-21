import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        sifre: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

   
    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const user = JSON.parse(userString);
            if (user.rol === 'yazar') {
                navigate('/admin');
            }
        }
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.sifre) {
            setError('Lütfen tüm alanları doldurun');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    sifre: formData.sifre
                }),
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (!response.ok) {
                console.error('Login failed:', data);
                throw new Error(data.error || data.message || 'Giriş yapılamadı');
            }

            if (data.success && data.user) {
               
                if (data.user.rol !== 'yazar') {
                    setError('Bu panel sadece yazarlar için erişilebilir!');
                    setLoading(false);
                    return;
                }
                

               
                localStorage.setItem('user', JSON.stringify(data.user));
                window.dispatchEvent(new Event("userChange"));
               
                navigate('/admin');
            } else {
                setError(data.message || 'Giriş yapılamadı');
            }
        } catch (error: any) {
            console.error('Login hatası:', error);
            setError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
               
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Girişi</h1>
                    <p className="text-gray-600">Yazar paneline erişmek için giriş yapın</p>
                </div>

               
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                     
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                                    placeholder="Email adresinizi girin"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                    
                        <div>
                            <label htmlFor="sifre" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="sifre"
                                    name="sifre"
                                    value={formData.sifre}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                                    placeholder="Şifrenizi girin"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                       
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Giriş yapılıyor...
                                </div>
                            ) : (
                                'Admin Paneline Giriş'
                            )}
                        </button>
                    </form>

                 
                    <div className="mt-6 text-center space-y-3">
                        <Link
                            to="/login"
                            className="block text-sm text-orange-600 hover:text-orange-800 transition-colors"
                        >
                            Normal kullanıcı girişi →
                        </Link>
                        <Link
                            to="/"
                            className="block text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Anasayfaya dön
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;