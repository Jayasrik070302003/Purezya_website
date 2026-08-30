import React from 'react';

const isCustomAvatar = (url) => {
    if (!url || typeof url !== 'string') return false;
    // Exclude old stock photo
    if (url.includes('photo-1633332755192-727a05c4013d')) return false;
    return true;
};

const OrganicAvatar = ({ src, name = '', size = 'md', className = '' }) => {
    const validSrc = isCustomAvatar(src) ? src : null;
    const initial = name ? name.trim().charAt(0).toUpperCase() : '';

    if (validSrc) {
        return (
            <img
                src={validSrc}
                alt={name || 'User'}
                className={`w-full h-full object-cover select-none ${className}`}
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
            />
        );
    }

    return (
        <div
            className={`w-full h-full relative flex items-center justify-center bg-gradient-to-br from-[#1C4626] via-[#14261C] to-[#09150C] text-white select-none overflow-hidden ${className}`}
        >
            {/* Ambient Botanical Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(105,240,174,0.3),transparent_70%)]" />
            
            {/* Flat Leaf Accent Graphic */}
            <svg
                className="absolute -right-2 -bottom-2 w-3/4 h-3/4 text-[#69F0AE] opacity-15 pointer-events-none"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4C6.2 19.5 6 18.5 6 17.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5c0 1-.2 2-.6 2.9C21.2 18.6 23 15.5 23 12c0-5.5-4.5-10-11-10z" />
            </svg>

            {initial ? (
                <span className="relative z-10 font-display font-black text-[#A5D6A7] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] text-[120%] leading-none">
                    {initial}
                </span>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-1/2 h-1/2 relative z-10 text-[#A5D6A7]"
                >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )}
        </div>
    );
};

export default OrganicAvatar;
