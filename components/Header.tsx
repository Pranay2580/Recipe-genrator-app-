
import React from 'react';

interface HeaderProps {
    onShowFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowFavorites }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <svg className="w-10 h-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.384,10.334C20.03,3.36,13.251,2.2,12.022,2.2c-1.229,0-8.008,1.16-9.362,8.135c-1.22,6.275,2.735,9.457,5.516,10.088c0.313,0.071,0.613-0.016,0.83-0.233c0.216-0.217,0.304-0.518,0.232-0.83c-0.575-2.513,0.485-5.55,0.485-5.55s3.037,0.912,5.55,0.485c0.312-0.071,0.613,0.016,0.83,0.232c0.216,0.217,0.303,0.518,0.232,0.83c-0.629,2.78,2.819,6.737,10.089,5.517C28.841,19.782,22.604,16.608,21.384,10.334z M12,13.5c-1.104,0-2-0.896-2-2s0.896-2,2-2s2,0.896,2,2S13.104,13.5,12,13.5z" /></svg>
                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-800">Smart Recipe Generator</h1>
                </div>
                <button onClick={onShowFavorites} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow hover:shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    <span className="hidden sm:inline">Favorites</span>
                </button>
            </div>
        </header>
    );
};