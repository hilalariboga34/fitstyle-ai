import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Backend'e kayıt isteği gönder
      const response = await registerUser({
        email: formData.email,
        password: formData.password
      });
      
      setSuccess('Kayıt başarıyla tamamlandı! Giriş sayfasına yönlendiriliyorsunuz...');
      
      // 2 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                 {/* Arka plan dekoratif elementler */}
           <div className="absolute inset-0 overflow-hidden">
             <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
             
             {/* Alışveriş temalı hareketli elementler */}
             <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce opacity-60">
               <svg className="w-8 h-8 text-white mx-auto mt-4" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
               </svg>
             </div>
             
             <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}>
               <svg className="w-6 h-6 text-white mx-auto mt-3" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
               </svg>
             </div>
             
             <div className="absolute bottom-32 left-20 w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}>
               <svg className="w-7 h-7 text-white mx-auto mt-3.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
               </svg>
             </div>
             
             <div className="absolute bottom-20 right-10 w-10 h-10 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1.5s'}}>
               <svg className="w-5 h-5 text-white mx-auto mt-2.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
             </div>
             
             {/* Uçan kıyafet ikonları */}
             <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-float opacity-50">
               <svg className="w-4 h-4 text-white mx-auto mt-2" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                 <circle cx="9" cy="7" r="4"/>
                 <path d="m22 21-2-2"/>
                 <path d="M16 16l4 4"/>
               </svg>
             </div>
             
             <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}>
               <svg className="w-3 h-3 text-white mx-auto mt-1.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
               </svg>
             </div>
           </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Kayıt Ol
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            FitStyle AI'ya hoş geldiniz! Hesabınızı oluşturun
          </p>
        </div>
        
        {/* Form */}
        <div className="glass bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Ad ve Soyad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Ad
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Adınız"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Soyad
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* E-posta */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

                             {/* Şifre */}
               <div>
                 <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                   Şifre
                 </label>
                 <div className="relative">
                   <input
                     id="password"
                     name="password"
                     type={showPassword ? "text" : "password"}
                     autoComplete="new-password"
                     required
                     className="w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                     placeholder="En az 6 karakter"
                     value={formData.password}
                     onChange={handleChange}
                   />
                   <button
                     type="button"
                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
                     onClick={() => setShowPassword(!showPassword)}
                   >
                     {showPassword ? (
                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                       </svg>
                     ) : (
                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                     )}
                   </button>
                 </div>
               </div>

                             {/* Şifre Tekrar */}
               <div>
                 <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                   Şifre Tekrar
                 </label>
                 <div className="relative">
                   <input
                     id="confirmPassword"
                     name="confirmPassword"
                     type={showConfirmPassword ? "text" : "password"}
                     autoComplete="new-password"
                     required
                     className="w-full px-4 py-3 pr-12 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                     placeholder="Şifrenizi tekrar girin"
                     value={formData.confirmPassword}
                     onChange={handleChange}
                   />
                   <button
                     type="button"
                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   >
                     {showConfirmPassword ? (
                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                       </svg>
                     ) : (
                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                     )}
                   </button>
                 </div>
               </div>
            </div>

            {/* Hata ve Başarı Mesajları */}
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm shadow-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm shadow-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            {/* Kayıt Ol Butonu */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
                {isLoading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
              </button>
            </div>

            {/* Giriş Yap Linki */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors duration-200">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 