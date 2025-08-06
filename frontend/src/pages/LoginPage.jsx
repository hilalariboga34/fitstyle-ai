import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser({
        email: email,
        password: password
      });

      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        navigate('/'); // Ana sayfaya yönlendir
        window.location.reload(); // Sayfanın yenilenerek header'ın güncellenmesini sağla
      }
    } catch (err) {
      setError(err.message || "Giriş bilgileri hatalı. Lütfen kontrol edip tekrar deneyin.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                 {/* Arka plan dekoratif elementler */}
           <div className="absolute inset-0 overflow-hidden">
             <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
             
             {/* Alışveriş temalı hareketli elementler */}
             <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce opacity-60">
               <svg className="w-8 h-8 text-white mx-auto mt-4" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
               </svg>
             </div>
             
             <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}>
               <svg className="w-6 h-6 text-white mx-auto mt-3" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
               </svg>
             </div>
             
             <div className="absolute bottom-32 left-20 w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}>
               <svg className="w-7 h-7 text-white mx-auto mt-3.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
               </svg>
             </div>
             
             <div className="absolute bottom-20 right-10 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1.5s'}}>
               <svg className="w-5 h-5 text-white mx-auto mt-2.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
             </div>
             
             {/* Uçan kıyafet ikonları */}
             <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-float opacity-50">
               <svg className="w-4 h-4 text-white mx-auto mt-2" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                 <circle cx="9" cy="7" r="4"/>
                 <path d="m22 21-2-2"/>
                 <path d="M16 16l4 4"/>
               </svg>
             </div>
             
             <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float opacity-50" style={{animationDelay: '2s'}}>
               <svg className="w-3 h-3 text-white mx-auto mt-1.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
               </svg>
             </div>
           </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Giriş Yap
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            FitStyle AI'ya tekrar hoş geldiniz!
          </p>
        </div>

        {/* Form */}
        <div className="glass bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Hata Mesajı */}
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-posta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

                         {/* Şifre */}
             <div>
               <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                 Şifre
               </label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
                 <input
                   type={showPassword ? "text" : "password"}
                   id="password"
                   className="w-full pl-10 pr-12 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Şifrenizi girin"
                   required
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

            {/* Giriş Yap Butonu */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>

            {/* Kayıt Ol Linki */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{' '}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
