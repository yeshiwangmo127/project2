import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 sm:py-8 mt-8">
      <div className="container mx-auto px-2 sm:px-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h3 className="text-lg sm:text-2xl font-bold mb-2">Pure Path Medical</h3>
          <ul className="mt-2 sm:mt-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
            <li>Email: info@purepath.com</li>
            <li>Phone: +123-678-9234</li>
            <li>Address: California, United States</li>
          </ul>
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="text-lg sm:text-xl font-bold mb-1">Know about us more on</span>
          <div className="flex flex-wrap gap-2 justify-start">
            {['facebook', 'twitter', 'instagram', 'skype'].map((platform) => (
              <a
                href="#"
                key={platform}
                className="flex items-center gap-1 px-2 py-1 border-2 border-white rounded-lg text-xs font-medium hover:bg-white hover:text-gray-800 transition"
              >
                <i className={`bi bi-${platform} text-base`}></i>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 